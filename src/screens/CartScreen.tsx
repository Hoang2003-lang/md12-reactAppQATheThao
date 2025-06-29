import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCartItems = async () => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setCartItems([]);
        return;
      }

      const res = await fetch(`http://192.168.33.4:3001/api/carts/${userId}`);
      const data = await res.json();

      if (res.ok && data.success) {
        // Kiểm tra dữ liệu trả về từ API để đảm bảo tính chính xác
        console.log("Dữ liệu giỏ hàng:", data); // Log dữ liệu để kiểm tra cấu trúc
        setCartItems(data.data.products || []);  // Đảm bảo cấu trúc này khớp với phản hồi của backend
      } else {
        console.error("Lỗi khi lấy giỏ hàng:", data.message);
        setCartItems([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu giỏ hàng:', error);
      setCartItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Sử dụng useEffect và useFocusEffect để tải lại dữ liệu giỏ hàng khi cần
  useEffect(() => {
    fetchCartItems();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCartItems();
    }, [])
  );

  const formatPrice = (price) => {
    return price.toLocaleString() + ' đ';
  };

  const Item = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.product_id?.image || 'https://via.placeholder.com/150' }} style={styles.imgCard} />
      <Text style={styles.nameCard} numberOfLines={1}>
        {item.product_id?.name}
      </Text>
      <Text style={styles.priceCard}>{formatPrice(item.product_id?.price)}</Text>
      <Text style={styles.quantityCard}>Số lượng: {item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Giỏ Hàng</Text>

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : cartItems.length === 0 ? (
        <Text style={styles.textNull}>Giỏ hàng của bạn hiện tại chưa có sản phẩm nào.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.product_id._id}
          renderItem={({ item }) => (
            <View style={{ flex: 1, margin: 8 }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('ProductDetail', { productId: item.product_id._id })
                }
              >
                <Item item={item} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#EC761E',
    paddingBottom: 8,
    paddingTop: 3,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 32,
    fontFamily: 'Lora-Bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    paddingTop: 5,
    height: 230,
    width: 180,
    borderRadius: 16,
    elevation: 5,
  },
  imgCard: {
    width: width / 2 - 32,
    height: width / 2 - 32,
    borderRadius: 8,
    alignSelf: 'center',
  },
  nameCard: {
    fontSize: 13,
    marginTop: 5,
    marginLeft: 10,
    fontFamily: 'Lora-Regular',
    width: 165,
  },
  priceCard: {
    fontSize: 13,
    marginTop: 5,
    marginLeft: 10,
    fontFamily: 'Lora-Regular',
    color: '#EC761E',
  },
  quantityCard: {
    fontSize: 12,
    marginTop: 5,
    marginLeft: 10,
    fontFamily: 'Lora-Regular',
    color: '#888',
  },
  textNull: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    fontFamily: 'Lora-Regular',
    fontSize: 16,
  },
});
  