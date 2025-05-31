// lib/categoryData.ts
import { ImageSourcePropType } from "react-native";
import { ReactNode } from "react";

export type Category = {
  name: string;
  type: "expense" | "income";
  icon: ImageSourcePropType;
};

export const categories: Category[] = [
  { name: "Food", type: "expense", icon: require("../assets/icons/food.png") },
  {
    name: "Drink",
    type: "expense",
    icon: require("../assets/icons/drink.png"),
  },
  {
    name: "Coffee",
    type: "expense",
    icon: require("../assets/icons/coffee.png"),
  },
  {
    name: "Shopping",
    type: "expense",
    icon: require("../assets/icons/shopping.png"),
  },
  {
    name: "Traveling",
    type: "expense",
    icon: require("../assets/icons/traveling.png"),
  },
  {
    name: "Clothes",
    type: "expense",
    icon: require("../assets/icons/clothes.png"),
  },
  {
    name: "Dessert",
    type: "expense",
    icon: require("../assets/icons/dessert.png"),
  },
  {
    name: "Appliance",
    type: "expense",
    icon: require("../assets/icons/appliance.png"),
  },
  {
    name: "Transportation",
    type: "expense",
    icon: require("../assets/icons/transportation.png"),
  },
  {
    name: "Salary",
    type: "income",
    icon: require("../assets/icons/salary.png"),
  },
  //   {
  //     name: "part-time",
  //     type: "income",
  //     icon: require("../assets/icons/part-time.png"),
  //   },
  {
    name: "Investment",
    type: "income",
    icon: require("../assets/icons/investment.png"),
  },
];
