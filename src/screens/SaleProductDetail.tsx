import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import Snackbar from 'react-native-snackbar';

const FALLBACK_AVATAR =
  'https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg';
const FALLBACK_IMAGE =
  'https://via.placeholder.com/800x600.png?text=No+Image';

type Comment = {
  _id: string;
  user: { name: string; avatar: string };
  content: string;
  rating: number;
  createdAt?: string;
};

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
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const images: string[] = Array.isArray(product?.images) ? product.images : [];
  const totalPrice = product ? (product.discount_price || 0) * quantity : 0;

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  useEffect(() => {
    const checkBookmark = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;

        const res = await API.get(`/favorites/check/${userId}/${productId}?type=${productType}`);

        const isFav = res.data?.isFavorite ?? res.data?.exists ?? false;

        setBookMark(isFav);
      } catch {
        setBookMark(false);
      }
    };
    checkBookmark();

    return () => Snackbar.dismiss();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const endpoint = productType === 'sale'
        ? `/sale-products/${productId}/detail`
        : `/products/${productId}/detail`;

      const res = await API.get(endpoint);

      // Nếu có field data thì lấy, nếu không thì lấy cả res.data
      const productData = res.data?.data ?? res.data ?? null;
      setProduct(productData);

      const rawComments: any[] = Array.isArray(res.data?.comments)
        ? res.data.comments
        : Array.isArray(productData?.comments)
          ? productData.comments
          : [];

      const normalized: Comment[] = rawComments.map((c) => {
        const populatedUser =
          c && typeof c.userId === 'object' && c.userId !== null ? c.userId : null;
        return {
          _id: String(c._id),
          content: String(c.content ?? ''),
          rating: Number(c.rating ?? 0),
          createdAt: c.createdAt,
          user: {
            name: populatedUser?.name || 'Người dùng',
            avatar: populatedUser?.avatar || FALLBACK_AVATAR,
          },
        };
      });

      setComments(normalized);
      setAverageRating(Number(res.data?.averageRating ?? productData?.averageRating ?? 0));
      setTotalReviews(Number(res.data?.totalReviews ?? productData?.totalReviews ?? 0));
    } catch (err: any) {
      console.error('❌ Lỗi lấy sản phẩm:', err?.response?.data || err.message);
      Alert.alert('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };


  const increaseQuantity = () => {
    if (!product) return;
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(prev => prev - 1);
  };

  const isIncreaseDisabled = !product || quantity >= product.stock;

  const handleAddToCart = async () => {
    if (!selectedSize) {
      Alert.alert('Vui lòng chọn size trước khi thêm vào giỏ hàng.');
      return;
    }
    if (!selectedColor) {
      Alert.alert('Vui lòng chọn màu trước khi thêm vào giỏ hàng.');
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

      await API.post('/carts/add', {
        user_id: userId,
        product_id: product._id,
        name: product.name,
        image: product.image || images[0],
        size: selectedSize,
        color: selectedColor,
        quantity,
        price: product.discount_price,
        total: totalPrice,
        type: productType,
      });

      Snackbar.show({ text: 'Đã thêm vào giỏ hàng!', duration: Snackbar.LENGTH_SHORT });
      navigation.navigate('Cart');
    } catch (err) {
      console.error('❌ Lỗi thêm vào giỏ hàng:', err);
      Alert.alert('Thêm vào giỏ hàng thất bại!');
    }
  };

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

      await API.post('/favorites/add', { userId, productId, type: productType });
      setBookMark(true);
      Snackbar.show({
        text: 'Thêm thành công vào mục Yêu thích!',
        duration: Snackbar.LENGTH_SHORT,
        action: { text: 'Xem', onPress: () => navigation.navigate('Home', { screen: 'Favorite' }) },
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
      Snackbar.show({ text: 'Xoá thành công khỏi mục Yêu thích!', duration: Snackbar.LENGTH_SHORT });
    } catch (err) {
      console.error('❌ Lỗi xoá favorite:', err);
      Alert.alert('Không xoá được khỏi Yêu thích!');
    }
  };

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

      {/* Image */}
      <View style={styles.imageContainer}>
        <TouchableOpacity
          onPress={() =>
            setCurrentImageIndex((prev) =>
              prev === 0 ? Math.max((images.length ?? 1) - 1, 0) : prev - 1
            )
          }
          style={[styles.navButton, { left: 10 }]}
        >
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Image
          source={{ uri: images[currentImageIndex] || product.image || FALLBACK_IMAGE }}
          style={styles.image}
        />

        <TouchableOpacity
          onPress={() =>
            setCurrentImageIndex((prev) =>
              prev === (images.length ?? 1) - 1 ? 0 : prev + 1
            )
          }
          style={[styles.navButton, { right: 10 }]}
        >
          <Icon name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>

        {!!images.length && (
          <Text style={styles.imageIndex}>
            {currentImageIndex + 1} / {images.length}
          </Text>
        )}
      </View>

      <View style={styles.content}>
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

        {/* Rating summary */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Text key={star} style={{ fontSize: 16, color: star <= averageRating ? 'orange' : '#ccc' }}>
              ★
            </Text>
          ))}
          <Text style={{ marginLeft: 6, color: '#555' }}>({totalReviews || 0} đánh giá)</Text>
        </View>

        {/* Giá */}
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

        {/* Size */}
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

            {/* <TouchableOpacity onPress={() => navigation.navigate("SizeGuide")}>
              <Text style={styles.sizeGuideText}>Hướng dẫn chọn size</Text>
            </TouchableOpacity> */}
          </View>
        )}

        <View style={styles.colorRow}>
          <Text style={styles.label}>Màu:</Text>
          {product.colors?.map((color: string) => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorBox,
                selectedColor === color && styles.colorBoxSelected,
              ]}
              onPress={() => setSelectedColor(color)}
            >
              <Text
                style={[
                  styles.colorText,
                  selectedColor === color && styles.colorTextSelected,
                ]}
              >
                {color}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {!!product.description && <Text style={styles.description}>{product.description}</Text>}

        {/* Quantity */}
        <View style={styles.quantityRow}>
          <TouchableOpacity style={styles.qtyButton} onPress={decreaseQuantity}>
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>

          <Text style={styles.qtyNumber}>{quantity}</Text>

          <TouchableOpacity
            style={[
              styles.qtyButton,
              quantity >= product.stock && { opacity: 0.4 }
            ]}
            onPress={increaseQuantity}
            disabled={quantity >= product.stock}
          >
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        {quantity >= product.stock && (
          <Text style={{ color: 'red', marginTop: 4 }}>
            Số lượng sản phẩm bạn chọn đã vượt quá số lượng sản phẩm trong kho
          </Text>
        )}

        <Text style={styles.totalPrice}>Tổng: {totalPrice.toLocaleString()} đ</Text>

        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Text style={styles.cartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>

        {/* Comments */}
        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
            Đánh giá & Bình luận:
          </Text>

          {comments.map((c) => (
            <View key={c._id} style={{ marginBottom: 16, flexDirection: 'row' }}>
              <Image
                source={{ uri: c.user.avatar || FALLBACK_AVATAR }}
                style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
              />
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', marginBottom: 4 }}>{c.user.name}</Text>
                <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Icon
                      key={star}
                      name={star <= (c.rating || 0) ? 'star' : 'star-outline'}
                      size={16}
                      color={star <= (c.rating || 0) ? '#facc15' : '#9ca3af'}
                    />
                  ))}
                </View>
                <Text>{c.content}</Text>
              </View>
            </View>
          ))}
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
  image: { width: '100%', height: 300, resizeMode: 'contain', backgroundColor: '#f9f9f9' },
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
  heart: { width: 20, height: 20 },
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
  colorRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 },
  colorBox: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 4,
    paddingVertical: 6, paddingHorizontal: 12,
    marginRight: 8, marginBottom: 8,
  },
  colorBoxSelected: { borderColor: 'orange', backgroundColor: '#ffe6cc' },
  colorText: { fontSize: 14 },
  colorTextSelected: { color: 'orange', fontWeight: 'bold' },
});