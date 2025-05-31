// lib/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "chaiTungData";

export interface Transaction {
  id: number;
  type: "expense" | "income";
  title: string;
  description: string;
  amount: number;
  time: string;
  category: string;
}

export interface ChaiTungData {
  balance: number;
  transactions: Transaction[];
}

export const getData = async (): Promise<ChaiTungData> => {
  const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
  if (jsonValue != null) {
    return JSON.parse(jsonValue);
  }
  return {
    balance: 10000, // ค่าเริ่มต้น
    transactions: [],
  };
};

export const saveData = async (data: ChaiTungData) => {
  const jsonValue = JSON.stringify(data);
  await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
};

export const addTransaction = async (transaction: Transaction) => {
  const data = await getData();
  data.transactions.unshift(transaction); // ใส่รายการใหม่ไว้บนสุด
  if (transaction.type === "income") {
    data.balance += transaction.amount;
  } else {
    data.balance -= transaction.amount;
  }
  await saveData(data);
};
