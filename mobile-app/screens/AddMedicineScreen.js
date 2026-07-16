import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";
import {
  scheduleMedicineReminder,
} from "../services/notification";

export default function AddMedicineScreen({
  navigation,
  route,
}) {

  const { user, scannedMedicine } =
    route.params || {};

  const [name, setName] = useState("");

  const [dose, setDose] = useState("");

  const [stock, setStock] = useState("");

  const [type, setType] =
    useState("Tablet");

  const [hour, setHour] =
    useState("09");

  const [minute, setMinute] =
    useState("00");

  useEffect(() => {

    if (scannedMedicine) {

      setName(
        scannedMedicine.name || ""
      );

      setDose(
        scannedMedicine.dose || ""
      );

      setType(
        scannedMedicine.type ||
        "Tablet"
      );

      setStock(
        String(
          scannedMedicine.stock || 10
        )
      );

    }

  }, [scannedMedicine]);

  const saveMedicine = async () => {

    if (!name.trim()) {

      Alert.alert(
        "Error",
        "Enter Medicine Name"
      );

      return;

    }

    if (!dose.trim()) {

      Alert.alert(
        "Error",
        "Enter Dose"
      );

      return;

    }

    try {

      const res = await api.post(
        "/add-medicine",
        {
          userId: user.mobile,
          name,
          dose,
          type,
          stock: Number(stock || 10),
        }
      );

      if (res.data.success) {

        await scheduleMedicineReminder(
          "💊 Medicine Reminder",
          `Time to take ${name}`,
          Number(hour),
          Number(minute)
        );

        Alert.alert(
          "Success",
          "Medicine Added Successfully",
          [
            {
              text: "OK",
              onPress: () =>
                navigation.goBack(),
            },
          ]
        );

      }

    } catch (err) {

      Alert.alert(
        "Error",
        "Unable to Save Medicine"
      );

    }

  };

  return (

    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
              <Text style={styles.heading}>
        Add Medicine
      </Text>

      <Text style={styles.subHeading}>
        Fill medicine details
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Medicine Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Dose (e.g. 500mg)"
        value={dose}
        onChangeText={setDose}
      />

      <TextInput
        style={styles.input}
        placeholder="Stock"
        keyboardType="numeric"
        value={stock}
        onChangeText={setStock}
      />

      <Text style={styles.label}>
        Reminder Time
      </Text>

      <View style={styles.timeRow}>

        <TextInput
          style={styles.timeInput}
          keyboardType="numeric"
          maxLength={2}
          value={hour}
          onChangeText={setHour}
          placeholder="HH"
        />

        <Text style={styles.timeColon}>
          :
        </Text>

        <TextInput
          style={styles.timeInput}
          keyboardType="numeric"
          maxLength={2}
          value={minute}
          onChangeText={setMinute}
          placeholder="MM"
        />

      </View>

      <Text style={styles.label}>
        Medicine Type
      </Text>

      <View style={styles.row}>

        {["Tablet", "Capsule", "Syrup"].map((item) => (

          <TouchableOpacity
            key={item}
            style={[
              styles.typeButton,
              type === item &&
                styles.activeType,
            ]}
            onPress={() =>
              setType(item)
            }
          >

            <Ionicons
              name={
                item === "Tablet"
                  ? "medkit"
                  : item === "Capsule"
                  ? "fitness"
                  : "flask"
              }
              size={22}
              color={
                type === item
                  ? "#FFF"
                  : "#00897B"
              }
            />

            <Text
              style={
                type === item
                  ? styles.activeTypeText
                  : styles.typeText
              }
            >
              {item}
            </Text>

          </TouchableOpacity>

        ))}

      </View>

      <TouchableOpacity
        style={styles.scanBtn}
        onPress={() =>
          navigation.navigate("Scanner", {
            user,
          })
        }
      >

        <Ionicons
          name="qr-code"
          size={22}
          color="#FFF"
        />

        <Text style={styles.scanText}>
          Scan QR Code
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.saveBtn}
        onPress={saveMedicine}
      >

        <Ionicons
          name="save"
          size={22}
          color="#FFF"
        />

        <Text style={styles.saveText}>
          Save Medicine
        </Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() =>
          navigation.goBack()
        }
      >

        <Text style={styles.cancelText}>
          Cancel
        </Text>

      </TouchableOpacity>

    </ScrollView>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  heading: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#222",
    marginTop: 10,
  },

  subHeading: {
    color: "#777",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
  },

  label: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
    row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  typeButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#00897B",
    alignItems: "center",
  },

  activeType: {
    backgroundColor: "#00897B",
  },

  typeText: {
    color: "#00897B",
    marginTop: 8,
    fontWeight: "bold",
  },

  activeTypeText: {
    color: "#FFF",
    marginTop: 8,
    fontWeight: "bold",
  },

  timeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
  },

  timeInput: {
    backgroundColor: "#FFF",
    width: 80,
    height: 55,
    borderRadius: 12,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    elevation: 2,
  },

  timeColon: {
    fontSize: 28,
    fontWeight: "bold",
    marginHorizontal: 15,
    color: "#333",
  },

  scanBtn: {
    backgroundColor: "#1565C0",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    borderRadius: 14,
    marginBottom: 15,
  },

  scanText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },

  saveBtn: {
    backgroundColor: "#00897B",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 18,
    borderRadius: 14,
    marginBottom: 15,
  },

  saveText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 17,
    marginLeft: 10,
  },

  cancelBtn: {
    alignItems: "center",
    paddingVertical: 15,
  },

  cancelText: {
    color: "#E53935",
    fontWeight: "bold",
    fontSize: 17,
  },

});