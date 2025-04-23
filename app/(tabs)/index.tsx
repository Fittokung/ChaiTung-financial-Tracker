import React from "react";
import { View, Text, ScrollView, Image, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";

const transactions = [
  {
    id: 1,
    type: "expense",
    title: "Coffee",
    description: "Law Coffee",
    amount: -80,
    time: "09:45 AM",
    icon: require("../../assets/images/icon.png"),
  },
  {
    id: 2,
    type: "expense",
    title: "Food",
    description: "KFC",
    amount: -120,
    time: "10:30 AM",
    icon: require("../../assets/images/icon.png"),
  },
  {
    id: 3,
    type: "income",
    title: "Salary",
    description: "Monthly salary",
    amount: 25000,
    time: "11:00 AM",
    icon: require("../../assets/images/icon.png"),
  },
];

const formatAmount = (amount: number) =>
  amount.toLocaleString("en-US", { minimumFractionDigits: 0 });

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>Good morning, Kittiwat Yasarawan</Text>

      <View style={styles.balanceBox}>
        <Text style={styles.totalBalance}>฿24,800</Text>
        <View style={styles.incomeExpenseRow}>
          <Text style={styles.income}>Income: ฿25,000</Text>
          <Text style={styles.expense}>Expense: ฿200</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Transactions</Text>

      <ScrollView style={styles.scrollArea}>
        {transactions.map((item) => (
          <View key={item.id} style={styles.transactionItem}>
            <Image source={item.icon} style={styles.icon} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={[
                  styles.amount,
                  { color: item.amount < 0 ? "red" : "green" },
                ]}
              >
                {item.amount < 0 ? "-" : "+"}฿
                {formatAmount(Math.abs(item.amount))}
              </Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

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
  Box: {
    backgroundColor: "#219EBC",
    borderRadius: 16,
    padding: 20,
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
});
