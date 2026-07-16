import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

export default function ProfileScreen({
  navigation,
  route,
}) {

  const { user } = route.params;

  const [medicineCount, setMedicineCount] =
    useState(0);

  const [historyCount, setHistoryCount] =
    useState(0);

  useEffect(() => {

    loadData();

  }, []);

  const loadData = async () => {

    try {

      const meds = await api.get(
        `/medicines/${user.mobile}`
      );

      const history = await api.get(
        `/history/${user.mobile}`
      );

      if (meds.data.success) {

        setMedicineCount(
          meds.data.meds.length
        );

      }

      if (history.data.success) {

        setHistoryCount(
          history.data.history.length
        );

      }

    } catch (err) {

      console.log(err);

    }

  };

  const logout = () => {

    Alert.alert(

      "Logout",

      "Do you want to logout?",

      [

        {
          text: "Cancel",
        },

        {
          text: "Logout",

          style: "destructive",

          onPress: () =>
            navigation.replace("Login"),

        },

      ]

    );

  };

  return (

    <View style={styles.container}>

      <View style={styles.profileCard}>

        <Ionicons
          name="person-circle"
          size={120}
          color="#00897B"
        />

        <Text style={styles.name}>
          {user.name}
        </Text>

        <Text style={styles.mobile}>
          📱 {user.mobile}
        </Text>

      </View>

      <View style={styles.statsRow}>
                <View style={styles.statCard}>

          <Ionicons
            name="medkit"
            size={34}
            color="#00897B"
          />

          <Text style={styles.statNumber}>
            {medicineCount}
          </Text>

          <Text style={styles.statText}>
            Medicines
          </Text>

        </View>

        <View style={styles.statCard}>

          <Ionicons
            name="time"
            size={34}
            color="#3949AB"
          />

          <Text style={styles.statNumber}>
            {historyCount}
          </Text>

          <Text style={styles.statText}>
            History
          </Text>

        </View>

      </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={logout}
      >

        <Ionicons
          name="log-out"
          size={22}
          color="#FFF"
        />

        <Text style={styles.logoutText}>
          Logout
        </Text>

      </TouchableOpacity>

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#F5F7FB",
    padding:20,
    justifyContent:"center",
  },

  profileCard:{
    backgroundColor:"#FFF",
    borderRadius:20,
    padding:30,
    alignItems:"center",
    elevation:4,
    marginBottom:25,
  },

  name:{
    fontSize:28,
    fontWeight:"bold",
    color:"#222",
    marginTop:15,
  },

  mobile:{
    fontSize:18,
    color:"#777",
    marginTop:8,
  },

  statsRow:{
    flexDirection:"row",
    justifyContent:"space-between",
    marginBottom:30,
  },

  statCard:{
    flex:1,
    backgroundColor:"#FFF",
    marginHorizontal:5,
    borderRadius:18,
    padding:20,
    alignItems:"center",
    elevation:3,
  },

  statNumber:{
    fontSize:28,
    fontWeight:"bold",
    marginTop:10,
    color:"#222",
  },

  statText:{
    color:"#666",
    marginTop:5,
    fontSize:16,
  },

  logoutBtn:{
    backgroundColor:"#E53935",
    flexDirection:"row",
    justifyContent:"center",
    alignItems:"center",
    padding:18,
    borderRadius:15,
  },

  logoutText:{
    color:"#FFF",
    fontSize:18,
    fontWeight:"bold",
    marginLeft:10,
  },

});