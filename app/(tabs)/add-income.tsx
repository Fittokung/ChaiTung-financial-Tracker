// add-income.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

const AddIncomeScreen = () => {
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    // Logic to save income goes here
    console.log("Income saved:", { category, amount, date, description });
  };

  // Header component as part of this file
  const Header = ({ backText }: { backText: string }) => (
    <View style={styles.header}>
      <TouchableOpacity>
        <Text style={styles.backText}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerText}>{backText}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header backText="Income" />

      <View style={styles.form}>
        <Text>Select Category</Text>
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={category}
          onChangeText={setCategory}
        />

        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        <TextInput
          style={styles.input}
          placeholder="Date"
          value={date}
          onChangeText={setDate}
        />

        <TextInput
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />

        <Button title="Save" onPress={handleSave} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backText: {
    fontSize: 18,
    marginRight: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  form: {
    marginTop: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default AddIncomeScreen;
