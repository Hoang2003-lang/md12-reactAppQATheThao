import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, FlatList, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const CartScreen = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: '650000000000000000000104',
      name: 'Áo Đấu Real Madrid 2024/25',
      price: 130000,
      quantity: 1,
      image: { uri: 'https://product.hstatic.net/1000061481/product/c6b06feb89854621bea4f54.jpg' },
      selected: false,
    },
    {
      id: '650000000000000000000101',
      name: 'Áo Đấu Manchester United 2024/25',
      price: 129000,
      quantity: 1,
      image: { uri: 'https://product.hstatic.net/200000293662/product/101_af5ca712f2ac4803a.jpg' },
      selected: false,
    },
    {
      id: '650000000000000000000102',
      name: 'Áo Đấu Manchester City 2024/25',
      price: 120000,
      quantity: 1,
      image: { uri: 'https://product.hstatic.net/200000293662/product/2_729949abfd7246fd839.jpg' },
      selected: false,
    },
    {
      id: '650000000000000000000103',
      name: 'Áo Đấu Chelsea 2024/25',
      price: 3500000,
      quantity: 1,
      image: { uri: 'https://vinsport.vn/my_uploads/2024/09/Bo-quan-ao-bong-da-Chelsea-2425.jpg' },
      selected: false,
    },
    {
      id: '650000000000000000000108',
      name: 'Áo Đấu PSG 2024/25',
      price: 140000,
      quantity: 1,
      image: { uri: 'https://product.hstatic.net/1000061481/product/aurora_fn8795-411_phsfh.jpg' },
      selected: false,
    },
    {
      id: '650000000000000000000105',
      name: 'Quần Đá Bóng Nike Squad 2024',
      price: 450000,
      quantity: 1,
      image: { uri: 'https://product.hstatic.net/1000385420/product/z5500013449518_72376b0c.jpg' },
      selected: false,
    },
    {
      id: '683ebb374c208c78e118bc42',
      name: 'Áo Đấu Arsenal 2026/27',
      price: 150000,
      quantity: 1,
      image: { uri: 'https://www.sporter.vn/wp-content/uploads/2017/06/Ao-bong-da-arsenal-san-nha-2425-1.jpg' },
      selected: false,
    },
    {
      id: '68406e69abd01462f9b5190c',
      name: 'Áo Đấu Arsenal 2003/2004 upđate mới',
      price: 150000,
      quantity: 1,
      image: { uri: 'https://www.sporter.vn/wp-content/uploads/2017/06/Ao-bong-da-arsenal-san-nha-2425-1.jpg' },
      selected: false,
    },
    {
      id: '6842bf81b11a5f491b163239',
      name: 'Áo Đấu 2024/25',
      price: 550000,
      quantity: 1,
      image: { uri: 'https://link-to-image.com/arsenal2024.jpg' },
      selected: false,
    },
    {
      id: '6842c10d61d3fc606ab247bf',
      name: 'Áo Đấu 024/25',
      price: 550000,
      quantity: 1,
      image: { uri: 'https://link-to-image.com/arsenal2024.jpg' },
      selected: false,
    },
    {
      id: '6842ec00a021dbedc6dcdf34',
      name: 'Áo Arsenal 2024/25',
      price: 150000,
      quantity: 1,
      image: { uri: 'https://link-to-image.com/arsenal2024.jpg' },
      selected: false,
    },
    {
      id: '6842ec25a021dbedc6dcdf38',
      name: 'Áo Arsena 2024/25',
      price: 150000,
      quantity: 1,
      image: { uri: 'https://link-to-image.com/arsenal2024.jpg' },
      selected: false,
    },
  ]);

   const toggleSelect = (id) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selected: !item.selected } : item))
    );
  };

  const updateQuantity = (id, delta) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const deleteItem = (id) => {
    Alert.alert('Xác nhận!', 'Bạn có chắc chắn xóa đơn hàng?', [
      { text: 'Hủy bỏ', style: 'cancel' },
      {
        text: 'Đồng ý',
        onPress: () => setCartItems((prev) => prev.filter((item) => item.id !== id)),
      },
    ]);
  };

  const deleteAll = () => {
    Alert.alert('Xác nhận!', 'Bạn có chắc chắn xóa toàn bộ giỏ hàng?', [
      { text: 'Hủy bỏ', style: 'cancel' },
      { text: 'Đồng ý', onPress: () => setCartItems([]) },
    ]);
  };

  const subtotal = cartItems.reduce(
    (total, item) => (item.selected ? total + item.price * item.quantity : total),
    0
  );

  const totalQuantity = cartItems.reduce(
    (sum, item) => (item.selected ? sum + item.quantity : sum),
    0
  );

  const renderItem = ({ item }) => (
    <View style={{ flexDirection: 'row', padding: 10, alignItems: 'center' }}>
      <TouchableOpacity onPress={() => toggleSelect(item.id)}>
        <Ionicons
          name={item.selected ? 'checkbox' : 'square-outline'}
          size={24}
          color={item.selected ? 'orange' : 'black'}
        />
      </TouchableOpacity>
      <Image source={item.image} style={{ width: 60, height: 60, marginHorizontal: 10 }} />
      <View style={{ flex: 1 }}>
        <Text>{item.name}</Text>
        <Text style={{ color: 'orange' }}>{item.price.toLocaleString()}đ</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5 }}>
          <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
            <Ionicons name="remove-circle-outline" size={20} color="gray" />
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 10 }}>{item.quantity}</Text>
          <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
            <Ionicons name="add-circle-outline" size={20} color="gray" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => deleteItem(item.id)}>
          <Text style={{ color: 'orange', marginTop: 5 }}>Xoá</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>GIỎ HÀNG</Text>
        {cartItems.length > 0 ? (
          <TouchableOpacity onPress={deleteAll}>
            <Ionicons name="trash-outline" size={24} color="gray" />
          </TouchableOpacity>
        ) : <View style={{ width: 24 }} />}
      </View>

      {cartItems.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Giỏ hàng của bạn hiện đang trống</Text>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
        />
      )}

      <View style={{ padding: 15, borderTopWidth: 0.5, borderColor: '#ccc' }}>
        <Text style={{ marginBottom: 5 }}>Tổng số lượng: {totalQuantity}</Text>
        <Text style={{ marginBottom: 10 }}>Tạm tính: {subtotal.toLocaleString()}đ</Text>
        <TouchableOpacity
          style={{
            backgroundColor: subtotal > 0 ? 'orange' : '#ccc',
            padding: 12,
            borderRadius: 5,
            alignItems: 'center',
          }}
          disabled={subtotal === 0}
        >
          <Text style={{ color: 'white' }}>Tiến hành thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CartScreen;
