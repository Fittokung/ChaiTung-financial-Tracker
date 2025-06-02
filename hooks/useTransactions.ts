// hooks/useTransactions.ts
import { useState, useEffect, useCallback } from "react";
import { useFocusEffect } from "expo-router"; // ถ้าใช้ Expo Router
import { getData, Transaction as StoredTransaction } from "../lib/storage"; // ต้องแน่ใจว่า import getData และ Transaction มาจาก lib/storage

export function useTransactions() {
  const [transactions, setTransactions] = useState<StoredTransaction[]>([]);
  const [balance, setBalance] = useState<number>(0); // <--- ต้องมีบรรทัดนี้: กำหนด state สำหรับ balance
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      // <--- ต้องแน่ใจว่ามีการ destructure 'balance' (หรือ fetchedBalance) ออกมาจาก getData()
      const { transactions: fetchedTransactions, balance: fetchedBalance } = await getData();
      
      // เรียงลำดับ transactions จากใหม่ไปเก่า
      const sortedTransactions = fetchedTransactions.sort(
        (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
      );
      
      setTransactions(sortedTransactions);
      setBalance(fetchedBalance); // <--- ต้องมีการอัปเดต state balance ด้วยค่าที่ดึงมา
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      // อาจเพิ่มการจัดการข้อผิดพลาด เช่น แสดงข้อความให้ผู้ใช้ทราบ
    } finally {
      setLoading(false);
    }
  }, []);

  // ใช้ useFocusEffect เพื่อให้ข้อมูลอัปเดตเมื่อหน้านั้นถูก focus
  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
      // ไม่ต้องมี cleanup function ในกรณีนี้
    }, [fetchTransactions])
  );

  // ใช้ useEffect สำหรับโหลดข้อมูลครั้งแรกเมื่อคอมโพเนนต์ mount
  // (useFocusEffect ก็ครอบคลุมการโหลดครั้งแรกด้วย แต่มีไว้ก็ไม่เสียหาย)
  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  // <--- สำคัญที่สุด: ต้องแน่ใจว่า return ค่า 'balance' ออกไปด้วย
  return { transactions, balance, loading, refreshTransactions: fetchTransactions };
}