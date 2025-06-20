// app/(tabs)_layout.tsx

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";

const icons = {
  index: "home-outline",
  statistic: "bar-chart-outline",
  balance: "wallet-outline",
  profile: "person-outline",
  "add-expense": "remove-circle-outline",
  "add-income": "add-circle-outline",
} as const;

type RouteName = keyof typeof icons;

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#1e90ff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          paddingBottom: 8,
          height: 60,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName = icons[route.name as RouteName] ?? "ellipse-outline";

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Home" }} />
      <Tabs.Screen name="statistic" options={{ title: "Statistic" }} />
      <Tabs.Screen name="balance" options={{ title: "Balance" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
      {/* <Tabs.Screen name="add-expense" options={{ title: "Add Expense" }} />
      <Tabs.Screen name="add-income" options={{ title: "Add Income" }} /> */}
    </Tabs>
  );
}
