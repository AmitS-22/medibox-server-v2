import React, {
  useEffect,
  useState,
} from "react";

import {
  View,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";

import api from "../services/api";

export default function HistoryScreen({
  route,
}) {

  const { user } = route.params;

  const [history, setHistory] =
    useState([]);

  useEffect(() => {

    loadHistory();

  }, []);

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

  const renderItem = ({ item }) => (

    <View style={styles.card}>

      <Text style={styles.name}>
        {item.name}
      </Text>

      <Text style={styles.time}>
        {item.time}
      </Text>

      <Text style={styles.date}>
        {item.date}
      </Text>

    </View>

  );

  return (

    <View style={styles.container}>

      <Text style={styles.heading}>
        Medicine History
      </Text>

      <FlatList
        data={history}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
                ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              No History Available
            </Text>
          </View>
        )}
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
    marginBottom:20,
    color:"#222",
  },

  card:{
    backgroundColor:"#FFF",
    padding:18,
    borderRadius:15,
    marginBottom:15,
    elevation:3,
  },

  name:{
    fontSize:20,
    fontWeight:"bold",
    color:"#00897B",
  },

  time:{
    marginTop:6,
    color:"#555",
    fontSize:15,
  },

  date:{
    color:"#777",
    marginTop:4,
  },

  empty:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    marginTop:120,
  },

  emptyText:{
    fontSize:18,
    color:"#999",
  },

});