import React, { useEffect, useState } from 'react';
import {
  View,Text,FlatList,Image,TouchableOpacity,StyleSheet,Alert,ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import { useIsFocused } from '@react-navigation/native';

export default function CartScreen({ navigation }: any) {
  const [userId, setUserId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<{ [key: string]: boolean }>({});
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
    } catch (error) {
      console.error('❌ Lỗi khi gọi API giỏ hàng:', error);
      Alert.alert('Lỗi', 'Không thể tải giỏ hàng');
    }
  };

  const updateQuantity = async (productId: string, size: string, quantity: number) => {
    try {
      if (!userId) return;

      if (quantity < 1) {
        return Alert.alert('Xác nhận', 'Bạn có muốn xoá sản phẩm này?', [
          { text: 'Huỷ', style: 'cancel' },
          {
            text: 'Xoá',
            style: 'destructive',
            onPress: () => handleDeleteItem(productId, size),
          },
        ]);
      }

      await API.put(`/carts/${userId}/item`, {
        product_id: productId,
        size,
        quantity,
      });
      await fetchCart(userId);
    } catch (err) {
      console.error('❌ Lỗi cập nhật số lượng:', err);
    }
  };

  const handleDeleteItem = async (productId: string, size: string) => {
    try {
      if (!userId) return;

      await API.delete(`/carts/${userId}/item`, {
        params: { product_id: productId, size },
      });
      await fetchCart(userId);
    } catch (err) {
      console.error('❌ Lỗi xoá item:', err);
      Alert.alert('Xoá thất bại', 'Không thể xoá sản phẩm');
    }
  };

  const toggleSelectItem = (productId: string, size: string) => {
    const key = `${productId}_${size}`;
    setSelectedItems((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const calculateSelectedTotal = () => {
    return cartItems.reduce((sum: number, item: any) => {
const product = item.product_id || item;
      const key = `${product._id}_${item.size}`;
      return selectedItems[key]
        ? sum + (product.price || 0) * (item.quantity || 1)
        : sum;
    }, 0);
  };

  const handleBuyNow = () => {
    const selected = cartItems.filter((item: any) => {
      const product = item.product_id || item;
      const key = `${product._id}_${item.size}`;
      return selectedItems[key];
    });

    if (selected.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một sản phẩm để mua');
      return;
    }

    navigation.navigate('Checkout', { selectedItems: selected });
  };

  const CustomCheckbox = ({ checked, onPress }: { checked: boolean; onPress: () => void }) => (
    <TouchableOpacity onPress={onPress} style={styles.checkbox}>
      <View style={[styles.checkboxBox, checked && styles.checkboxChecked]} />
    </TouchableOpacity>
  );

  const renderItem = ({ item }: any) => {
    const product = item.product_id || item;
    const productId = product?._id || '';
    const key = `${productId}_${item.size}`;
    const isChecked = !!selectedItems[key];

    return (
      <View style={styles.itemContainer}>
        <CustomCheckbox checked={isChecked} onPress={() => toggleSelectItem(productId, item.size)} />
        <Image
          source={{ uri: product.image || 'https://via.placeholder.com/100' }}
          style={styles.image}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.name}>{product.name || 'Sản phẩm'}</Text>
          <Text style={styles.price}>Giá: {product.price?.toLocaleString()} đ</Text>
          <Text style={styles.size}>Size: {item.size}</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              onPress={() => updateQuantity(productId, item.size, item.quantity - 1)}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => updateQuantity(productId, item.size, item.quantity + 1)}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() =>
              Alert.alert('Xác nhận', 'Bạn có chắc muốn xoá sản phẩm này?', [
                { text: 'Hủy', style: 'cancel' },
                {
                  text: 'Xoá',
                  style: 'destructive',
                  onPress: () => handleDeleteItem(productId, item.size),
                },
              ])
            }
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>🗑 Xoá</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
            removeClippedSubviews={false}
          />
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng cộng đã chọn:</Text>
            <Text style={styles.totalValue}>
              {calculateSelectedTotal().toLocaleString()} đ
            </Text>
          </View>
          <TouchableOpacity style={styles.buyNowButton} onPress={handleBuyNow}>
            <Text style={styles.buyNowText}>Mua ngay</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#fff' },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  itemContainer: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  image: { width: 80, height: 80, borderRadius: 5, marginRight: 10 },
  infoContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: 'bold' },
  price: { fontSize: 14, color: '#444' },
  size: { fontSize: 14, color: '#555' },
  quantity: { fontSize: 14, color: '#888' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  qtyButton: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  qtyText: { fontSize: 16, fontWeight: 'bold' },
  deleteButton: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#ffdddd',
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  deleteText: { color: 'red', fontWeight: 'bold' },
  checkbox: { marginRight: 10, padding: 5 },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#888',
    borderRadius: 4,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: 'orange',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    marginTop: 10,
  },
  totalLabel: { fontSize: 18, fontWeight: 'bold' },
  totalValue: { fontSize: 18, color: 'orange', fontWeight: 'bold' },
  buyNowButton: {
    backgroundColor: 'orange',
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
  },
  buyNowText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  empty: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#888',
  },
});