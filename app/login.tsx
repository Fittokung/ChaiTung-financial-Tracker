// app/login.tsx

import React from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();

  const handleEnterApp = () => {
    router.replace("/(tabs)"); // เข้าสู่แอปหลัก
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChaiTang</Text>
      <Button title="เข้าใช้งาน" onPress={handleEnterApp} />
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
});
