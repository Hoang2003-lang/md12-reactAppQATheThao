// src/screens/OrderSuccessScreen.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import API from '../api';

export default function OrderSuccessScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail(orderId);
    }
  }, [orderId]);

  const fetchOrderDetail = async (id: string) => {
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data.data);
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="orange" />
        <Text style={{ marginTop: 12 }}>Đang tải đơn hàng...</Text>
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: 'red' }}>Không tìm thấy đơn hàng.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/success.png')} // ✅ Thêm ảnh success tại /assets/success.png
        style={styles.image}
      />
      <Text style={styles.title}>🎉 Đặt hàng thành công!</Text>
      <Text style={styles.subtitle}>Mã đơn: {order.order_code || order._id?.slice(-6).toUpperCase()}</Text>
      <Text style={styles.summary}>Tổng thanh toán: {order.finalTotal?.toLocaleString('vi-VN')} đ</Text>
      <Text style={styles.status}>Trạng thái: 🕐 {translateStatus(order.status)}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('OrderTracking')}>
        <Text style={styles.buttonText}>Xem đơn hàng</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { backgroundColor: '#ddd' }]} onPress={() => navigation.navigate('Home')}>
        <Text style={[styles.buttonText, { color: '#333' }]}>Về trang chủ</Text>
      </TouchableOpacity>
    </View>
  );
}

const translateStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Chờ xác nhận';
    case 'confirmed':
      return 'Đã xác nhận';
    case 'shipped':
      return 'Đang giao';
    case 'delivered':
      return 'Đã giao';
    case 'cancelled':
      return 'Đã huỷ';
    default:
      return status;
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffef6',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  image: {
    width: 160,
    height: 160,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#22c55e',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 6,
  },
  summary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#d97706',
    marginBottom: 6,
  },
  status: {
    fontSize: 14,
    marginBottom: 20,
    color: '#555',
  },
  button: {
    backgroundColor: 'orange',
    padding: 14,
    borderRadius: 8,
    marginTop: 12,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
