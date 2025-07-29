import React, { useEffect, useState } from 'react';
import {
    View, Text, Image, StyleSheet, ScrollView, TouchableOpacity,
    ActivityIndicator, Alert, TextInput, Button
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import Snackbar from 'react-native-snackbar';

const SaleProductDetail = ({ route, navigation }: any) => {
    const { productId } = route.params;
    const productType= "sale";
    const [product, setProduct] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [bookmark, setBookMark] = useState(false);
    
    const [rating, setRating] = useState(5);
    console.log('>> productId nhận được:', productId);


    const totalPrice = product ? product.discount_price * quantity : 0;

    useEffect(() => {
        fetchProduct();
    }, [productId]);

    useEffect(() => {
        const checkBookmark = async () => {
          try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) return;
    
            const res = await API.get(`/favorites/check/${userId}/${productId}`);
            const isFav = res.data?.isFavorite ?? res.data?.exists ?? false;
            setBookMark(isFav);
          } catch (error: any) {
            console.log('❌ Lỗi kiểm tra trạng thái yêu thích:', error?.response?.data || error.message);
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
            const res = await API.get(`/sale-products/${productId}`);
            // console.log('📦 Kết quả API:', res.data); // 👈 Xem đây trả về gì

            setProduct(res.data.data); // ✅ đúng
            setComments(res.data.comments || []);
        } catch (error) {
            console.error('❌ Lỗi lấy sản phẩm sale:', error);
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
                Alert.alert('Bạn cần đăng nhập để thêm sản phẩm vào giỏ.');
                return;
            }

            const cartItem = {
                user_id: userId,
                product_id: product._id,
                name: product.name,
                image: product.image,
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

    const handleCommentSubmit = async () => {
        if (!newComment.trim()) {
            Alert.alert('Vui lòng nhập nội dung bình luận.');
            return;
        }

        try {
            const userId = await AsyncStorage.getItem('userId');
            const userName = await AsyncStorage.getItem('userName');

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
            Alert.alert('✅ Gửi bình luận thành công!');
        } catch (err) {
            console.error('❌ Lỗi gửi bình luận:', err);
            Alert.alert('Gửi bình luận thất bại.');
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

    const saveBookmark = async (productId: string, type: 'normal' | 'sale') => {
        try {
          const userId = await AsyncStorage.getItem('userId');
          if (!userId) {
            return Alert.alert('Bạn cần đăng nhập để dùng tính năng Yêu thích!');
          }
      
          await API.post('/favorites/add', 
            { userId, 
            productId, 
            type });
      
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
    
      const removeBookmark = async (productId: string, type: 'normal' | 'sale') => {
  try {
    const userId = await AsyncStorage.getItem('userId');
    if (!userId) return;

    await API.delete(`/favorites/${userId}/${productId}?type=${type}`);

    setBookMark(false);

    Snackbar.show({
      text: 'Xoá thành công khỏi mục Yêu thích!',
      duration: Snackbar.LENGTH_SHORT,
    });
  } catch (err) {
    console.error('Lỗi xoá favorite:', err);
    Alert.alert('Không xoá được khỏi Yêu thích!');
  }
};

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Icon name="arrow-back" size={24} color="black" />
            </TouchableOpacity>

            <Image source={{ uri: product.image }} style={styles.image} />

            <View style={styles.content}>
                <View style={styles.txt}>
                          <Text style={styles.name}>{product.name}</Text>
                          <TouchableOpacity
                            onPress={() =>
                              bookmark ? removeBookmark(product._id, productType) : saveBookmark(product._id, productType)
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
                <Text style={styles.oldPrice}>Giá gốc: {product.price.toLocaleString()} đ</Text>
                <Text style={styles.price}>Giá KM: {product.discount_price.toLocaleString()} đ</Text>
                <Text style={styles.discount}>Giảm {product.discount_percent}%</Text>
                <Text style={styles.stock}>Kho còn: {product.stock}</Text>

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
    heart: { width: 20, height: 20 }
});
