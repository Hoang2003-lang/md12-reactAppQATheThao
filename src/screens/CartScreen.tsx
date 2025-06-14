import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';

const API_URL = 'http://192.168.0.103:3001/api/carts'; // Đảm bảo IP đúng

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(API_URL);
      const allCarts = response.data.data;

      // ❌ KHÔNG LỌC theo user_id => LẤY TOÀN BỘ
      setCartItems(allCarts);
      console.log('🛒 Tất cả giỏ hàng:', allCarts);
    } catch (error) {
      console.error('❌ Lỗi khi lấy giỏ hàng:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.product.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.product.name}</Text>
        <Text style={styles.price}>{item.product.price.toLocaleString()} đ</Text>
        <Text style={styles.user}>👤 User ID: {item.user_id}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Đang tải danh sách giỏ hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🛒 Danh sách tất cả giỏ hàng</Text>
      {cartItems.length > 0 ? (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
        />
      ) : (
        <Text style={styles.emptyText}>Chưa có sản phẩm nào trong giỏ hàng.</Text>
      )}
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 12 },
  item: { flexDirection: 'row', marginBottom: 12, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 8 },
  image: { width: 80, height: 80, marginRight: 10, borderRadius: 6 },
  info: { justifyContent: 'center', flexShrink: 1 },
  name: { fontSize: 16, fontWeight: '500' },
  price: { fontSize: 14, color: 'green', marginTop: 4 },
  user: { fontSize: 12, color: '#666', marginTop: 2 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 30 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
