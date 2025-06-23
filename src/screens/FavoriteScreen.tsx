import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, FlatList, Dimensions, Image, ScrollView} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

//TODO:
// - Item ko mất trong màn hình yêu thích khi uncheck wishlist "X"
// - Hiển thị màn hình khác khi không có sản phẩm "X"
// - Chưa hiển thị được sản phẩm chi tiết khi click vào item
// - Click vào còn đang hiển thị lỗi


const { width } = Dimensions.get('window');

const FavoriteScreen = ({ navigation }: any) => {
  const [bookmarkedItems, setBookmarkedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookmark();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchBookmark();
    }, [])
  );

  const fetchBookmark = async () => {
    try {
      const token = await AsyncStorage.getItem("bookmark");
      console.log("Raw bookmark token:", token);

      if (token) {
        const bookmarkedIds = JSON.parse(token);
        const response = await fetch("http://192.168.33.4:3001/api/products");
        const allProducts = await response.json();

        const filtered = allProducts.filter((product: any) =>
          bookmarkedIds.includes(String(product._id))
        );

        console.log("Bookmark result:", filtered);
        setBookmarkedItems(filtered);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Lỗi khi fetch bookmark:", error);
    }
  };

  const Item = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.imgCard} />
      <Text style={styles.nameCard} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.priceCard}>{formatPrice(item.price)}</Text>
    </View>
  );

  const formatPrice = (price: number | string): string => {
    return Number(price)
      .toLocaleString('vi-VN') + 'đ';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yêu thích</Text>
      <View style={styles.container}>
      {isLoading ? (
  <ActivityIndicator size={"large"} />
) : bookmarkedItems.length === 0 ? (
    <Text style={styles.textNull}>Hiện tại chưa có sản phẩm yêu thích nào</Text>
) : (
  <FlatList
    data={bookmarkedItems}
    keyExtractor={(item) => item._id}
    numColumns={2}
    renderItem={({ item }) => (
      <View style={{ flex: 1, margin: 8 }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("ProductDetail", { id: item._id })
          }
        >
          <Item item={item} />
        </TouchableOpacity>
      </View>
    )}
  />
)}
        
      </View>
    </View>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: "#EC761E",
    padding: 8,
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 32,
    fontFamily: "Lora-Bold"
  },
  card: {
    backgroundColor: "#FFFFFF",
    paddingTop: 5,
    height: 230,
    width: 180,
    alignContent: "space-between",
    borderRadius: 16,
    elevation: 5,
  },
  imgCard: {
    width: width / 2 - 32,
    height: width / 2 - 32,
    borderRadius: 8,
    alignSelf: "center"
  },
  nameCard: {
    fontSize: 13,
    marginTop: 5,
    marginLeft: 10,
    fontFamily: "Lora-Regular",
    width: 165,
  },
  priceCard: {
    fontSize: 13,
    marginTop: 5,
    marginLeft: 10,
    fontFamily: "Lora-Regular",
    color: "#EC761E"
  },
  textNull:{
    textAlign: "center",
    textAlignVertical: "center",
    height: 600,
    fontFamily: "Lora-Regular",
    fontSize: 16
  }
});