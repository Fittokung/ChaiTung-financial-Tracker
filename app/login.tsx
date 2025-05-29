// app/login.tsx

import React from "react";
import { View, Button, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Image } from "react-native";

export default function LoginScreen() {
  const router = useRouter();

  const handleEnterApp = () => {
    router.replace("/(tabs)"); // เข้าสู่แอปหลัก
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/money-onboard.png")}
        style={styles.logoImage}
      />
      <Text style={styles.title}>Track your money, {"\n"}effirtlessly</Text>
      <Text style={styles.subtitle}>Get smart reminders for your, {"\n"}finances.</Text>
      <TouchableOpacity style={styles.button} onPress={handleEnterApp}>
        <Text style={styles.buttonText}>เข้าใช้งาน</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#219EBC",
    marginBottom: 24,
    textAlign: "center",
  },
  logoImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    backgroundColor: "#219EBC",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 3, // Adds a subtle shadow on Android
  },
});
