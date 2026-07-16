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

import api from "../services/api";

export default function LoginScreen({ navigation }) {

  const [tab, setTab] = useState("Login");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {

    if (!mobile.trim()) {
      Alert.alert("Error", "Enter mobile number");
      return;
    }

    if (!password.trim()) {
      Alert.alert("Error", "Enter password");
      return;
    }

    if (tab === "Sign Up" && !name.trim()) {
      Alert.alert("Error", "Enter your name");
      return;
    }

    setLoading(true);

    try {

      const endpoint =
        tab === "Login"
          ? "/login"
          : "/register";

      const body =
        tab === "Login"
          ? {
              mobile,
              password,
            }
          : {
              name,
              mobile,
              password,
            };

      const res = await api.post(endpoint, body);

      if (res.data.success) {

        if (tab === "Login") {

          navigation.replace("Dashboard", {
            user: res.data.user,
          });

        } else {

          Alert.alert(
            "Success",
            "Account created successfully"
          );

          setTab("Login");

          setName("");
          setPassword("");

        }

      } else {

        Alert.alert("Error", res.data.message);

      }

    } catch (err) {

  console.log("========== ERROR ==========");
  console.log(err);
  console.log("Message:", err.message);
  console.log("Response:", err.response);
  console.log("Request:", err.request);
  console.log("===========================");

  Alert.alert(
    "Error",
    err.message || "Unknown Error"
  );

}

    setLoading(false);

  };
  return (
  <KeyboardAvoidingView
    style={styles.container}
    behavior={Platform.OS === "ios" ? "padding" : undefined}
  >
    <Text style={styles.logo}>💊 MediBox</Text>

    <Text style={styles.subtitle}>
      Medicine Reminder App
    </Text>

    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, tab === "Login" && styles.activeTab]}
        onPress={() => setTab("Login")}
      >
        <Text>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, tab === "Sign Up" && styles.activeTab]}
        onPress={() => setTab("Sign Up")}
      >
        <Text>Sign Up</Text>
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

    <TextInput
      style={styles.input}
      placeholder="Password"
      secureTextEntry
      value={password}
      onChangeText={setPassword}
    />

    <TouchableOpacity
      style={styles.button}
      onPress={handleAuth}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>
          {tab}
        </Text>
      )}
    </TouchableOpacity>
  </KeyboardAvoidingView>
);

}
const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: "center",
    padding: 25,
    backgroundColor: "#F5F8FA",
  },

  logo: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#00897B",
    textAlign: "center",
    marginBottom: 10,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    fontSize: 16,
    marginBottom: 40,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 25,
    backgroundColor: "#FFF",
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

  input: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  button: {
    backgroundColor: "#00897B",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },

});