import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import DashboardScreen from "../screens/DashboardScreen";
import HistoryScreen from "../screens/HistoryScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator({ route }) {

  const { user } = route.params;

  return (

    <Tab.Navigator

      screenOptions={({ route }) => ({

        headerShown: false,

        tabBarActiveTintColor: "#00897B",

        tabBarInactiveTintColor: "#999",

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
        },

        tabBarIcon: ({ color, size }) => {

          let icon;

          switch (route.name) {

            case "Home":
              icon = "home";
              break;

            case "History":
              icon = "time";
              break;

            case "Profile":
              icon = "person";
              break;

            default:
              icon = "ellipse";
          }

          return (
            <Ionicons
              name={icon}
              size={size}
              color={color}
            />
          );

        },

      })}

    >

      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        initialParams={{ user }}
      />

      <Tab.Screen
        name="History"
        component={HistoryScreen}
        initialParams={{ user }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user }}
      />

    </Tab.Navigator>

  );

}