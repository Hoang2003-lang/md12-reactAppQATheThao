
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';




const ProductDetailScreen = ({ route, navigation }: any) => {
  const [isFavourite, setIsFavourite]= useState(false);

  return(
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {/* img */}
        <Image source={require("../assets/images/vietnam_do.png")} style={styles.img}/>

        {/* back */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={require("../assets/images/ic_back.png")} style={styles.back}/>
        </TouchableOpacity>

        {/* cart */}
        <TouchableOpacity >
        <Image source={require("../assets/images/ic_cart.png")} style={styles.cart}/>
        </TouchableOpacity>
      </View>
      
      <View style={styles.body}>        
        {/* name */}
        <Text style={styles.txt}>Quần áo đội tuyển quốc gia Việt Nam</Text>
        
        {/* heart */}
        <TouchableOpacity onPress={() => setIsFavourite(prev => !prev)}>

        <Image source={isFavourite ? require("../assets/images/check_fav.png") : require("../assets/images/uncheck_fav.png")} style={styles.heart}/>

        </TouchableOpacity>
      </View>

      <View style={styles.body}>
        {/* price */}
        <Text style={styles.txt}>Giá: 200.000đ</Text>
        
      </View>

      <View style={styles.body}>
        {/* store */}
        <Text style={styles.txt}>Kho: 152</Text>
        
      </View> 

      <View style={styles.body2}>
        {/* Size */}
        <Text style={styles.txt}>Size: </Text>
        
      </View>     

    </ScrollView>
  );
};

const styles= StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  img:{
    width: 400,
    height: 400,
    position: "absolute"
  },
  header:{
    flexDirection: "row",
    paddingBottom: 380
  },
  back:{
    position: "relative",
    width: 20,
    height: 20,
    top: 20,
    left: 10
  },
  cart:{
    position: "relative",
    width: 20,
    height: 20,
    top: 20,
    left: 340
  },
  body:{
    flexDirection: "row",
    // backgroundColor: "gray",
    borderColor: "black",
    borderBottomWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 9,
    paddingBottom: 8,
  },
  txt:{
    fontSize: 18,
    fontFamily: "Lora-Bold",
    width: 295,
    lineHeight: 24,
  },
  heart:{
    width: 20,
    height: 20,
    position: "relative",
    left: 40
  },
  body2:{
    flexDirection: "row",
    // backgroundColor: "gray",
    borderColor: "black",
    borderBottomWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    paddingBottom: 8,
  },

})


export default ProductDetailScreen;

