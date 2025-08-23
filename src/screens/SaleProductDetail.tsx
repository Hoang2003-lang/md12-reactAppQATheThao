import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  TextInput,
  Button,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import Snackbar from 'react-native-snackbar';

type UserRef = {
  name?: string;
  avatar?: string;
};

type Comment = {
  _id: string;
  userId?: UserRef;
  userName?: string; // fallback nếu API trả về kiểu khác
  content: string;
  rating: number;
  createdAt?: string;
};

const FALLBACK_AVATAR =
  'https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg';

const SaleProductDetail = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const productType = 'sale';

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  const [comments, setComments] = useState<Comment[]>([]);
  const [bookmark, setBookMark] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // --- UI computed ---
  const totalPrice = product ? (product?.discount_price || 0) * quantity : 0;

  const { averageRating, totalReviews } = useMemo(() => {
    if (!comments?.length) return { averageRating: 0, totalReviews: 0 };
    const sum = comments.reduce((acc, c) => acc + (Number(c.rating) || 0), 0);
    const avg = sum / comments.length;
    return { averageRating: Number(avg.toFixed(1)), totalReviews: comments.length };
  }, [comments]);

  // --- Image carousel handlers ---
  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  // --- Effects ---
  useEffect(() => {
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
        const res = await API.get(
          `/favorites/check/${userId}/${productId}?type=${productType}`
        );
        const isFav = res.data?.isFavorite ?? res.data?.exists ?? false;
        setBookMark(isFav);
      } catch (error: any) {
        console.log(
          '❌ Lỗi kiểm tra trạng thái yêu thích:',
          error?.response?.data || error.message
        );
        setBookMark(false);
      }
    };
    checkBookmark();
  }, [productId]);

  useEffect(() => {
    return () => {
      Snackbar.dismiss();
    };
  }, []);

  // --- API ---
  const fetchProduct = async () => {
    try {
      const res = await API.get(`/sale-products/${productId}`);
      // Kỳ vọng: { data: { ...product }, comments: [...] }
      setProduct(res.data?.data || null);
      setComments(Array.isArray(res.data?.comments) ? res.data.comments : []);
    } catch (error) {
      console.error('❌ Lỗi lấy sản phẩm sale:', error);
      Alert.alert('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  // --- Quantity ---
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // --- Cart ---
  const handleAddToCart = async () => {
    if (!selectedSize) {
      Alert.alert('Vui lòng chọn size trước khi thêm vào giỏ hàng.');
      return;
    }
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để thêm sản phẩm vào "giỏ hàng"', [
          { text: 'Huỷ', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') },
        ]);
        return;
      }

      const cartItem = {
        user_id: userId,
        product_id: product._id,
        name: product.name,
        type: 'sale',
        image: product.image || product.images?.[0],
        size: selectedSize,
        quantity,
        price: product.discount_price,
        total: totalPrice,
      };

      await API.post('/carts/add', cartItem);

      Snackbar.show({
        text: 'Đã thêm vào giỏ hàng!',
        duration: Snackbar.LENGTH_SHORT,
      });

      navigation.navigate('Cart');
    } catch (err) {
      console.error('❌ Lỗi thêm vào giỏ hàng:', err);
      Alert.alert('Thêm vào giỏ hàng thất bại!');
    }
  };

  // --- Favorite ---
  const saveBookmark = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để thêm sản phẩm vào "yêu thích"', [
          { text: 'Huỷ', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') },
        ]);
        return;
      }

      await API.post('/favorites/add', {
        userId,
        productId,
        type: productType,
      });

      setBookMark(true);
      Snackbar.show({
        text: 'Thêm thành công vào mục Yêu thích!',
        duration: Snackbar.LENGTH_SHORT,
        action: {
          text: 'Xem',
          onPress: () => navigation.navigate('Home', { screen: 'Favorite' }),
        },
      });
    } catch (err: any) {
      if (err?.response?.status === 400 && err.response?.data?.message?.includes('Sản phẩm đã có')) {
        setBookMark(true);
      } else {
        console.error('❌ Lỗi thêm favorite:', err);
        Alert.alert('Không thêm được vào Yêu thích!');
      }
    }
  };

  const removeBookmark = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      await API.delete(`/favorites/${userId}/${productId}?type=${productType}`);

      setBookMark(false);
      Snackbar.show({
        text: 'Xoá thành công khỏi mục Yêu thích!',
        duration: Snackbar.LENGTH_SHORT,
      });
    } catch (err) {
      console.error('❌ Lỗi xoá favorite:', err);
      Alert.alert('Không xoá được khỏi Yêu thích!');
    }
  };

  // --- Render guards ---
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="orange" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Không tìm thấy sản phẩm</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handlePrevImage} style={[styles.navButton, { left: 10 }]}>
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Image
          source={{ uri: product.images?.[currentImageIndex] || product.image }}
          style={styles.image}
        />

        <TouchableOpacity onPress={handleNextImage} style={[styles.navButton, { right: 10 }]}>
          <Icon name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>

        {!!product.images?.length && (
          <Text style={styles.imageIndex}>
            {currentImageIndex + 1} / {product.images?.length}
          </Text>
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Name + Favorite */}
        <View style={styles.txt}>
          <Text style={styles.name}>{product.name}</Text>
          <TouchableOpacity onPress={() => (bookmark ? removeBookmark() : saveBookmark())}>
            <Image
              source={
                bookmark
                  ? require('../assets/images/check_fav.png')
                  : require('../assets/images/uncheck_fav.png')
              }
              style={styles.heart}
            />
          </TouchableOpacity>
        </View>

        {/* Rating summary (đồng bộ UI với ProductDetailScreen) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Text
              key={star}
              style={{
                fontSize: 16,
                color: star <= (averageRating || 0) ? 'orange' : '#ccc',
              }}
            >
              ★
            </Text>
          ))}
          <Text style={{ marginLeft: 6, color: '#555' }}>
            ({totalReviews} đánh giá)
          </Text>
        </View>

        {/* Prices */}
        <Text style={styles.oldPrice}>
          Giá gốc: {Number(product.price || 0).toLocaleString()} đ
        </Text>
        <Text style={styles.price}>
          Giá KM: {Number(product.discount_price || 0).toLocaleString()} đ
        </Text>
        {!!product.discount_percent && (
          <Text style={styles.discount}>Giảm {product.discount_percent}%</Text>
        )}
        <Text style={styles.stock}>Kho: {product.stock}</Text>

        {/* Sizes */}
        {!!product.size?.length && (
          <View style={styles.sizeRow}>
            <Text style={styles.label}>Size:</Text>
            {product.size.map((size: string) => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeBox, selectedSize === size && styles.sizeBoxSelected]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextSelected]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Description */}
        {!!product.description && <Text style={styles.description}>{product.description}</Text>}

        {/* Quantity */}
        <View style={styles.quantityRow}>
          <TouchableOpacity style={styles.qtyButton} onPress={decreaseQuantity}>
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNumber}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyButton} onPress={increaseQuantity}>
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Total */}
        <Text style={styles.totalPrice}>Tổng: {totalPrice.toLocaleString()} đ</Text>

        {/* Add to cart */}
        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Text style={styles.cartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>

        {/* Comments (UI giống màn hình thường) */}
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
            Đánh giá & Bình luận:
          </Text>

          {Array.isArray(comments) && comments.length > 0 ? (
            comments.map((c, idx) => {
              const displayName = c.userId?.name || c.userName || 'Người dùng';
              const avatar = c.userId?.avatar || FALLBACK_AVATAR;
              const content = c.content || '';
              const rating = Number(c.rating) || 0;
              return (
                <View key={idx} style={{ marginBottom: 16, flexDirection: 'row' }}>
                  {/* Avatar */}
                  <Image
                    source={{ uri: avatar }}
                    style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    {/* Tên + Sao */}
                    <Text style={{ fontWeight: '600', marginBottom: 4 }}>{displayName}</Text>
                    <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Icon
                          key={`${idx}-${star}`}
                          name={star <= rating ? 'star' : 'star-outline'}
                          size={16}
                          color={star <= rating ? '#facc15' : '#9ca3af'}
                        />
                      ))}
                    </View>
                    <Text>{content}</Text>
                  </View>
                </View>
              );
            })
          ) : (
            <Text>Chưa có bình luận nào.</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default SaleProductDetail;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    backgroundColor: '#f9f9f9',
  },
  content: { padding: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, width: 345 },
  oldPrice: { fontSize: 14, color: '#888', textDecorationLine: 'line-through' },
  price: { fontSize: 18, color: 'orange', marginVertical: 4 },
  discount: { fontSize: 14, color: 'red', marginBottom: 8 },
  stock: { fontSize: 14, marginBottom: 12 },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 },
  label: { fontSize: 16, marginRight: 8 },
  sizeBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  sizeBoxSelected: { borderColor: 'orange', backgroundColor: '#ffe6cc' },
  sizeText: { fontSize: 14 },
  sizeTextSelected: { color: 'orange', fontWeight: 'bold' },
  description: { fontSize: 14, color: '#444', marginBottom: 20 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  qtyButton: { borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 4 },
  qtyText: { fontSize: 16 },
  qtyNumber: { marginHorizontal: 12, fontSize: 16 },
  totalPrice: { fontSize: 16, fontWeight: 'bold', marginBottom: 16 },
  cartButton: { backgroundColor: 'orange', padding: 14, alignItems: 'center', borderRadius: 5 },
  cartText: { color: '#fff', fontWeight: 'bold' },
  txt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heart: { width: 20, height: 20, marginLeft: 8 },
  imageContainer: {
    position: 'relative',
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -15 }],
    padding: 6,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    zIndex: 10,
  },
  imageIndex: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    fontSize: 14,
  },
});
