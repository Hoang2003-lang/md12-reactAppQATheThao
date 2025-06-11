// 📂 CartScreen.tsx
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
import API from '../api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

export default function CartScreen({ navigation }: any) {
  const [userId, setUserId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();

  useEffect(() => {
    const loadUserIdAndCart = async () => {
      setLoading(true);
      try {
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
          await fetchCart(id);
        } else {
          setCartItems([]);
          setLoading(false);
        }
      } catch (err) {
        console.error('❌ Lỗi lấy userId từ AsyncStorage:', err);
        setCartItems([]);
        setLoading(false);
      }
    };

    if (isFocused) {
      loadUserIdAndCart();
    }
  }, [isFocused]);

  const fetchCart = async (id: string) => {
    try {
      const res = await API.get(`/cart/${id}`);
      if (res.data && res.data.data && Array.isArray(res.data.data.items)) {
        setCartItems(res.data.data.items);
      } else {
        setCartItems([]);
      }
    } catch (error: any) {
      console.error('❌ Lỗi lấy giỏ hàng:', error);
      Alert.alert('Lỗi', error?.response?.data?.message || 'Không thể lấy giỏ hàng');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.product_id?.image || 'https://via.placeholder.com/100' }}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.product_id?.name || 'Tên sản phẩm'}</Text>
        <Text style={styles.price}>Giá: {item.product_id?.price?.toLocaleString() || 0} đ</Text>
        <Text style={styles.quantity}>Số lượng: {item.quantity}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng của bạn</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#000" />
      ) : cartItems.length === 0 ? (
        <Text style={styles.empty}>Giỏ hàng trống</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
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
  empty: { textAlign: 'center', marginTop: 30, fontSize: 16, color: '#888' }
});
