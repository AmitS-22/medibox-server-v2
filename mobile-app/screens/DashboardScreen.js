import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from "react-native";

import api from "../services/api";

export default function DashboardScreen({
  navigation,
  route,
}) {
    const { user } = route.params;

  const [medicines, setMedicines] = useState([]);

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
  const unsubscribe = navigation.addListener("focus", () => {
    loadMedicines();
  });

  return unsubscribe;
}, [navigation]);

  const deleteMedicine = (id) => {

    Alert.alert(

      "Delete",

      "Delete this medicine?",

      [

        {
          text:"Cancel",
        },

        {

          text:"Delete",

          style:"destructive",

          onPress:async()=>{

            await api.delete(

              `/delete-medicine/${id}`

            );

            loadMedicines();

          }

        }

      ]

    );

  };

  const markTaken = async(id)=>{

    await api.post(

      "/mark-taken",

      {id}

    );

    loadMedicines();

  };

  const renderItem = ({item})=>(

    <View style={styles.card}>

      <View>

        <Text style={styles.title}>
          {item.name}
        </Text>

        <Text>
          {item.dose}
        </Text>

        <Text>
          {item.type}
        </Text>

        <Text
          style={{
                    color:
        item.stock <= 5
        ? "#E53935"
        : "#43A047",

            fontWeight:"bold",
          }}
        >
          Stock :
          {item.stock}
        </Text>

      </View>

      <View>

        <TouchableOpacity

          style={styles.doneBtn}

          onPress={()=>markTaken(item._id)}

        >

          <Text style={styles.white}>
            ✓
          </Text>

        </TouchableOpacity>

        <TouchableOpacity

          style={styles.deleteBtn}

          onPress={()=>deleteMedicine(item._id)}

        >

          <Text style={styles.white}>
            🗑
          </Text>

        </TouchableOpacity>

      </View>

    </View>

  );

  return(

    <View style={styles.container}>

      <Text style={styles.heading}>
        Welcome,
        {" "}
        {user.name}
      </Text>
      <View style={styles.summaryCard}>
  <Text style={styles.summaryTitle}>
    Total Medicines
  </Text>

  <Text style={styles.summaryValue}>
    {medicines.length}
  </Text>
</View>
<Text style={styles.heading}>
  Welcome {user.name}
</Text>

      <FlatList

        data={medicines}

        keyExtractor={(item)=>item._id}

        renderItem={renderItem}

      />

     <TouchableOpacity
  style={styles.fab}
  onPress={() =>
    navigation.navigate("AddMedicine", {
      user,
    })
  }
>
  <Text style={styles.plus}>+</Text>
</TouchableOpacity>

    </View>

  );

}

const styles=StyleSheet.create({

container:{

flex:1,

backgroundColor:"#F4F7FB",

padding:20,

},

heading:{

fontSize:24,

fontWeight:"bold",

marginBottom:20,

},

card:{

backgroundColor:"#FFF",

padding:18,

borderRadius:15,

marginBottom:15,

flexDirection:"row",

justifyContent:"space-between",

alignItems:"center",

elevation:4,

},

title:{

fontWeight:"bold",

fontSize:18,

marginBottom:4,

},

doneBtn:{

backgroundColor:"#00A86B",

padding:12,

borderRadius:12,

marginBottom:10,

},

deleteBtn:{

backgroundColor:"#D32F2F",

padding:12,

borderRadius:12,

},

white:{

color:"#FFF",

fontWeight:"bold",

},

fab:{

position:"absolute",

right:25,

bottom:25,

width:65,

height:65,

borderRadius:40,

backgroundColor:"#00897B",

justifyContent:"center",

alignItems:"center",

elevation:6,

},

plus:{

fontSize:36,

color:"#FFF",

},

summaryCard: {
  backgroundColor: "#00897B",
  padding: 20,
  borderRadius: 16,
  marginBottom: 20,
},

summaryTitle: {
  color: "#FFF",
  fontSize: 16,
},

summaryValue: {
  color: "#FFF",
  fontSize: 32,
  fontWeight: "bold",
},

});