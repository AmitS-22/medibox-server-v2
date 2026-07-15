import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  StatusBar,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';

import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import axios from 'axios';

// =======================
// API CONFIGURATION
// =======================

const API_URL = "https://medibox-server-v2.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("Using API:", API_URL);
const showAxiosError = (error) => {
  console.log("========== AXIOS ERROR ==========");

  if (error.response) {
    console.log("Status:", error.response.status);
    console.log("Data:", error.response.data);

    Alert.alert(
      "Server Error",
      error.response.data?.message ||
      JSON.stringify(error.response.data)
    );
  } else if (error.request) {
    console.log("No response from server");

    Alert.alert(
      "Network Error",
      "Unable to connect to server.\n\nPlease check your internet connection or try again in a few seconds."
    );
  } else {
    console.log(error.message);

    Alert.alert("Error", error.message);
  }

  console.log("================================");
};
// =======================
// LOGIN / REGISTER
// =======================

const handleAuth = async () => {
  if (!mobile.trim()) {
    Alert.alert("Error", "Please enter mobile number");
    return;
  }

  if (!password.trim()) {
    Alert.alert("Error", "Please enter password");
    return;
  }

  if (activeTab === "Signup" && !name.trim()) {
    Alert.alert("Error", "Please enter your name");
    return;
  }

  setLoading(true);

  try {
    const endpoint =
      activeTab === "Login"
        ? "/login"
        : "/register";

    const body =
      activeTab === "Login"
        ? {
            mobile,
            password,
          }
        : {
            name,
            mobile,
            password,
          };

    console.log("POST =>", endpoint);
    console.log(body);

    const res = await api.post(endpoint, body);

    console.log(res.data);

    if (res.data.success) {
      Alert.alert(
        "Success",
        res.data.message
      );

      if (activeTab === "Login") {
        const userData = res.data.user;

        setUser(userData);

        await fetchMedicines(userData.mobile);

        setCurrentView("Dashboard");
      } else {
        setActiveTab("Login");

        setName("");
        setPassword("");
      }
    } else {
      Alert.alert(
        "Error",
        res.data.message
      );
    }
  } catch (error) {
    showAxiosError(error);
  } finally {
    setLoading(false);
  }
};

// =======================
// FETCH MEDICINES
// =======================

const fetchMedicines = async (userId) => {
  try {
    const res = await api.get(`/medicines/${userId}`);

    if (res.data.success) {
      setMyMeds(res.data.meds);
    }
  } catch (error) {
    console.log(error);
  }
};

// =======================
// ADD MEDICINE
// =======================

const saveMedicine = async () => {
  if (!medName.trim()) {
    Alert.alert("Error", "Medicine name required");
    return;
  }

  try {
    const res = await api.post(
      "/add-medicine",
      {
        userId: user.mobile,
        name: medName,
        dose: medDose,
        type: medType,
        stock: Number(medStock || 10),
      }
    );

    if (res.data.success) {
      Alert.alert(
        "Success",
        "Medicine Added"
      );

      await fetchMedicines(user.mobile);

      setMedName("");
      setMedDose("");
      setMedStock("");

      setCurrentView("Dashboard");
    }
  } catch (error) {
    showAxiosError(error);
  }
};

// =======================
// DELETE MEDICINE
// =======================

const deleteMedicine = (id) => {
  Alert.alert(
    "Delete Medicine",
    "Are you sure?",
    [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await api.delete(
              `/delete-medicine/${id}`
            );

            fetchMedicines(user.mobile);
          } catch (error) {
            showAxiosError(error);
          }
        },
      },
    ]
  );
};

// =======================
// MARK TAKEN
// =======================

const markTaken = async (id) => {
  try {
    await api.post(
      "/mark-taken",
      {
        id,
      }
    );

    fetchMedicines(user.mobile);
  } catch (error) {
    showAxiosError(error);
  }
};
{/* LOGIN SCREEN */}
{currentView === "Login" && (
  <View style={styles.bottomSheet}>
    <View style={styles.tabContainer}>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === "Login" && styles.activeTab,
        ]}
        onPress={() => setActiveTab("Login")}
      >
        <Text style={styles.tabText}>
          {t.loginTab}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.tab,
          activeTab === "Signup" && styles.activeTab,
        ]}
        onPress={() => setActiveTab("Signup")}
      >
        <Text style={styles.tabText}>
          {t.signupTab}
        </Text>
      </TouchableOpacity>
    </View>

    <View style={styles.form}>

      {activeTab === "Signup" && (
        <View style={styles.inputWrapper}>
          <Text style={styles.label}>
            {t.nameLabel}
          </Text>

          <TextInput
            style={styles.input}
            placeholder={t.nameLabel}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        </View>
      )}

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          {t.mobileLabel}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="9876543210"
          value={mobile}
          onChangeText={setMobile}
          keyboardType="phone-pad"
          maxLength={10}
        />
      </View>

      <View style={styles.inputWrapper}>
        <Text style={styles.label}>
          {t.passLabel}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <TouchableOpacity
        style={styles.button}
        disabled={loading}
        onPress={handleAuth}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>
            {activeTab === "Login"
              ? t.loginBtn
              : t.regBtn}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  </View>
)}
{/* DASHBOARD */}
{currentView === "Dashboard" && (
  <>
    <ScrollView
      style={styles.dashContent}
      showsVerticalScrollIndicator={false}
    >
      {myMeds.length === 0 ? (
        <View
          style={{
            alignItems: "center",
            marginTop: 80,
          }}
        >
          <Text
            style={{
              fontSize: 70,
            }}
          >
            💊
          </Text>

          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginTop: 15,
            }}
          >
            No Medicines Added
          </Text>

          <Text
            style={{
              color: "#777",
              marginTop: 8,
            }}
          >
            Tap the + button to add your first medicine.
          </Text>
        </View>
      ) : (
        myMeds.map((med) => (
          <View
            key={med._id}
            style={styles.medCard}
          >
            <View style={styles.medIcon}>
              <Text style={{ fontSize: 25 }}>
                💊
              </Text>
            </View>

            <View style={styles.medInfo}>
              <Text style={styles.medName}>
                {med.name}
              </Text>

              <Text style={styles.medDose}>
                {med.dose}
              </Text>

              <Text
                style={{
                  color:
                    Number(med.stock) <= 5
                      ? "red"
                      : "green",
                  fontWeight: "bold",
                  marginTop: 5,
                }}
              >
                Stock : {med.stock}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.checkBtn}
              onPress={() => markTaken(med._id)}
            >
              <Text
                style={styles.checkText}
              >
                ✓
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={() =>
                deleteMedicine(med._id)
              }
            >
              <Text
                style={styles.deleteText}
              >
                🗑️
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </ScrollView>

    <TouchableOpacity
      style={styles.fab}
      onPress={() =>
        setCurrentView("AddMed")
      }
    >
      <Text style={styles.fabText}>
        +
      </Text>
    </TouchableOpacity>
  </>
)}
{/* ADD MEDICINE SCREEN */}
{currentView === "AddMed" && (
  <ScrollView
    style={styles.bottomSheet}
    keyboardShouldPersistTaps="handled"
    showsVerticalScrollIndicator={false}
  >
    <Text style={styles.formHeader}>
      {t.addTitle}
    </Text>

    <TouchableOpacity
      style={styles.scanBtn}
      onPress={startScan}
    >
      <Text style={styles.scanText}>
        📷 {t.scanBtn}
      </Text>
    </TouchableOpacity>

    <View style={styles.inputWrapper}>
      <Text style={styles.label}>
        {t.medNameLabel}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Paracetamol"
        value={medName}
        onChangeText={setMedName}
      />
    </View>

    <View style={styles.inputWrapper}>
      <Text style={styles.label}>
        {t.doseLabel}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="500 mg"
        value={medDose}
        onChangeText={setMedDose}
      />
    </View>

    <View style={styles.inputWrapper}>
      <Text style={styles.label}>
        {t.stockLabel}
      </Text>

      <TextInput
        style={styles.input}
        placeholder="10"
        keyboardType="numeric"
        value={medStock}
        onChangeText={setMedStock}
      />
    </View>

    <Text
      style={{
        marginBottom: 10,
        fontWeight: "bold",
        color: "#008080",
      }}
    >
      Medicine Type
    </Text>

    <View style={styles.row}>
      <TouchableOpacity
        style={[
          styles.typeBtn,
          medType === "Tablet" &&
            styles.activeType,
        ]}
        onPress={() =>
          setMedType("Tablet")
        }
      >
        <Text
          style={[
            styles.typeText,
            medType === "Tablet" && {
              color: "#FFF",
            },
          ]}
        >
          💊 Tablet
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.typeBtn,
          medType === "Syrup" &&
            styles.activeType,
        ]}
        onPress={() =>
          setMedType("Syrup")
        }
      >
        <Text
          style={[
            styles.typeText,
            medType === "Syrup" && {
              color: "#FFF",
            },
          ]}
        >
          🧴 Syrup
        </Text>
      </TouchableOpacity>
    </View>

    <TouchableOpacity
      style={styles.button}
      onPress={saveMedicine}
    >
      <Text style={styles.buttonText}>
        {t.saveBtn}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={{
        alignItems: "center",
        marginTop: 20,
        marginBottom: 30,
      }}
      onPress={() =>
        setCurrentView("Dashboard")
      }
    >
      <Text
        style={{
          color: "#008080",
          fontWeight: "bold",
        }}
      >
        {t.cancel}
      </Text>
    </TouchableOpacity>
  </ScrollView>
)}
{/* =======================
    LANGUAGE MODAL
======================= */}

<Modal
  visible={isLangModal}
  animationType="slide"
>
  <SafeAreaView
    style={{
      flex: 1,
      backgroundColor: "#FFF",
    }}
  >
    <View style={styles.searchHeader}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search language..."
        value={langSearch}
        onChangeText={setLangSearch}
      />

      <TouchableOpacity
        onPress={() => {
          setIsLangModal(false);
          setLangSearch("");
        }}
      >
        <Text
          style={{
            color: "#008080",
            fontWeight: "bold",
          }}
        >
          CLOSE
        </Text>
      </TouchableOpacity>
    </View>

    <ScrollView>
      {filteredLangs.map((key) => (
        <TouchableOpacity
          key={key}
          style={styles.langItem}
          onPress={() => {
            setLang(key);
            setLangSearch("");
            setIsLangModal(false);
          }}
        >
          <Text style={styles.langItemText}>
            {key.toUpperCase()} • {TEXT[key].appTitle}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </SafeAreaView>
</Modal>

{/* =======================
      QR CAMERA
======================= */}

<Modal
  visible={scanning}
  animationType="slide"
>
  <View
    style={{
      flex: 1,
      backgroundColor: "#000",
    }}
  >
    <CameraView
      style={{
        flex: 1,
      }}
      barcodeScannerSettings={{
        barcodeTypes: ["qr"],
      }}
      onBarcodeScanned={handleBarCodeScanned}
    />

    <View
      style={{
        position: "absolute",
        bottom: 50,
        width: "100%",
        alignItems: "center",
      }}
    >
      <TouchableOpacity
        style={{
          backgroundColor: "#008080",
          paddingHorizontal: 35,
          paddingVertical: 15,
          borderRadius: 30,
        }}
        onPress={() => setScanning(false)}
      >
        <Text
          style={{
            color: "#FFF",
            fontWeight: "bold",
            fontSize: 16,
          }}
        >
          CLOSE SCANNER
        </Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
