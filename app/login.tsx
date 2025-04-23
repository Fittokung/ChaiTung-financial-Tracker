// app/login.tsx

import React, { useEffect } from "react";
import { View, Button, StyleSheet, Text } from "react-native";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { auth } from "../lib/firebase";
import { GoogleAuthProvider, signInWithCredential } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "736335018579-r7tpmvcnvmv10e7vv4bq3lm0hj9isqih.apps.googleusercontent.com", // แก้จาก expoClientId เป็น clientId
  });

  const router = useRouter();

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.idToken) {
      const idToken = response.authentication.idToken;
      const credential = GoogleAuthProvider.credential(idToken);

      signInWithCredential(auth, credential)
        .then(() => {
          router.replace("/(tabs)"); // เปลี่ยนเส้นทางหลังล็อกอินสำเร็จ
        })
        .catch((err: unknown) => {
          if (err instanceof Error) {
            console.error("Login error:", err.message);
          } else {
            console.error("Login error:", err);
          }
        });
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ChaiTang</Text>
      <Button
        title="Sign in with Google"
        onPress={() => promptAsync()}
        disabled={!request}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
