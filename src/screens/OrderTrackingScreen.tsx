import React, { useEffect, useState, useCallback } from 'react';
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
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import { useFocusEffect } from '@react-navigation/native';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
import socket from '../socket';
import { NavigationProp, useNavigation } from "@react-navigation/native";

type RootStackParamList = {
  ReviewScreen: {
    products: {
      productId: string;
      productName: string;
      productImage: string;
    }[];
  };
};



interface OrderItem {
  order_code: string;
  _id: string;
  status: string;
  finalTotal: number;
  createdAt: string;
  paymentMethod: string;
  shippingAddress: string;
  items: {
    id_product?: {
      images?: any;
      image?: string;
    };
    name: string;
    purchaseQuantity: number;
    price: number;
    images?: string[]; // Thêm field images trực tiếp
    image?: string; // Thêm field image tùy chọn
  }[];
}

// Interface mới cho ProductItem để hiển thị riêng biệt
interface ProductItem {
  orderId: string;
  orderCode: string;
  orderStatus: string;
  orderCreatedAt: string;
  orderPaymentMethod: string;
  orderShippingAddress: string;
  orderFinalTotal: number;
  productName: string;
  purchaseQuantity: number;
  price: number;
  images?: string[];
  image?: string;
  id_product?: {
    _id?: string;
    images?: any;
    image?: string;
  };
  
}


const OrderTrackingScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [productItems, setProductItems] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);
  const isFocused = useIsFocused();
  const [activeTab, setActiveTab] = useState<string>('all');
 



  // Hàm chuyển đổi orders thành productItems
  const convertOrdersToProductItems = useCallback((ordersData: OrderItem[]): ProductItem[] => {
    const items: ProductItem[] = [];

    ordersData.forEach(order => {
      order.items.forEach(product => {
        items.push({
          orderId: order._id,
          orderCode: order.order_code,
          orderStatus: order.status,
          orderCreatedAt: order.createdAt,
          orderPaymentMethod: order.paymentMethod,
          orderShippingAddress: order.shippingAddress,
          orderFinalTotal: order.finalTotal,
          productName: product.name,
          purchaseQuantity: product.purchaseQuantity,
          price: product.price,
          images: product.images,
          image: product.image,
          id_product: product.id_product,
        });
      });
    });

    return items;
  }, []);

  const fetchOrders = useCallback(async (isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        console.log('❌ Không tìm thấy userId');
        setOrders([]);
        return;
      }

      socket.emit('join notification room', `notification_${userId}`);

      const res = await API.get(`/orders/user/${userId}`);
      console.log('📦 Số lượng đơn hàng:', res.data.data?.length || 0);
      if (res.data.data && res.data.data.length > 0) {
        console.log('📦 Danh sách trạng thái:', res.data.data.map((order: OrderItem) => order.status));
      }

      // Debug: Kiểm tra cấu trúc dữ liệu sản phẩm
      if (res.data.data && res.data.data.length > 0) {
        const firstOrder = res.data.data[0];
        console.log('🔍 Đơn hàng đầu tiên:', {
          orderCode: firstOrder.order_code,
          status: firstOrder.status,
          itemsCount: firstOrder.items?.length || 0
        });

        if (firstOrder.items && firstOrder.items.length > 0) {
          const firstProduct = firstOrder.items[0];
          console.log('🔍 Cấu trúc sản phẩm đầu tiên:', {
            productName: firstProduct.name,
            id_product: firstProduct.id_product,
            directImages: firstProduct.images,
            directImage: firstProduct.image,
            idProductImages: firstProduct.id_product?.images,
            idProductImage: firstProduct.id_product?.image,
            hasDirectImages: firstProduct.images?.length > 0,
            hasIdProductImages: firstProduct.id_product?.images?.length > 0
          });
        }
      }

      if (!res.data.data) {
        console.log('❌ Không có dữ liệu đơn hàng');
        setOrders([]);
        setProductItems([]);
      } else {
        console.log('✅ Có', res.data.data.length, 'đơn hàng');
        setOrders(res.data.data);
        // Chuyển đổi orders thành productItems
        const items = convertOrdersToProductItems(res.data.data);
        setProductItems(items);
        console.log('📦 Có', items.length, 'sản phẩm được hiển thị');
      }
    } catch (err) {
      console.error('❌ Lỗi fetch orders:', err);
      setOrders([]);
      setProductItems([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    const setupSocket = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      console.log('🔌 Joining socket room:', userId);
      // Join đúng phòng
      socket.emit('join order room', userId);

      // Đón sự kiện từ server
      socket.on('orderStatusUpdated', ({ orderId, status }) => {
        console.log('🔄 Cập nhật trạng thái đơn hàng:', orderId, '->', status);
        setOrders((prevOrders) => {
          const updatedOrders = prevOrders.map((order) =>
            order._id === orderId ? { ...order, status } : order
          );
          // Cập nhật productItems khi orders thay đổi
          const updatedItems = convertOrdersToProductItems(updatedOrders);
          setProductItems(updatedItems);
          return updatedOrders;
        });
      });
    };

    setupSocket();
    fetchOrders(); // Load data khi component mount

    return () => {
      socket.off('orderStatusUpdated');
    };

  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('🔄 Màn hình được focus - Refresh data');
      fetchOrders(); // Gọi lại API khi màn hình được focus
      return () => {
        setSelectedOrder(null); // đóng modal nếu còn
      };
    }, [fetchOrders])
  );




  const renderItem = ({ item }: { item: ProductItem }) => {
    // Tìm order tương ứng để hiển thị trong modal
    const order = orders.find(order => order._id === item.orderId);

    return (
      <Pressable onPress={() => order && setSelectedOrder(order)} style={styles.orderBox}>
        <View style={{ flex: 1 }}>
          <View style={styles.orderHeader}>
            <Text style={styles.bold}>
              Mã đơn: #{item.orderCode || item.orderId.slice(-6).toUpperCase()}
            </Text>
            <Text style={[styles.statusText, { color: getStatusColor(item.orderStatus) }]}>
              {translateStatus(item.orderStatus)}
            </Text>
          </View>

          {/* Hiển thị sản phẩm */}
          <View style={styles.productRow}>
            {(() => {
              // Ưu tiên lấy ảnh từ images array trực tiếp, sau đó từ id_product.images, cuối cùng từ image field
              const imageUri = (item.images && item.images.length > 0 && item.images[0]) ||
                (item.id_product?.images && item.id_product.images.length > 0 && item.id_product.images[0]) ||
                item.image ||
                item.id_product?.image;

              console.log('🖼️ Ảnh sản phẩm:', {
                productName: item.productName,
                directImages: item.images,
                idProductImages: item.id_product?.images,
                directImage: item.image,
                idProductImage: item.id_product?.image,
                finalImageUri: imageUri
              });

              return imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.productThumb}
                  resizeMode="cover"
                  onError={(error) => {
                    console.log('❌ Lỗi load ảnh sản phẩm:', error.nativeEvent.error);
                  }}
                  onLoad={() => {
                    console.log('✅ Load ảnh thành công:', imageUri);
                  }}
                />
              ) : (
                <View style={[styles.productThumb, { backgroundColor: '#f3f4f6', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#e5e7eb' }]}>
                  <Icon name="image-outline" size={16} color="#9ca3af" />
                </View>
              );
            })()}
            <View style={{ flex: 1 }}>
              <Text numberOfLines={2} style={styles.productName}>
                {item.productName}
              </Text>
              <Text style={styles.productQuantity}>
                Số lượng: {item.purchaseQuantity}
              </Text>
              <Text style={styles.productPrice}>
                {item.price.toLocaleString('vi-VN')}đ
              </Text>
            </View>
          </View>

          <Text style={styles.totalText}>
            Tổng thanh toán: {item.orderFinalTotal.toLocaleString('vi-VN')}đ
          </Text>

          {['waiting', 'pending'].includes(item.orderStatus) ? (
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Xác nhận huỷ',
                  'Bạn có muốn huỷ đơn hàng này không?',
                  [
                    { text: 'Không', style: 'cancel' },
                    { text: 'Huỷ đơn', style: 'destructive', onPress: () => handleCancelOrder(item.orderId) },
                  ]
                )
              }
              style={[styles.cancelBtn, { backgroundColor: '#ef4444' }]}
            >
              <Text style={{ color: '#fff' }}>Huỷ đơn hàng</Text>
            </Pressable>
          ) : (
            <View style={[styles.cancelBtn, { backgroundColor: '#d1d5db' }]}>
              <Text style={{ color: '#6b7280' }}>Huỷ đơn hàng</Text>
            </View>
          )}

          {item.orderStatus === 'delivered' && (
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Xác nhận trả hàng',
                  'Bạn có muốn trả lại đơn hàng này không?',
                  [
                    { text: 'Không', style: 'cancel' },
                    { text: 'Trả hàng', onPress: () => handleReturnOrder(item.orderId) },
                  ]
                )
              }
              style={[styles.actionBtn, { backgroundColor: '#3b82f6' }]}
            >
              <Text style={{ color: '#fff' }}>Trả hàng</Text>
            </Pressable>
          )}

          {item.orderStatus === 'shipped' && (
            <Pressable
              onPress={() =>
                Alert.alert(
                  'Xác nhận đã nhận hàng',
                  'Bạn đã nhận đơn hàng này?',
                  [
                    { text: 'Không', style: 'cancel' },
                    { text: 'Đã nhận hàng', onPress: () => handleConfirmDelivered(item.orderId) },
                  ]
                )
              }
              style={[styles.actionBtn, { backgroundColor: '#3b82f6' }]}
            >
              <Text style={{ color: '#fff' }}>Đã nhận hàng</Text>
            </Pressable>
          )}

          {item.orderStatus === 'delivered' && (
            <Pressable
              onPress={() => {
                // Chuẩn bị dữ liệu sản phẩm để gửi sang ReviewScreen
                const reviewProducts = [{
                  productId: item.id_product?._id || "",   // hoặc item.id_product nếu là string
                  productName: item.productName,
                  productImage:
                    (item.images && item.images[0]) ||
                    (item.id_product?.images && item.id_product.images[0]) ||
                    item.image ||
                    item.id_product?.image ||
                    "https://via.placeholder.com/150"
                }];

                navigation.navigate("ReviewScreen", { products: reviewProducts });
              }}
              style={[styles.actionBtn, { backgroundColor: '#f59e0b' }]}
            >
              <Text style={{ color: '#fff' }}>Đánh giá</Text>
            </Pressable>
          )}


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
              <Text style={styles.modalLabel}>
                Mã đơn: #{selectedOrder.order_code || selectedOrder._id}
              </Text>
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
      Alert.alert('Đơn hàng đã được huỷ');
      setSelectedOrder(null);
      // Cập nhật trạng thái trong orders và productItems
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order =>
          order._id === orderId ? { ...order, status: 'cancelled' } : order
        );
        const updatedItems = convertOrdersToProductItems(updatedOrders);
        setProductItems(updatedItems);
        return updatedOrders;
      });
    } catch (err) {
      console.error('Cancel error:', err);
      Alert.alert('Huỷ đơn thất bại');
    }
  };

  const handleReturnOrder = async (orderId: string) => {
    try {
      await API.put(`orders/${orderId}/status`, { status: 'returned' });
      Alert.alert('Trả hàng thành công');
      setSelectedOrder(null);
      // Cập nhật trạng thái trong orders và productItems
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order =>
          order._id === orderId ? { ...order, status: 'returned' } : order
        );
        const updatedItems = convertOrdersToProductItems(updatedOrders);
        setProductItems(updatedItems);
        return updatedOrders;
      });
    } catch (err) {
      console.error('Return error:', err);
      Alert.alert('Trả hàng thất bại');
    }
  };

  const handleConfirmDelivered = async (orderId: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await API.put(`/orders/${orderId}/status`, { status: 'delivered' }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("Thành công", "Bạn đã xác nhận đã nhận hàng");
      // Cập nhật trạng thái trong orders và productItems
      setOrders(prevOrders => {
        const updatedOrders = prevOrders.map(order =>
          order._id === orderId ? { ...order, status: 'delivered' } : order
        );
        const updatedItems = convertOrdersToProductItems(updatedOrders);
        setProductItems(updatedItems);
        return updatedOrders;
      });
    } catch (error) {
      console.log("Lỗi xác nhận đơn hàng:", error);
      Alert.alert("Lỗi", "Không thể cập nhật trạng thái");
    }
  };

  if (loading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#f59e0b" />
      <Text style={{ marginTop: 16, color: '#6b7280' }}>Đang tải đơn hàng...</Text>
    </View>
  );

  const filteredOrders = activeTab === 'all'
    ? productItems
    : productItems.filter((item) => item.orderStatus === activeTab);

  console.log('🔍 Tab hiện tại:', activeTab, 'Số sản phẩm:', filteredOrders.length);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Icon name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Theo dõi đơn hàng</Text>
      </View>
      <View style={styles.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {statusTabs.map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabItem,
                activeTab === tab.key && styles.tabItemActive,
              ]}
              onPress={() => setActiveTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.key && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={filteredOrders}
        removeClippedSubviews={false}
        keyExtractor={(item) => `${item.orderId}_${item.productName}`}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchOrders(true)}
            colors={['#f59e0b']}
            tintColor="#f59e0b"
          />
        }
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 24, paddingHorizontal: 20 }}>
            <Text style={{ textAlign: 'center', fontSize: 16, color: '#6b7280' }}>
              {activeTab === 'all'
                ? 'Không có sản phẩm nào.'
                : `Không có sản phẩm nào ở trạng thái "${statusTabs.find(tab => tab.key === activeTab)?.label}".`
              }
            </Text>
            <Text style={{ textAlign: 'center', fontSize: 14, color: '#9ca3af', marginTop: 8 }}>
              Kéo xuống để làm mới
            </Text>
          </View>
        }
      />
      {isFocused && renderModal()}
    </View>
  );

};


export default OrderTrackingScreen;


const translateStatus = (status: string) => {
  console.log('Trạng thái từ server:', status);
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
    case 'paid':
      return 'Đã thanh toán';
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
    case 'paid':
      return '#059669';
    case 'cancelled':
      return '#ef4444';
    case 'returned':
      return '#8b5cf6';
    default:
      return '#6b7280';
  }
};

const statusTabs = [
  { key: 'all', label: 'Tất cả' },
  { key: 'waiting', label: 'Chờ xử lý' },
  // { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'confirmed', label: 'Đã xác nhận' },
  // { key: 'paid', label: 'Đã thanh toán' },
  { key: 'shipped', label: 'Đang giao hàng' },
  { key: 'delivered', label: 'Đã nhận hàng' },
  { key: 'returned', label: 'Trả hàng' },
  { key: 'cancelled', label: 'Đã huỷ' },
];


const formatDate = (str: string) => new Date(str).toLocaleDateString('vi-VN');


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fffef6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 55,
    marginBottom: 10,
    position: 'relative',
  },

  backIcon: {
    position: 'absolute',
    left: 0,
    paddingHorizontal: 10,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
    color: '#d97706',
  },
  orderBox: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    borderRadius: 16,
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
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bold: {
    fontWeight: '700',
    fontSize: 15,
    color: '#78350f',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
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
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#e5e7eb',
  },
  tabItem: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabItemActive: {
    borderBottomColor: '#f59e0b',
  },
  tabText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#f59e0b',
    fontWeight: '700',
  },
  productRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  productThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#eee',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  productName: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
  },
  productQuantity: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  productPrice: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  totalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  totalText: {
    fontWeight: '600',
    fontSize: 15,
  },
  cancelBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  actionBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
});