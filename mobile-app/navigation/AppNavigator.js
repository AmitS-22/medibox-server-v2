import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import LoginScreen from "../screens/LoginScreen";
import AddMedicineScreen from "../screens/AddMedicineScreen";


import TabNavigator from "./TabNavigator";

import ScannerScreen from "../screens/ScannerScreen";


const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
  name="Scanner"
  component={ScannerScreen}
/>

       <Stack.Screen
  name="Dashboard"
  component={TabNavigator}
/>
        <Stack.Screen
          name="AddMedicine"
          component={AddMedicineScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}