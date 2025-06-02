// app/(tabs)/statistic.tsx

import React, { useMemo, useState, useEffect } from "react";
import { View, Text, ScrollView, Dimensions, StyleSheet } from "react-native";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Picker } from "@react-native-picker/picker";
import { format } from "date-fns";
import { th } from "date-fns/locale"; // สำหรับภาษาไทย
import { useTransactions } from "../../hooks/useTransactions";

const screenWidth = Dimensions.get("window").width;

// กำหนดการตั้งค่ากราฟทั่วไป
const chartConfig = {
  backgroundColor: "#ffffff",
  backgroundGradientFrom: "#ffffff",
  backgroundGradientTo: "#ffffff",
  decimalPlaces: 0, // ไม่แสดงทศนิยมสำหรับจำนวนเงิน
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // สีตัวอักษรเริ่มต้น
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  propsForDots: {
    r: "6",
    strokeWidth: "2",
    stroke: "#ffa726",
  },
  barPercentage: 0.5, // ความกว้างของแท่งกราฟ
};

export default function StatisticScreen() {
  const { transactions, loading } = useTransactions();

  // 1. ประมวลผลข้อมูลรายรับรายจ่ายรายเดือน
  const monthlyData = useMemo(() => {
    const data: Record<string, { income: number; expense: number }> = {};
    transactions.forEach((t) => {
      const monthYear = format(new Date(t.time), "yyyy-MM");
      if (!data[monthYear]) {
        data[monthYear] = { income: 0, expense: 0 };
      }
      if (t.type === "income") {
        data[monthYear].income += t.amount;
      } else {
        data[monthYear].expense += Math.abs(t.amount); // Ensure expense is positive for calculation
      }
    });
    return data;
  }, [transactions]);

  // 2. ดึงรายการเดือนทั้งหมดที่มีข้อมูล และเรียงลำดับ
  const allMonths = useMemo(() => {
    return Object.keys(monthlyData).sort();
  }, [monthlyData]);

  // 3. จัดการ State สำหรับเดือนที่เลือก
  const [selectedMonth, setSelectedMonth] = useState("");

  // อัปเดต selectedMonth เมื่อ allMonths เปลี่ยนแปลง หรือเมื่อหน้าจอถูกโหลดครั้งแรก
  // เพื่อให้เดือนที่เลือกตรงกับเดือนล่าสุดที่มีข้อมูลเสมอ
  useEffect(() => {
    if (allMonths.length > 0) {
      // ตั้งค่าเดือนล่าสุดเป็นเดือนที่เลือกเริ่มต้น
      setSelectedMonth(allMonths[allMonths.length - 1]);
    } else {
      setSelectedMonth(""); // ถ้าไม่มีข้อมูลเลย ให้ไม่มีเดือนที่เลือก
    }
  }, [allMonths]); // Dependency on allMonths to react to data changes

  // 4. ดึงข้อมูลรายรับรายจ่ายสำหรับเดือนที่เลือก
  const selectedData = useMemo(() => {
    return monthlyData[selectedMonth] || { income: 0, expense: 0 };
  }, [selectedMonth, monthlyData]);

  // 5. เตรียมข้อมูลสำหรับ Pie Chart (เฉพาะรายรับ/รายจ่ายที่มากกว่า 0)
  const pieChartData = useMemo(() => {
    const data = [
      {
        name: "รายรับ",
        amount: selectedData.income,
        color: "#4caf50", // Green
        legendFontColor: "#333",
        legendFontSize: 14,
      },
      {
        name: "รายจ่าย",
        amount: selectedData.expense,
        color: "#f44336", // Red
        legendFontColor: "#333",
        legendFontSize: 14,
      },
    ].filter((item) => item.amount > 0); // กรองเฉพาะรายการที่มีค่ามากกว่า 0

    return data;
  }, [selectedData]);

  // หากข้อมูลกำลังโหลดอยู่
  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>สถิติรายเดือน</Text>

      {/* Bar Chart: รายรับรายเดือน */}
      <Text style={styles.chartTitle}>รายรับรายเดือน</Text>
      {allMonths.length > 0 ? (
        <BarChart
          data={{
            labels: allMonths.map((m) =>
              format(new Date(m), "MMM", { locale: th })
            ),
            datasets: [
              {
                data: allMonths.map((m) => monthlyData[m].income),
              },
            ],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisLabel="฿"
          yAxisSuffix="" 
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
          }}
          verticalLabelRotation={30}
          style={styles.chartStyle}
        />
      ) : (
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>ไม่มีข้อมูลรายรับ</Text>
        </View>
      )}

      {/* Bar Chart: รายจ่ายรายเดือน */}
      <Text style={styles.chartTitle}>รายจ่ายรายเดือน</Text>
      {allMonths.length > 0 ? (
        <BarChart
          data={{
            labels: allMonths.map((m) =>
              format(new Date(m), "MMM", { locale: th })
            ),
            datasets: [
              {
                data: allMonths.map((m) => monthlyData[m].expense),
              },
            ],
          }}
          width={screenWidth - 32}
          height={220}
          yAxisLabel="฿"
          yAxisSuffix="" 
          chartConfig={{
            ...chartConfig,
            color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`,
          }}
          verticalLabelRotation={30}
          style={styles.chartStyle}
        />
      ) : (
        <View style={styles.chartPlaceholder}>
          <Text style={styles.placeholderText}>ไม่มีข้อมูลรายจ่าย</Text>
        </View>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f5f5f5", // Light grey background
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#333",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 24,
    marginBottom: 12,
    color: "#444",
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: "#ffffff", // White background for charts
    elevation: 3, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  chartPlaceholder: {
    height: 220,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  placeholderText: {
    fontSize: 16,
    color: "#666",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 12,
    marginBottom: 16,
    backgroundColor: "#ffffff",
  },
});
