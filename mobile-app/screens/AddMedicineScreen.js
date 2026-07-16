import React, { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
} from "react-native";

import api from "../services/api";

export default function AddMedicineScreen({ navigation, route }) {
  const { user } = route.params;

  const [name, setName] = useState("");
  const [dose, setDose] = useState("");
  const [stock, setStock] = useState("");
  const [type, setType] = useState("Tablet");

  const saveMedicine = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Enter medicine name");
      return;
    }

    try {
      const res = await api.post("/add-medicine", {
        userId: user.mobile,
        name,
        dose,
        type,
        stock: Number(stock || 10),
      });

      if (res.data.success) {
        Alert.alert(
          "Success",
          "Medicine Added Successfully",
          [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
          ]
        );
      }
    } catch (err) {
      console.log(err);

      Alert.alert(
        "Error",
        "Unable to save medicine"
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

      <TextInput
        style={styles.input}
        placeholder="Medicine Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Dose (500mg)"
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
        Medicine Type
      </Text>

      <View style={styles.row}>
        {["Tablet", "Capsule", "Syrup"].map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.type,
              type === item && styles.active,
            ]}
            onPress={() => setType(item)}
          >
            <Text
              style={
                type === item
                  ? styles.activeText
                  : styles.normalText
              }
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={styles.saveBtn}
        activeOpacity={0.8}
        onPress={saveMedicine}
      >
        <Text style={styles.btnText}>
          SAVE MEDICINE
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelBtn}
        onPress={() => navigation.goBack()}
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
    padding: 20,
    backgroundColor: "#F4F7FB",
  },

  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
  },

  input: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#DDD",
  },

  label: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 25,
  },

  type: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#00897B",
    borderRadius: 10,
    alignItems: "center",
  },

  active: {
    backgroundColor: "#00897B",
  },

  normalText: {
    color: "#00897B",
    fontWeight: "bold",
  },

  activeText: {
    color: "#FFF",
    fontWeight: "bold",
  },

  saveBtn: {
    backgroundColor: "#00897B",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 15,
  },

  btnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 17,
  },

  cancelBtn: {
    alignItems: "center",
    padding: 12,
  },

  cancelText: {
    color: "#00897B",
    fontWeight: "bold",
    fontSize: 16,
  },
});