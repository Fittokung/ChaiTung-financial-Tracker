// app/(tabs)/balance.tsx
import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { format, parseISO } from "date-fns";
import { th } from "date-fns/locale";
import { Transaction } from "../../lib/storage";
import { categories, Category } from "../../lib/categoryData";
import { useTransactions } from "../../hooks/useTransactions";

const BalanceScreen = () => {
  const { transactions, balance, loading } = useTransactions();
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด"); // State สำหรับประเภทที่เลือก

  // สร้าง Map สำหรับค้นหาไอคอนจากชื่อ category ได้ง่ายขึ้น
  const categoryIconMap = useMemo(() => {
    const map = new Map<string, any>(); // ImageSourcePropType is 'any' basically
    categories.forEach((cat) => {
      map.set(cat.name, cat.icon);
    });
    return map;
  }, [categories]);

  // สร้างรายการประเภทสำหรับ Picker (รวม "ทั้งหมด")
  const categoryOptions = useMemo(
    () => ["ทั้งหมด", ...categories.map((cat) => cat.name)],
    [categories]
  );

  // กรองรายการ transaction ตามประเภทที่เลือก
  const filteredTransactions = useMemo(() => {
    if (selectedCategory === "ทั้งหมด") {
      return transactions; // แสดงทั้งหมดถ้าเลือก "ทั้งหมด"
    }
    return transactions.filter((t) => t.category === selectedCategory);
  }, [transactions, selectedCategory]);

  // ฟังก์ชันสำหรับ render แต่ละรายการ transaction
  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const iconSource =
      categoryIconMap.get(item.category) ||
      require("../../assets/icons/default.png"); // ไอคอนเริ่มต้นถ้าหาไม่เจอ
    return (
      <View style={styles.transactionItem}>
        <View style={styles.transactionIconContainer}>
          <Image source={iconSource} style={styles.transactionIcon} />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={styles.transactionTitle}>{item.title}</Text>
          {item.description ? ( // แสดง description ถ้ามี
            <Text style={styles.transactionDescription}>
              {item.description}
            </Text>
          ) : null}
          <Text style={styles.transactionCategory}>
            ประเภท: {item.category}
          </Text>
          <Text style={styles.transactionDate}>
            {format(parseISO(item.time), "dd MMMM yyyy เวลา HH:mm", {
              locale: th,
            })}
          </Text>
        </View>
        <Text
          style={[
            styles.transactionAmount,
            item.type === "income" ? styles.income : styles.expense,
          ]}
        >
          {item.type === "income" ? "+" : "-"} {item.amount.toLocaleString()} ฿
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* ยอดเงินรวม */}
      <View style={styles.balanceContainer}>
        <Text style={styles.balanceLabel}>ยอดเงินคงเหลือ:</Text>
        <Text style={styles.balanceAmount}>{balance.toLocaleString()} ฿</Text>
      </View>

      {/* ตัวเลือกประเภท */}
      <View style={styles.categoryPickerContainer}>
        <Text style={styles.categoryLabel}>แสดงตามประเภท:</Text>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(String(itemValue))} // Ensure itemValue is string
          style={styles.categoryPicker}
        >
          {categoryOptions.map((option) => (
            <Picker.Item key={option} label={option} value={option} />
          ))}
        </Picker>
      </View>

      {/* รายการ Transaction */}
      <FlatList
        data={filteredTransactions}
        renderItem={renderTransactionItem}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <View style={styles.emptyListContainer}>
            <Text style={styles.emptyListText}>
              ไม่มีรายการในประเภทที่เลือก
            </Text>
          </View>
        }
        style={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  balanceContainer: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    alignItems: "center",
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2196f3", // blue for balance
    marginTop: 8,
  },
  categoryPickerContainer: {
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  categoryLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#555",
  },
  categoryPicker: {
    height: 50,
    width: "100%",
    // color: '#333', // Adjust picker text color =
  },
  list: {
    flex: 1,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  transactionIconContainer: {
    marginRight: 15,
    // Add styling for icon container if needed, e.g., background circle
  },
  transactionIcon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  transactionDescription: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  transactionCategory: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
  transactionDate: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  income: {
    color: "#4caf50", // Green
  },
  expense: {
    color: "#f44336", // Red
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyListText: {
    fontSize: 16,
    color: "#888",
  },
});

export default BalanceScreen;
