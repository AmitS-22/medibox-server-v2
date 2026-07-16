import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import api from "../services/api";

export default function DashboardScreen({
  navigation,
  route,
}) {

  const { user } = route.params;
  

  const [medicines, setMedicines] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const loadMedicines = async () => {

    try {

      const res = await api.get(
        `/medicines/${user.mobile}`
      );

      if (res.data.success) {
        setMedicines(res.data.meds);
      }

    } catch (err) {

      console.log(err);

    }

  };

  useEffect(() => {

    const unsubscribe = navigation.addListener(
      "focus",
      loadMedicines
    );

    return unsubscribe;

  }, []);

  const onRefresh = async () => {

    setRefreshing(true);

    await loadMedicines();

    setRefreshing(false);

  };

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

            await api.delete(
              `/delete-medicine/${id}`
            );

            loadMedicines();

          },
        },
      ]
    );

  };

  const markTaken = async (id) => {

    await api.post("/mark-taken", {
      id,
    });

    loadMedicines();

  };

  const filteredMedicines =
    medicines.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  const renderItem = ({ item }) => (

    <View style={styles.card}>

      <View style={{ flex: 1 }}>

        <Text style={styles.title}>
          {item.name}
        </Text>

        <Text style={styles.info}>
          💊 {item.dose}
        </Text>

        <Text style={styles.info}>
          📦 {item.type}
        </Text>

        <Text
          style={{
            color:
              item.stock <= 5
                ? "#E53935"
                : "#43A047",
            fontWeight: "bold",
            marginTop: 5,
          }}
        >
          Stock : {item.stock}
        </Text>

        {item.stock <= 5 && (

          <Text style={styles.lowStock}>
            ⚠ Low Stock
          </Text>

        )}

      </View>

      <View>

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() =>
            markTaken(item._id)
          }
        >
          <Ionicons
            name="checkmark"
            size={22}
            color="#FFF"
          />
        </TouchableOpacity>

                <TouchableOpacity
        style={styles.editBtn}
        onPress={() =>
            navigation.navigate("AddMedicine", {
            user,
            editMedicine: item,
            })
        }
        >
        <Ionicons
            name="create"
            size={20}
            color="#FFF"
        />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() =>
            deleteMedicine(item._id)
          }
        >
          <Ionicons
            name="trash"
            size={20}
            color="#FFF"
          />
        </TouchableOpacity>

      </View>

    </View>

  );

  return (

    <View style={styles.container}>

      <View style={styles.header}>

        <View>

          <Text style={styles.heading}>
            Welcome 👋
          </Text>

          <Text style={styles.userName}>
            {user.name}
          </Text>

        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() =>
            navigation.replace("Login")
          }
        >
          <Ionicons
            name="log-out"
            size={24}
            color="#FFF"
          />
        </TouchableOpacity>

      </View>

      <View style={styles.summaryCard}>

        <Text style={styles.summaryTitle}>
          Total Medicines
        </Text>

        <Text style={styles.summaryValue}>
          {medicines.length}
        </Text>

      </View>

      <TextInput
        placeholder="Search Medicine..."
        style={styles.search}
        value={search}
        onChangeText={setSearch}
      />
            <FlatList
        data={filteredMedicines}
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
              name="medkit-outline"
              size={70}
              color="#BDBDBD"
            />
            <Text style={styles.emptyTitle}>
              No Medicines Found
            </Text>
            <Text style={styles.emptySubTitle}>
              Tap + button to add your first medicine
            </Text>
          </View>
        )}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() =>
          navigation.navigate("AddMedicine", {
            user,
          })
        }
      >
        <Ionicons
          name="add"
          size={34}
          color="#FFF"
        />
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  heading: {
    fontSize: 16,
    color: "#777",
  },

  userName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },

  logoutBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
  },

  summaryCard: {
    backgroundColor: "#00897B",
    padding: 22,
    borderRadius: 20,
    marginBottom: 20,
  },

  summaryTitle: {
    color: "#FFF",
    fontSize: 16,
  },

  summaryValue: {
    color: "#FFF",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 5,
  },

  search: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    fontSize: 16,
    elevation: 2,
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },

  info: {
    marginTop: 5,
    color: "#666",
  },

  lowStock: {
    marginTop: 5,
    color: "#E53935",
    fontWeight: "bold",
  },

  doneBtn: {
    backgroundColor: "#00A86B",
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  deleteBtn: {
    backgroundColor: "#E53935",
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },

  fab: {
    position: "absolute",
    right: 25,
    bottom: 25,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#00897B",
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
  },

  emptyContainer: {
    alignItems: "center",
    marginTop: 90,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: "bold",
    color: "#555",
  },

  emptySubTitle: {
    marginTop: 8,
    color: "#888",
    textAlign: "center",
  },
  editBtn:{
  backgroundColor:"#FB8C00",
  width:46,
  height:46,
  borderRadius:23,
  justifyContent:"center",
  alignItems:"center",
  marginBottom:10,
},

});