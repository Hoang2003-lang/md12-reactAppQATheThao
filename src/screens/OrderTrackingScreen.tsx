import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import io from 'socket.io-client';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'

const socket = io('http://10.0.2.2:3002', {
  transports: ['websocket'],
});

interface OrderItem {
  _id: string;
  status: string;
  finalTotal: number;
  createdAt: string;
  paymentMethod: string;
  shippingAddress: string;
  items: {
    id_product: {
      image: string;
    };
    name: string;
    purchaseQuantity: number;
    price: number;
  }[];
}

const OrderTrackingScreen = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const isFocused = useIsFocused();
  const fetchOrders = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (userId) {
        socket.emit('join notification room', `notification_${userId}`); // 👈 thêm prefix
      }

      const res = await API.get(`/orders/user/${userId}`);
      setOrders(res.data.data || []);
    } catch (err) {
      // Alert.alert('Lỗi', 'Không thể tải đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const setupSocket = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      console.log('📲 Joining socket room:', userId);
      // Join đúng phòng
      socket.emit('join order room', userId);

      // Đón sự kiện từ server
      socket.on('orderStatusUpdated', ({ orderId, status }) => {
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          )
        );
      });
    };

    setupSocket();
    fetchOrders(); // có thể tách riêng nếu muốn load khi `isFocused`

    return () => {
      socket.off('orderStatusUpdated');
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setSelectedOrder(null); // đóng modal nếu còn
      };
    }, [])
  );


  const renderItem = ({ item }: { item: OrderItem }) => {
    const image = item.items?.[0]?.id_product?.image;

    return (
      <Pressable onPress={() => setSelectedOrder(item)} style={styles.orderBox}>
        {image && <Image source={{ uri: image }} style={styles.image} />}
        <View style={{ flex: 1 }}>
          <Text style={styles.bold}>Mã đơn: {item._id.slice(-6).toUpperCase()}</Text>
          <Text>
            Trạng thái:{' '}
            <Text style={{ color: getStatusColor(item.status), fontWeight: 'bold' }}>
              {translateStatus(item.status)}
            </Text>
          </Text>
          <Text>Tổng thanh toán: {item.finalTotal.toLocaleString('vi-VN')}đ</Text>
        </View>
      </Pressable>
    );
  };

  const renderModal = () => {
    if (!selectedOrder) return null;

    return (
      <Modal animationType="slide" transparent={true} visible={!!selectedOrder} onRequestClose={() => setSelectedOrder(null)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Chi tiết đơn hàng</Text>
              <Text style={styles.modalLabel}>Mã đơn: {selectedOrder._id}</Text>
              <Text style={styles.modalLabel}>
                Trạng thái:{' '}
                <Text style={{ color: getStatusColor(selectedOrder.status), fontWeight: 'bold' }}>
                  {translateStatus(selectedOrder.status)}
                </Text>
              </Text>
              <Text style={styles.modalLabel}>Ngày đặt: {formatDate(selectedOrder.createdAt)}</Text>
              <Text style={styles.modalLabel}>Địa chỉ giao: {selectedOrder.shippingAddress}</Text>
              <Text style={styles.modalLabel}>Thanh toán: {selectedOrder.paymentMethod.toUpperCase()}</Text>
              <Text style={styles.modalLabel}>Tổng tiền: {selectedOrder.finalTotal.toLocaleString('vi-VN')}đ</Text>

              <Text style={[styles.modalLabel, { marginTop: 10 }]}>Sản phẩm:</Text>
              {selectedOrder.items.map((item, index) => (
                <Text key={index} style={styles.productItem}>
                  • {item.name} x{item.purchaseQuantity}
                </Text>
              ))}

              {['waiting', 'pending', 'confirmed'].includes(selectedOrder.status) && (
                <Pressable
                  onPress={() => handleCancelOrder(selectedOrder._id)}
                  style={[styles.closeBtn, { backgroundColor: '#ef4444' }]}
                >
                  <Text style={{ color: '#fff' }}>Huỷ đơn hàng</Text>
                </Pressable>
              )}

              {selectedOrder.status === 'delivered' && (
                <Pressable
                  onPress={() => handleReturnOrder(selectedOrder._id)}
                  style={[styles.closeBtn, { backgroundColor: '#8b5cf6' }]}
                >
                  <Text style={{ color: '#fff' }}>Trả hàng</Text>
                </Pressable>
              )}

            </ScrollView>

            <Pressable onPress={() => setSelectedOrder(null)} style={styles.closeBtn}>
              <Text style={{ color: '#fff', fontWeight: '600' }}>Đóng</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    );
  };

  const handleCancelOrder = async (orderId: string) => {
    try {
      await API.put(`orders/${orderId}/status`, { status: 'cancelled' });
      Alert.alert('✅ Đơn hàng đã được huỷ');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error('Cancel error:', err);
      Alert.alert('❌ Huỷ đơn thất bại');
    }
  };

  const handleReturnOrder = async (orderId: string) => {
    try {
      await API.put(`orders/${orderId}/status`, { status: 'returned' });
      Alert.alert('✅ Trả hàng thành công');
      setSelectedOrder(null);
      fetchOrders();
    } catch (err) {
      console.error('Return error:', err);
      Alert.alert('❌ Trả hàng thất bại');
    }
  };

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} size="large" color="orange" />;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-back" size={24} color="#000" />
        <Text style={styles.title1} > Theo dõi đơn hàng </Text>
      </TouchableOpacity>
      <FlatList
        data={orders}
        removeClippedSubviews={false}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 24 }}>Không có đơn hàng nào.</Text>
        }
      />
      {isFocused && renderModal()}
    </View>
  );

};


export default OrderTrackingScreen;

// ==== Helpers ====

const translateStatus = (status: string) => {
  console.log('➡️ Trạng thái từ server:', status);
  switch (status) {
    case 'waiting':
      return 'Đang chờ xử lý';
    case 'pending':
      return 'Chờ xác nhận';
    case 'confirmed':
      return 'Đã xác nhận';
    case 'shipped':
      return 'Đang giao hàng';
    case 'delivered':
      return 'Đã nhận hàng';
    case 'returned':
      return 'Trả hàng';
    case 'cancelled':
      return 'Đã huỷ';
    default:
      return status;
  }
};

const getStatusColor = (status: string) => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case 'waiting':
      return '#f59e0b';
    case 'pending':
      return '#eab308';
    case 'confirmed':
      return '#10b981';
    case 'shipped':
      return '#3b82f6';
    case 'delivered':
      return '#16a34a';
    case 'cancelled':
      return '#ef4444';
    case 'returned':
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
};



const formatDate = (str: string) => new Date(str).toLocaleDateString('vi-VN');

// ==== Styles ====

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fffef6', // trắng ngà nhẹ cho sáng tổng thể
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    marginBottom: 10,
  },
  title1: {
    fontSize: 20,
    marginLeft: 70
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
    color: '#d97706', // vàng đậm hơn
  },
  orderBox: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderRadius: 16, // bo tròn hơn
    padding: 14,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 14,
  },
  bold: {
    fontWeight: '700',
    fontSize: 15,
    marginBottom: 4,
    color: '#78350f', // nâu cam trầm
  },
  // Modal
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
    color: '#d97706',
  },
  modalLabel: {
    fontSize: 14,
    marginBottom: 6,
    color: '#333',
  },
  productItem: {
    fontSize: 13,
    marginLeft: 8,
    marginTop: 2,
    color: '#555',
  },
  closeBtn: {
    backgroundColor: '#f59e0b',
    marginTop: 16,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
});