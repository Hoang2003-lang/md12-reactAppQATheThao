import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api/api';
import { useIsFocused } from '@react-navigation/native';

export default function CartScreen({ navigation }: any) {
  const [userId, setUserId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
          await fetchCart(id);
        } else {
          setCartItems([]);
        }
      } catch (error) {
        console.error('❌ Lỗi lấy userId:', error);
        setCartItems([]);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) loadCart();
  }, [isFocused]);

  const fetchCart = async (id: string) => {
    try {
      const res = await API.get(`/carts/${id}`);
      if (res.data?.data?.items && Array.isArray(res.data.data.items)) {
        setCartItems(res.data.data.items);
      } else {
        setCartItems([]);
      }
    } catch (error: any) {
      if (error.response?.status === 404) {
        console.log('ℹ️ Giỏ hàng chưa tồn tại với user_id này');
        setCartItems([]);
      } else {
        console.error('❌ Lỗi khi gọi API giỏ hàng:', error);
        Alert.alert('Lỗi', 'Không thể tải giỏ hàng');
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum: number, item: any) => {
      return sum + (item.product_id?.price || 0) * item.quantity;
    }, 0);
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.product_id?.image || 'https://via.placeholder.com/100' }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.product_id?.name || 'Sản phẩm'}</Text>
        <Text style={styles.price}>
          Giá: {item.product_id?.price?.toLocaleString()} đ
        </Text>
        <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
        <Text style={styles.size}>Size: {item.size}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Giỏ hàng của bạn</Text>

      {loading ? (
        <ActivityIndicator size="large" color="orange" />
      ) : cartItems.length === 0 ? (
        <Text style={styles.empty}>Giỏ hàng trống</Text>
      ) : (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalValue}>{calculateTotal().toLocaleString()} đ</Text>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, textAlign: 'center', color: '#333' },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd'
  },
  image: { width: 80, height: 80, borderRadius: 5, marginRight: 10 },
  infoContainer: { flex: 1, justifyContent: 'space-between' },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: '#444' },
  quantity: { fontSize: 14, color: '#888' },
  size: { fontSize: 14, color: '#555' },
  empty: { textAlign: 'center', marginTop: 30, fontSize: 16, color: '#888' },
  totalContainer: {
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  totalValue: { fontSize: 18, color: 'orange', fontWeight: 'bold' }
});
