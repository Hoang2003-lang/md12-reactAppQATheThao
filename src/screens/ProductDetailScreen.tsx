import React, { useEffect, useState } from 'react';
import {
  View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, TextInput, Button
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import Snackbar from 'react-native-snackbar';

const ProductDetailScreen = ({ route, navigation }: any) => {
  const { productId } = route.params;
  const productType = "normal";
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  type Comment = {
    userName: string;
    rating: number;
    content: string;
    [key: string]: any;
  };
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [bookmark, setBookMark] = useState(false);
  const [rating, setRating] = useState(5);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);


  const totalPrice = product ? product.price * quantity : 0;
  // chuyển ảnh
  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prevIndex) =>
      prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
    );
  };

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
      } catch (error: any) {
        console.log('Lỗi kiểm tra trạng thái yêu thích:', error?.response?.data || error.message);
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

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${productId}/detail`);
      setProduct(res.data.product);
      setComments(res.data.comments || []);
    } catch (error) {
      console.error('Lỗi lấy sản phẩm thường:', error);
      Alert.alert('Không thể tải sản phẩm. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    if (!selectedSize) {
      Alert.alert('Vui lòng chọn size trước khi thêm vào giỏ hàng.');
      return;
    }

    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert(
          'Yêu cầu đăng nhập',
          'Bạn cần đăng nhập để thêm sản phẩm vào "giỏ hàng"',
          [
            { text: 'Huỷ', style: 'cancel' },
            { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }
          ]
        );
        return;
      }

      const cartItem = {
        user_id: userId,
        product_id: product._id,
        name: product.name,
        type: "normal",
        image: product.image,
        size: selectedSize,
        quantity,
        price: product.price,
        total: totalPrice,
      };

      await API.post('/carts/add', cartItem);

      Snackbar.show({
        text: 'Đã thêm vào giỏ hàng!',
        duration: Snackbar.LENGTH_SHORT,
      });

      navigation.navigate('Cart');
    } catch (err) {
      console.error('Lỗi thêm vào giỏ hàng:', err);
      Alert.alert('Thêm vào giỏ hàng thất bại!');
    }
  };

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      Alert.alert('Vui lòng nhập nội dung bình luận.');
      return;
    }

    try {
      // Kiểm tra đăng nhập trước khi gửi bình luận
      const userId = await AsyncStorage.getItem('userId');
      const userName = await AsyncStorage.getItem('userName');
      
      if (!userId || !userName) {
        Alert.alert(
          'Yêu cầu đăng nhập',
          'Bạn cần đăng nhập để gửi bình luận. Vui lòng đăng nhập để tiếp tục.',
          [
            { text: 'Huỷ', style: 'cancel' },
            { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }
          ]
        );
        return;
      }

      const res = await API.post('/comments', {
        productId,
        userId,
        userName,
        content: newComment,
        rating
      });

      setComments([res.data, ...comments]);
      setNewComment('');
      setRating(5);
      Alert.alert(' Gửi bình luận thành công!');
    } catch (err) {
      console.error(' Lỗi gửi bình luận:', err);
      Alert.alert('Gửi bình luận thất bại.');
    }
  };

  const saveBookmark = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
      Alert.alert(
        'Yêu cầu đăng nhập',
        'Bạn cần đăng nhập để thêm sản phẩm vào "yêu thích"',
        [
          { text: 'Huỷ', style: 'cancel' },
          { text: 'Đăng nhập', onPress: () => navigation.navigate('Login') }
        ]
      );
      return;
      }

      await API.post('/favorites/add', {
        userId,
        productId,
        type: productType
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

      <View style={styles.imageContainer}>
        {/* Nút trái */}
        <TouchableOpacity
          onPress={handlePrevImage}
          style={[styles.navButton, { left: 10 }]}
        >
          <Icon name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Image
          source={{ uri: product.images?.[currentImageIndex] }}
          style={styles.image}
        />

        {/* Nút phải */}
        <TouchableOpacity
          onPress={handleNextImage}
          style={[styles.navButton, { right: 10 }]}
        >
          <Icon name="chevron-forward" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.imageIndex}>
          {currentImageIndex + 1} / {product.images?.length}
        </Text>
      </View>
      <View style={styles.content}>
        <View style={styles.txt}>
          <Text style={styles.name}>{product.name}</Text>
          <TouchableOpacity
            onPress={() =>
              bookmark ? removeBookmark() : saveBookmark()
            }>
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

        <Text style={styles.price}>Giá: {product.price.toLocaleString()} đ</Text>
        <Text style={styles.stock}>Kho: {product.stock}</Text>

        <View style={styles.sizeRow}>
          <Text style={styles.label}>Size:</Text>
          {product.size.map((size: string) => (
            <TouchableOpacity
              key={size}
              style={[
                styles.sizeBox,
                selectedSize === size && styles.sizeBoxSelected,
              ]}
              onPress={() => setSelectedSize(size)}
            >
              <Text
                style={[
                  styles.sizeText,
                  selectedSize === size && styles.sizeTextSelected,
                ]}
              >
                {size}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.description}>{product.description}</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity style={styles.qtyButton} onPress={decreaseQuantity}>
            <Text style={styles.qtyText}>-</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNumber}>{quantity}</Text>
          <TouchableOpacity style={styles.qtyButton} onPress={increaseQuantity}>
            <Text style={styles.qtyText}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.totalPrice}>Tổng: {totalPrice.toLocaleString()} đ</Text>

        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Text style={styles.cartText}>Thêm vào giỏ hàng</Text>
        </TouchableOpacity>

        <View style={{ marginTop: 24 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Bình luận:</Text>
          {comments.length === 0 ? (
            <Text>Chưa có bình luận nào.</Text>
          ) : (
            comments.map((comment: any, index: number) => (
              <View key={index} style={{ marginVertical: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>{comment.userName}</Text>
                <Text>Đánh giá: {comment.rating}⭐</Text>
                <Text>{comment.content}</Text>
              </View>
            ))
          )}

          <Text style={{ marginTop: 16 }}>Viết bình luận:</Text>
          <TextInput
            placeholder="Nhập bình luận..."
            value={newComment}
            onChangeText={setNewComment}
            style={{
              borderColor: '#ccc',
              borderWidth: 1,
              padding: 8,
              borderRadius: 4,
              marginVertical: 8,
            }}
          />

          <Text>Chọn đánh giá:</Text>
          <View style={{ flexDirection: 'row', marginVertical: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Text style={{ fontSize: 20, color: rating >= star ? 'orange' : '#ccc' }}>★</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button title="Gửi bình luận" onPress={handleCommentSubmit} />
        </View>
      </View>
    </ScrollView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 10 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300, resizeMode: 'contain', backgroundColor: '#f9f9f9' },
  content: { padding: 16 },
  name: { fontSize: 20, fontWeight: 'bold', marginBottom: 8, width: 345 },
  price: { fontSize: 18, color: 'orange', marginVertical: 4 },
  stock: { fontSize: 14, marginBottom: 12 },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 },
  label: { fontSize: 16, marginRight: 8 },
  sizeBox: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 4,
    paddingVertical: 6, paddingHorizontal: 12,
    marginRight: 8, marginBottom: 8,
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
  txt: { flexDirection: "row" },
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
});