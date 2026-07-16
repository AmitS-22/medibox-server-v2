import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

import {
  CameraView,
  useCameraPermissions,
} from "expo-camera";

export default function ScannerScreen({
  navigation,
  route,
}) {

  const [permission, requestPermission] =
    useCameraPermissions();

  const [scanned, setScanned] =
    useState(false);


  if (!permission) return <View />;

  if (!permission.granted) {

    requestPermission();

    return (
      <View style={styles.center}>
        <Text>
          Camera Permission Required
        </Text>
      </View>
    );

  }

  const handleScan = ({ data }) => {

    if (scanned) return;

    setScanned(true);

    try {

      const medicine =
        JSON.parse(data);

      Alert.alert(
        "Medicine Found",
        medicine.name,
        [
          {
            text: "Use",
            onPress: () => {

              navigation.navigate(
  "AddMedicine",
  {
    user: route.params?.user,
    scannedMedicine: medicine,
  }
);

            },
          },
        ]
      );

    } catch (err) {

      Alert.alert(
        "Invalid QR",
        "This QR Code is not supported."
      );

      setScanned(false);

    }

  };
    return (

    <View style={styles.container}>

      <CameraView
        style={StyleSheet.absoluteFillObject}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
        onBarcodeScanned={handleScan}
      />

      <View style={styles.overlay}>

        <Text style={styles.title}>
          Scan Medicine QR
        </Text>

        <View style={styles.scanBox} />

        <Text style={styles.subtitle}>
          Place QR Code inside the box
        </Text>

        {scanned && (

          <TouchableOpacity
            style={styles.scanAgain}
            onPress={() => setScanned(false)}
          >
            <Text style={styles.scanAgainText}>
              Scan Again
            </Text>
          </TouchableOpacity>

        )}

      </View>

    </View>

  );

}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#000",
  },

  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  title: {
    color: "#FFF",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 40,
  },

  scanBox: {
    width: 260,
    height: 260,
    borderWidth: 4,
    borderColor: "#00E676",
    borderRadius: 20,
    backgroundColor: "transparent",
  },

  subtitle: {
    color: "#FFF",
    marginTop: 30,
    fontSize: 16,
    textAlign: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scanAgain: {
    marginTop: 40,
    backgroundColor: "#00897B",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 12,
  },

  scanAgainText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },

});