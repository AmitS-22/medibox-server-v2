import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

export default function HistoryScreen({ route }) {

  const { user } = route.params;

  const [history, setHistory] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadHistory = async () => {

    try {

      const res = await api.get(
        `/history/${user.mobile}`
      );

      if (res.data.success) {

        setHistory(res.data.history);

      }

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    loadHistory();

  }, []);

  const onRefresh = async () => {

    setRefreshing(true);

    await loadHistory();

    setRefreshing(false);

  };

  const renderItem = ({ item }) => (

    <View style={styles.card}>

      <View style={{ flex: 1 }}>

        <Text style={styles.name}>
          {item.name}
        </Text>

        <Text style={styles.date}>
          📅 {item.date}
        </Text>

        <Text style={styles.time}>
          🕒 {item.time}
        </Text>

      </View>

      <Ionicons
        name="checkmark-circle"
        size={34}
        color="#00A86B"
      />

    </View>

  );

  return (

    <View style={styles.container}>

      <Text style={styles.heading}>
        Medicine History
      </Text>

      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
                ListEmptyComponent={() => (

          <View style={styles.emptyContainer}>

            <Ionicons
              name="time-outline"
              size={80}
              color="#BDBDBD"
            />

            <Text style={styles.emptyTitle}>
              No History Yet
            </Text>

            <Text style={styles.emptySubTitle}>
              Take your medicines to see history here.
            </Text>

          </View>

        )}

        contentContainerStyle={{
          paddingBottom: 20,
        }}

      />

    </View>

  );

}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#F5F7FB",
    padding:20,
  },

  heading:{
    fontSize:28,
    fontWeight:"bold",
    color:"#222",
    marginBottom:20,
  },

  card:{
    backgroundColor:"#FFF",
    borderRadius:18,
    padding:18,
    marginBottom:15,
    flexDirection:"row",
    alignItems:"center",
    elevation:3,
  },

  name:{
    fontSize:20,
    fontWeight:"bold",
    color:"#222",
    marginBottom:6,
  },

  date:{
    color:"#666",
    marginBottom:4,
    fontSize:15,
  },

  time:{
    color:"#666",
    fontSize:15,
  },

  emptyContainer:{
    alignItems:"center",
    marginTop:100,
  },

  emptyTitle:{
    marginTop:20,
    fontSize:24,
    fontWeight:"bold",
    color:"#555",
  },

  emptySubTitle:{
    marginTop:10,
    color:"#888",
    textAlign:"center",
    fontSize:16,
  },

});