// lib/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string; // ISO string
};

const STORAGE_KEY = "@chaiTung:transactions";

// ✅ ช่วยให้มั่นใจว่าแปลง JSON ได้ถูกต้อง
const parseTransactions = (data: string | null): Transaction[] => {
  try {
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn("Failed to parse transactions:", e);
    return [];
  }
};

export const saveTransaction = async (
  transaction: Transaction
): Promise<void> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  const current = parseTransactions(data);
  const updated = [...current, transaction];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const getTransactions = async (): Promise<Transaction[]> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  return parseTransactions(data);
};

export const deleteTransaction = async (id: string): Promise<void> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  const current = parseTransactions(data);
  const updated = current.filter((item) => item.id !== id);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const updateTransaction = async (
  updatedTransaction: Transaction
): Promise<void> => {
  const data = await AsyncStorage.getItem(STORAGE_KEY);
  const current = parseTransactions(data);
  const updated = current.map((item) =>
    item.id === updatedTransaction.id ? updatedTransaction : item
  );
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
};

export const clearTransactions = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_KEY);
};
