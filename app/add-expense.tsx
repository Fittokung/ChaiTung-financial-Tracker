// app/add-expense.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Header from "../components/Header";
import { addTransaction } from "@/lib/storage";
import { categories } from "@/lib/categoryData";

import { router } from "expo-router";
import { Picker } from "@react-native-picker/picker";

const expenseCategories = [
  "Food",
  "Drink",
  "Coffee",
  "Shopping",
  "Traveling",
  "Clothes",
  "Desert",
  "Appliance",
  "Transportation",
];

export default function AddExpenseScreen() {
  const [category, setCategory] = useState(expenseCategories[0]);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = async () => {
    if (!category || !amount || isNaN(Number(amount))) {
      alert("Please fill in a valid category and amount.");
      return;
    }

    await addTransaction({
      id: Date.now(),
      type: "expense",
      title: category,
      description: description || "-",
      amount: Number(amount),
      time: date.toISOString(),
      category: category,
    });

    router.push("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Header title="Add Expense" />

      <View style={styles.form}>
        <Text style={styles.label}>Category</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            <Picker.Item label="Select a category..." value="" />
            {categories
              .filter((cat) => cat.type === "expense")
              .map((cat) => (
                <Picker.Item key={cat.name} label={cat.name} value={cat.name} />
              ))}
          </Picker>
        </View>

        <Text style={styles.label}>Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="0.00"
          keyboardType="numeric"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={date.toISOString().split("T")[0]}
            editable={false}
          />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Optional"
          value={description}
          onChangeText={setDescription}
        />

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Expense</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  form: {
    marginTop: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "500",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#ff6666",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    overflow: "hidden",
  },
});
