// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import Icon from 'react-native-vector-icons/Ionicons';

// const CartScreen = ({ navigation }) => {
//   const [cartItems, setCartItems] = useState([]);
//   const [totalPrice, setTotalPrice] = useState(0);
//   const [selectAll, setSelectAll] = useState(false);  // Trạng thái chọn tất cả

//   // Lấy giỏ hàng từ AsyncStorage khi màn hình được load
//   useEffect(() => {
//     const fetchCart = async () => {
//       try {
//         const storedCart = await AsyncStorage.getItem('cart');
//         const parsedCart = storedCart ? JSON.parse(storedCart) : [];
//         setCartItems(parsedCart);
//         calculateTotalPrice(parsedCart);
//       } catch (error) {
//         console.error('Lỗi khi lấy giỏ hàng:', error);
//       }
//     };

//     fetchCart();
//   }, []);

//   // Tính tổng giá giỏ hàng cho các sản phẩm được chọn
//   const calculateTotalPrice = (items) => {
//     let total = 0;
//     items.forEach(item => {
//       if (item.selected) {
//         total += item.total;
//       }
//     });
//     setTotalPrice(total);
//   };

//   // Cập nhật số lượng sản phẩm
//   const handleQuantityChange = async (item, operation) => {
//     const updatedCart = [...cartItems];
//     const index = updatedCart.findIndex(cartItem => cartItem._id === item._id && cartItem.size === item.size);

//     if (index !== -1) {
//       if (operation === 'increase') {
//         updatedCart[index].quantity += 1;
//         updatedCart[index].total += item.price;
//       } else if (operation === 'decrease' && updatedCart[index].quantity > 1) {
//         updatedCart[index].quantity -= 1;
//         updatedCart[index].total -= item.price;
//       }

//       await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
//       setCartItems(updatedCart);
//       calculateTotalPrice(updatedCart);
//     }
//   };

//   // Xóa sản phẩm khỏi giỏ hàng
//   const handleRemoveItem = async (itemId) => {
//     const updatedCart = cartItems.filter(item => item._id !== itemId);
//     await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
//     setCartItems(updatedCart);
//     calculateTotalPrice(updatedCart);
//   };

//   // Chọn/deselect sản phẩm để thanh toán
//   const handleSelectItem = async (itemId, size) => {
//     const updatedCart = cartItems.map(item => 
//       item._id === itemId && item.size === size ? { ...item, selected: !item.selected } : item
//     );
//     await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
//     setCartItems(updatedCart);
//     calculateTotalPrice(updatedCart);
//   };

//   // Chọn hoặc bỏ chọn tất cả sản phẩm
//   const handleSelectAll = () => {
//     const updatedCart = cartItems.map(item => 
//       ({ ...item, selected: !selectAll })
//     );
//     setSelectAll(!selectAll);
//     setCartItems(updatedCart);
//     calculateTotalPrice(updatedCart);
//   };

//   // Chuyển đến màn hình thanh toán
//   const handleCheckout = () => {
//     if (cartItems.filter(item => item.selected).length === 0) {
//       Alert.alert('Giỏ hàng trống', 'Vui lòng chọn sản phẩm để thanh toán.');
//       return;
//     }
//     navigation.navigate('Checkout');
//   };

//   return (
//     <View style={styles.container}>
//       {/* Nút chọn tất cả sản phẩm */}
//       <View style={styles.selectAllContainer}>
//         <TouchableOpacity onPress={handleSelectAll}>
//           <Icon 
//             name={selectAll ? "checkbox" : "square-outline"} 
//             size={24} 
//             color={selectAll ? "green" : "gray"} 
//           />
//         </TouchableOpacity>
//         <Text style={styles.selectAllText}>Chọn tất cả</Text>
//       </View>

//       <ScrollView style={styles.cartContainer}>
//         {cartItems.length === 0 ? (
//           <Text style={styles.emptyCartText}>Giỏ hàng của bạn hiện tại trống.</Text>
//         ) : (
//           cartItems.map((item, index) => (
//             <View key={index} style={styles.cartItem}>
//               <View style={styles.checkboxContainer}>
//                 {/* Ô tích bên trái mỗi sản phẩm */}
//                 <TouchableOpacity onPress={() => handleSelectItem(item._id, item.size)}>
//                   <Icon 
//                     name={item.selected ? "checkbox" : "square-outline"} 
//                     size={24} 
//                     color={item.selected ? "green" : "gray"} 
//                   />
//                 </TouchableOpacity>
//               </View>

//               <View style={styles.itemImageContainer}>
//                 {/* Hiển thị ảnh sản phẩm */}
//                 <Image source={{ uri: item.image }} style={styles.itemImage} />
//               </View>

//               <View style={styles.itemDetails}>
//                 <Text style={styles.itemName}>{item.name}</Text>
//                 <Text style={styles.itemSize}>Size: {item.size}</Text>
//                 <Text style={styles.itemPrice}>{item.price.toLocaleString()} đ</Text>
//               </View>

//               <View style={styles.itemQuantity}>
//                 <TouchableOpacity onPress={() => handleQuantityChange(item, 'decrease')}>
//                   <Icon name="remove-circle" size={24} color="red" />
//                 </TouchableOpacity>
//                 <Text style={styles.itemQty}>{item.quantity}</Text>
//                 <TouchableOpacity onPress={() => handleQuantityChange(item, 'increase')}>
//                   <Icon name="add-circle" size={24} color="green" />
//                 </TouchableOpacity>
//               </View>

//               <TouchableOpacity onPress={() => handleRemoveItem(item._id)} style={styles.removeButton}>
//                 <Icon name="trash-bin" size={24} color="black" />
//               </TouchableOpacity>
//             </View>
//           ))
//         )}
//       </ScrollView>

//       {/* Tổng giá */}
//       <View style={styles.totalPriceContainer}>
//         <Text style={styles.totalPriceText}>Tổng cộng: {totalPrice.toLocaleString()} đ</Text>
//         {/* Nút thanh toán */}
//         <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
//           <Text style={styles.checkoutText}>Thanh toán</Text>
//         </TouchableOpacity>
//       </View>
//     </View>
//   );
// };

// export default CartScreen;

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: '#fff' },
//   selectAllContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
//   selectAllText: { fontSize: 16, marginLeft: 8 },
//   cartContainer: { padding: 16 },
//   cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 16 },
//   checkboxContainer: { flex: 1 },
//   itemImageContainer: { flex: 1 },
//   itemImage: { width: 80, height: 80, resizeMode: 'contain' },
//   itemDetails: { flex: 2, marginLeft: 16 },
//   itemName: { fontSize: 16, fontWeight: 'bold' },
//   itemSize: { fontSize: 14, color: 'gray' },
//   itemPrice: { fontSize: 14, color: 'gray' },
//   itemQuantity: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
//   itemQty: { marginHorizontal: 10, fontSize: 16 },
//   removeButton: { marginLeft: 10 },
//   totalPriceContainer: { padding: 16, borderTopWidth: 1, borderTopColor: '#ccc' },
//   totalPriceText: { fontSize: 18, fontWeight: 'bold' },
//   checkoutButton: { backgroundColor: 'orange', padding: 14, alignItems: 'center', borderRadius: 5, marginTop: 10 },
//   checkoutText: { color: '#fff', fontWeight: 'bold' },
//   emptyCartText: { textAlign: 'center', fontSize: 16, color: 'gray' },
// });


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectAll, setSelectAll] = useState(false);  // Trạng thái chọn tất cả

  // Lấy giỏ hàng từ AsyncStorage khi màn hình được load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem('cart');
        const parsedCart = storedCart ? JSON.parse(storedCart) : [];
        setCartItems(parsedCart);
        calculateTotalPrice(parsedCart);
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

  // Cập nhật số lượng sản phẩm
  const handleQuantityChange = async (item, operation) => {
    const updatedCart = [...cartItems];
    const index = updatedCart.findIndex(cartItem => cartItem._id === item._id && cartItem.size === item.size);

    if (index !== -1) {
      if (operation === 'increase') {
        updatedCart[index].quantity += 1;
        updatedCart[index].total += item.price;
      } else if (operation === 'decrease' && updatedCart[index].quantity > 1) {
        updatedCart[index].quantity -= 1;
        updatedCart[index].total -= item.price;
      }

      await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      calculateTotalPrice(updatedCart);
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (itemId) => {
    const updatedCart = cartItems.filter(item => item._id !== itemId);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotalPrice(updatedCart);
  };

  // Chọn/deselect sản phẩm để thanh toán
  const handleSelectItem = async (itemId, size) => {
    const updatedCart = cartItems.map(item => 
      item._id === itemId && item.size === size ? { ...item, selected: !item.selected } : item
    );
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotalPrice(updatedCart);
  };

  // Chọn hoặc bỏ chọn tất cả sản phẩm
  const handleSelectAll = async () => {
    const updatedCart = cartItems.map(item => 
      ({ ...item, selected: !selectAll })
    );
    setSelectAll(!selectAll);
    await AsyncStorage.setItem('cart', JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    calculateTotalPrice(updatedCart);
  };

  // Chuyển đến màn hình thanh toán
  const handleCheckout = async () => {
    const userId = await AsyncStorage.getItem('userId'); // Kiểm tra nếu có userId (người dùng đã đăng nhập)

    if (!userId) {
      // Nếu chưa đăng ký tài khoản, yêu cầu đăng ký
      Alert.alert(
        'Cần Đăng Ký',
        'Bạn cần đăng ký tài khoản để tiếp tục thanh toán.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Register'), // Chuyển đến màn hình đăng ký tài khoản
          },
        ]
      );
      return;
    }

    if (cartItems.filter(item => item.selected).length === 0) {
      Alert.alert('Giỏ hàng trống', 'Vui lòng chọn sản phẩm để thanh toán.');
      return;
    }

    // Nếu đã đăng ký tài khoản, chuyển đến màn hình thanh toán
    navigation.navigate('Checkout');
  };

  return (
    <View style={styles.container}>
      {/* Nút chọn tất cả sản phẩm */}
      <View style={styles.selectAllContainer}>
        <TouchableOpacity onPress={handleSelectAll}>
          <Icon 
            name={selectAll ? "checkbox" : "square-outline"} 
            size={24} 
            color={selectAll ? "green" : "gray"} 
          />
        </TouchableOpacity>
        <Text style={styles.selectAllText}>Chọn tất cả</Text>
      </View>

      <ScrollView style={styles.cartContainer}>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyCartText}>Giỏ hàng của bạn hiện tại trống.</Text>
        ) : (
          cartItems.map((item, index) => (
            <View key={index} style={styles.cartItem}>
              <View style={styles.checkboxContainer}>
                {/* Ô tích bên trái mỗi sản phẩm */}
                <TouchableOpacity onPress={() => handleSelectItem(item._id, item.size)}>
                  <Icon 
                    name={item.selected ? "checkbox" : "square-outline"} 
                    size={24} 
                    color={item.selected ? "green" : "gray"} 
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.itemImageContainer}>
                {/* Hiển thị ảnh sản phẩm */}
                <Image source={{ uri: item.image }} style={styles.itemImage} />
              </View>

              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSize}>Size: {item.size}</Text>
                <Text style={styles.itemPrice}>{item.price.toLocaleString()} đ</Text>
              </View>

              <View style={styles.itemQuantity}>
                <TouchableOpacity onPress={() => handleQuantityChange(item, 'decrease')}>
                  <Icon name="remove-circle" size={24} color="red" />
                </TouchableOpacity>
                <Text style={styles.itemQty}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => handleQuantityChange(item, 'increase')}>
                  <Icon name="add-circle" size={24} color="green" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={() => handleRemoveItem(item._id)} style={styles.removeButton}>
                <Icon name="trash-bin" size={24} color="black" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Tổng giá */}
      <View style={styles.totalPriceContainer}>
        <Text style={styles.totalPriceText}>Tổng cộng: {totalPrice.toLocaleString()} đ</Text>
        {/* Nút thanh toán */}
        <TouchableOpacity onPress={handleCheckout} style={styles.checkoutButton}>
          <Text style={styles.checkoutText}>Thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  selectAllContainer: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  selectAllText: { fontSize: 16, marginLeft: 8 },
  cartContainer: { padding: 16 },
  cartItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 20, borderBottomWidth: 1, borderBottomColor: '#ccc', paddingBottom: 16 },
  checkboxContainer: { flex: 1 },
  itemImageContainer: { flex: 1 },
  itemImage: { width: 80, height: 80, resizeMode: 'contain' },
  itemDetails: { flex: 2, marginLeft: 16 },
  itemName: { fontSize: 16, fontWeight: 'bold' },
  itemSize: { fontSize: 14, color: 'gray' },
  itemPrice: { fontSize: 14, color: 'gray' },
  itemQuantity: { flexDirection: 'row', alignItems: 'center', marginLeft: 8 },
  itemQty: { marginHorizontal: 10, fontSize: 16 },
  removeButton: { marginLeft: 10 },
  totalPriceContainer: { padding: 16, borderTopWidth: 1, borderTopColor: '#ccc' },
  totalPriceText: { fontSize: 18, fontWeight: 'bold' },
  checkoutButton: { backgroundColor: 'orange', padding: 14, alignItems: 'center', borderRadius: 5, marginTop: 10 },
  checkoutText: { color: '#fff', fontWeight: 'bold' },
  emptyCartText: { textAlign: 'center', fontSize: 16, color: 'gray' },
});
