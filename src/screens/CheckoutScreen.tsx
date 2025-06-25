import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';  // Đảm bảo API đã được cấu hình đúng

const CheckoutScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: '',
    address: '',
    phone: ''
  });
  const [userId, setUserId] = useState(null);  // Lưu ID người dùng từ AsyncStorage

  // Lấy giỏ hàng và thông tin người dùng khi màn hình được load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        setCartItems(parsedCart);
        calculateTotalPrice(parsedCart);

        // Lấy thông tin người dùng từ AsyncStorage
        const id = await AsyncStorage.getItem('userId');
        if (id) {
          setUserId(id);
          const name = await AsyncStorage.getItem('userName');
          setUserInfo((prevInfo) => ({ ...prevInfo, name }));
        }
      } catch (error) {
        console.error('Lỗi khi lấy giỏ hàng:', error);
      }
    };

    fetchCart();
  }, []);

  // Tính tổng giá giỏ hàng cho các sản phẩm được chọn
  const calculateTotalPrice = (items) => {
    let total = 0;
    items.forEach(item => {
      if (item.selected) {
        total += item.total;
      }
    });
    setTotalPrice(total);
  };

  // Xử lý thanh toán và tạo đơn hàng
  const handlePlaceOrder = async () => {
    const { name, address, phone } = userInfo;

    if (!name || !address || !phone) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin giao hàng.');
      return;
    }

    if (!userId) {
      // Nếu chưa đăng nhập, yêu cầu đăng nhập
      Alert.alert('Thông báo', 'Bạn cần đăng nhập trước khi thanh toán.', [
        { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') },
        { text: 'Bỏ qua', onPress: () => handleGuestCheckout() }
      ]);
      return;
    }

    try {
      const orderData = {
        id_user: userId,
        items: cartItems,
        shippingFee: 0, // Có thể lấy từ giỏ hàng hoặc tính toán thêm
        discount: 0, // Tương tự, có thể thêm logic giảm giá
        paymentMethod: 'Credit Card',  // Hoặc từ form
        shippingAddress: address,
        voucherId: null  // Mã giảm giá nếu có
      };

      // Gửi yêu cầu tạo đơn hàng lên server
      const response = await API.post('/orders', orderData);
      if (response.data) {
        Alert.alert('Đặt hàng thành công', 'Cảm ơn bạn đã đặt hàng!');
        // Chuyển tới trang xác nhận đơn hàng hoặc trang chủ
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi tạo đơn hàng.');
    }
  };

  // Xử lý cho khách hàng chưa đăng nhập (Checkout mà không cần tài khoản)
  const handleGuestCheckout = async () => {
    // Bạn có thể tiếp tục quá trình thanh toán mà không yêu cầu đăng nhập
    // Hoặc yêu cầu tạo tài khoản sau khi thanh toán
    Alert.alert('Thanh toán thành công', 'Cảm ơn bạn đã mua hàng!');
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.cartContainer}>
        <Text style={styles.title}>Thông tin giỏ hàng</Text>

        {cartItems.length === 0 ? (
          <Text style={styles.emptyCartText}>Giỏ hàng của bạn hiện tại trống.</Text>
        ) : (
          cartItems.map((item, index) => (
            item.selected && (
              <View key={index} style={styles.cartItem}>
                <Text style={styles.itemName}>{item.name} - Size: {item.size}</Text>
                <Text style={styles.itemQty}>Số lượng: {item.quantity}</Text>
                <Text style={styles.itemPrice}>{item.price.toLocaleString()} đ</Text>
              </View>
            )
          ))
        )}
        
        <Text style={styles.totalPriceText}>Tổng cộng: {totalPrice.toLocaleString()} đ</Text>
        
        {/* Form nhập thông tin giao hàng */}
        <TextInput
          style={styles.input}
          placeholder="Nhập tên của bạn"
          value={userInfo.name}
          onChangeText={(text) => setUserInfo({ ...userInfo, name: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập địa chỉ giao hàng"
          value={userInfo.address}
          onChangeText={(text) => setUserInfo({ ...userInfo, address: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          value={userInfo.phone}
          onChangeText={(text) => setUserInfo({ ...userInfo, phone: text })}
        />
      </ScrollView>

      <TouchableOpacity onPress={handlePlaceOrder} style={styles.placeOrderButton}>
        <Text style={styles.placeOrderText}>Xác nhận và thanh toán</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  cartContainer: { padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  cartItem: { marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemQty: { fontSize: 14, color: 'gray' },
  itemPrice: { fontSize: 14, color: 'green' },
  totalPriceText: { fontSize: 16, fontWeight: 'bold', marginVertical: 10 },
  emptyCartText: { textAlign: 'center', fontSize: 16, color: 'gray' },
  input: { 
    borderColor: '#ccc',
    borderWidth: 1, 
    padding: 10, 
    borderRadius: 5, 
    marginBottom: 15 
  },
  placeOrderButton: { 
    backgroundColor: '#4CAF50', 
    padding: 15, 
    borderRadius: 5, 
    alignItems: 'center' 
  },
  placeOrderText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: 'bold' 
  }
});

export default CheckoutScreen;
