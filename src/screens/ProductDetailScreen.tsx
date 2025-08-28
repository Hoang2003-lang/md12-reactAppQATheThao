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
    user: any;
    _id: string;
    userId?: { name: string; avatar: string };
    content: string;
    rating: number;
    createdAt: string;
  };
  const [comments, setComments] = useState<Comment[]>([]);
  const [bookmark, setBookMark] = useState(false);
  const [rating, setRating] = useState(5);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);


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

  //Kiểm tra bookmark khi load sản phẩm
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
      const res = await API.get(`/products/${productId}/detail?type=normal`);
      console.log("Product detail response:", JSON.stringify(res.data, null, 2));

      setProduct(res.data.product);

      // comments đã được populate userId kèm name, avatar từ backend
      let commentsData = (res.data.comments || []).map((c: any) => ({
        ...c,
        userId: c.userId && c.userId.name
          ? { name: c.userId.name, avatar: c.userId.avatar }
          : {
            name: "Người dùng",
            avatar: "https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg",
          },
      }));


      // Log thông tin user đã comment
      console.log("Danh sách comment kèm thông tin user:");
      commentsData.forEach((c: any) => {
        console.log(
          `- User: ${c.user.name}, Avatar: ${c.user.avatar}, Nội dung: ${c.content}, Rating: ${c.rating}`
        );
      });

      setComments(commentsData);
      setAverageRating(res.data.averageRating || 0);
      setTotalReviews(res.data.totalReviews || 0);
    } catch (error) {
      console.error("Lỗi lấy sản phẩm thường:", error);
      Alert.alert("Không thể tải sản phẩm. Vui lòng thử lại sau.");
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
        image: product.images?.[0] || "",
        size: selectedSize,
        color: selectedColor,   // ✅ thêm màu
        quantity,
        price: product.price,
        total: totalPrice,
        type: 'normal',
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

  //Thêm sản phẩm yêu thích
  const saveBookmark = async () => {
    try {
      //Kiểm tra xem user đã đăng nhập chưa
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

      //Nếu thành công thì chuyển trạng thái
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

      //Nếu sản phẩm đã tồn tại trong yêu thích
      if (err?.response?.status === 400 && err.response?.data?.message?.includes('Sản phẩm đã có')) {
        setBookMark(true);

      } else {
        console.error('Lỗi thêm favorite:', err);
        Alert.alert('Không thêm được vào Yêu thích!');
      }
    }
  };

  //Gỡ bỏ sản phẩm yêu thích
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
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 4 }}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Text
              key={star}
              style={{
                fontSize: 16,
                color: star <= (product.averageRating || 0) ? 'orange' : '#ccc',
              }}
            >
              ★
            </Text>
          ))}
          <Text style={{ marginLeft: 6, color: '#555' }}>
            ({product.totalReviews || 0} đánh giá)
          </Text>
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

        <View style={{ marginTop: 24 }}>
          <View style={{ marginTop: 24 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', marginBottom: 8 }}>
              Đánh giá & Bình luận:
            </Text>

            {comments.map((c, idx) => (
              <View key={idx} style={{ marginBottom: 16, flexDirection: 'row' }}>
                {/* Avatar */}
                <Image
                  source={{ uri: c.user?.avatar || 'https://i.pinimg.com/736x/bc/43/98/bc439871417621836a0eeea768d60944.jpg' }}
                  style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
                />
                <View style={{ flex: 1 }}>
                  {/* Tên + Sao */}
                  <Text style={{ fontWeight: '600', marginBottom: 4 }}>
                    {c.user?.name || 'Người dùng'}
                  </Text>
                  <View style={{ flexDirection: 'row', marginBottom: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        name={star <= c.rating ? 'star' : 'star-outline'}
                        size={16}
                        color={star <= c.rating ? '#facc15' : '#9ca3af'}
                      />
                    ))}
                  </View>
                  <Text>{c.content}</Text>
                </View>
              </View>
            ))}

          </View>


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