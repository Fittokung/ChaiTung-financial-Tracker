import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  Button,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Tabs, router } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { getData, Transaction, saveData } from "@/lib/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format } from "date-fns";

const formatAmount = (amount: number) =>
  amount.toLocaleString("en-US", { minimumFractionDigits: 0 });

export default function HomeScreen() {
  const [showOptions, setShowOptions] = useState(false);
  const [balance, setBalance] = useState(10000);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // โหลดข้อมูล balance และ transactions จาก storage ตอนเริ่มต้น
  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      setBalance(data.balance);
      setTransactions(data.transactions);
    };
    fetchData();
  }, []);

  // ฟังก์ชันลบข้อมูลทั้งหมดและรีเซ็ต balance
  const handleDeleteAllData = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete all data and reset balance?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.clear(); // ลบข้อมูลทั้งหมด
              // รีเซ็ต balance และ transactions
              setBalance(10000);
              setTransactions([]);
              // บันทึกค่าเริ่มต้นกลับลง storage
              await saveData({
                balance: 10000,
                transactions: [],
              });
              Alert.alert("Success", "All data deleted and balance reset.");
            } catch (error) {
              Alert.alert("Error", "Failed to delete data.");
              console.error(error);
            }
          },
        },
      ]
    );
  };

  // คำนวณรายรับ รายจ่าย จาก transactions
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, cur) => acc + cur.amount, 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, cur) => acc + Math.abs(cur.amount), 0);

  // ฟังก์ชันไปหน้าเพิ่มรายจ่าย
  const handleAddExpense = () => {
    setShowOptions(false);
    router.push("/add-expense");
  };

  // ฟังก์ชันไปหน้าเพิ่มรายรับ
  const handleAddIncome = () => {
    setShowOptions(false);
    router.push("/add-income");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good morning, Kittiwat Yasarawan</Text>

      <View style={styles.balanceBox}>
        <Text style={styles.totalBalance}>฿{formatAmount(balance)}</Text>
        <View style={styles.incomeExpenseRow}>
          <Text style={styles.income}>Income: ฿{formatAmount(income)}</Text>
          <Text style={styles.expense}>Expense: ฿{formatAmount(expense)}</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Transactions</Text>

      <ScrollView style={styles.scrollArea}>
        {transactions.length === 0 ? (
          <Text style={{ textAlign: "center", color: "#888" }}>
            No transactions yet.
          </Text>
        ) : (
          transactions.map((item) => (
            <View key={item.id} style={styles.transactionItem}>
              <Image
                source={require("../../assets/images/icon.png")}
                style={styles.icon}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.description}>{item.description}</Text>
              </View>

              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={[
                    styles.amount,
                    { color: item.type === "expense" ? "red" : "green" },
                  ]}
                >
                  {item.type === "expense" ? "-" : "+"}฿
                  {formatAmount(Math.abs(item.amount))}
                </Text>
                <Text style={styles.time}>
                  {format(new Date(item.time), "dd/MM/yyyy")}
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* ปุ่มลบข้อมูลทั้งหมด */}
      <View style={{ marginVertical: 10 }}>
        <Button
          title="Delete All Data and Reset Balance"
          color="red"
          onPress={handleDeleteAllData}
        />
      </View>

      {/* Floating Option Buttons */}
      {showOptions && (
        <View style={styles.optionContainer}>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleAddExpense}
          >
            <Text style={styles.optionText}>+ Expense</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.optionButton}
            onPress={handleAddIncome}
          >
            <Text style={styles.optionText}>+ Income</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowOptions(!showOptions)}
      >
        <FontAwesome name="plus" size={24} color="#fff" />
      </TouchableOpacity>

      <Tabs />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  greeting: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
  balanceBox: {
    backgroundColor: "#E0F7FA",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  totalBalance: {
    fontSize: 32,
    fontWeight: "bold",
  },
  incomeExpenseRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  income: {
    color: "green",
    fontSize: 16,
  },
  expense: {
    color: "red",
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "500",
  },
  scrollArea: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 12,
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    alignItems: "center",
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  description: {
    fontSize: 14,
    color: "#777",
  },
  amount: {
    fontSize: 16,
    fontWeight: "600",
  },
  time: {
    fontSize: 12,
    color: "#888",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007AFF",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  optionContainer: {
    position: "absolute",
    bottom: 100,
    right: 20,
    alignItems: "flex-end",
  },
  optionButton: {
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  clearButtonContainer: {
    position: "absolute",
    bottom: 100,
    right: 120,
    alignItems: "flex-end",
  },
});
