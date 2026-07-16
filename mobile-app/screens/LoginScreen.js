import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

export default function LoginScreen({ navigation }) {

  const [tab, setTab] = useState("Login");

  const [name, setName] = useState("");

  const [mobile, setMobile] = useState("");

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async () => {

    if (!mobile.trim()) {
      Alert.alert("Error", "Enter Mobile Number");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Enter Password");
      return;
    }

    if (tab === "Sign Up" && !name.trim()) {
      Alert.alert("Error", "Enter Full Name");
      return;
    }

    setLoading(true);

    try {

      if (tab === "Sign Up") {

        const register = await api.post("/register", {
          name,
          mobile,
          password,
        });

        if (!register.data.success) {
          Alert.alert("Error", register.data.message);
          setLoading(false);
          return;
        }

      }

      const login = await api.post("/login", {
        mobile,
        password,
      });

      if (login.data.success) {

        navigation.replace("Dashboard", {
          user: login.data.user,
        });

      } else {

        Alert.alert(
          "Error",
          login.data.message
        );

      }

    } catch (err) {

      Alert.alert(
        "Error",
        err.response?.data?.message ||
        "Unable to connect to server"
      );

    }

    setLoading(false);

  };

  return (

    <KeyboardAvoidingView
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
      style={styles.container}
    >

      <Text style={styles.logo}>
        💊 MediBox
      </Text>

      <Text style={styles.subtitle}>
        Your Smart Medicine Companion
      </Text>

      <View style={styles.tabs}>

        <TouchableOpacity
          style={[
            styles.tab,
            tab === "Login" &&
              styles.activeTab,
          ]}
          onPress={() => setTab("Login")}
        >
          <Text
            style={
              tab === "Login"
                ? styles.activeTabText
                : styles.tabText
            }
          >
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tab,
            tab === "Sign Up" &&
              styles.activeTab,
          ]}
          onPress={() => setTab("Sign Up")}
        >
          <Text
            style={
              tab === "Sign Up"
                ? styles.activeTabText
                : styles.tabText
            }
          >
            Sign Up
          </Text>
        </TouchableOpacity>

      </View>
            {tab === "Sign Up" && (
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={name}
          onChangeText={setName}
        />
      )}

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <View style={styles.passwordContainer}>

        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          onPress={() =>
            setShowPassword(!showPassword)
          }
        >
          <Ionicons
            name={
              showPassword
                ? "eye-off"
                : "eye"
            }
            size={24}
            color="#777"
          />
        </TouchableOpacity>

      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleAuth}
        disabled={loading}
      >

        {loading ? (

          <ActivityIndicator color="#FFF" />

        ) : (

          <Text style={styles.buttonText}>
            {tab}
          </Text>

        )}

      </TouchableOpacity>

      <Text style={styles.footer}>
        Stay Healthy ❤️
      </Text>

    </KeyboardAvoidingView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F4F8FB",
  },

  logo: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#00897B",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginBottom: 35,
    marginTop: 8,
    fontSize: 15,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 25,
    backgroundColor: "#E8F5F3",
    borderRadius: 12,
    overflow: "hidden",
  },

  tab: {
    flex: 1,
    padding: 15,
    alignItems: "center",
  },

  activeTab: {
    backgroundColor: "#00897B",
  },

  tabText: {
    color: "#00897B",
    fontWeight: "bold",
  },

  activeTabText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  input: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
  },

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 20,
    elevation: 2,
  },

  passwordInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
  },

  button: {
    backgroundColor: "#00897B",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 5,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

  footer: {
    marginTop: 25,
    textAlign: "center",
    color: "#777",
  },

});
