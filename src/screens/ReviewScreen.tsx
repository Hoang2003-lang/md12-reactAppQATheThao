import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    Alert,
    ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRoute, useNavigation } from '@react-navigation/native';

const ReviewScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation();
    const { products } = route.params; // 👈 danh sách nhiều sản phẩm

    const [reviews, setReviews] = useState<any[]>([]);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (products) {
          console.log("📌 Products truyền sang ReviewScreen:", JSON.stringify(products, null, 3));
      
          setReviews(
            products.map((p: any) => ({
              productId: p.productId,
              rating: 0,
              content: '',
              type: p.type, // 👈 giữ type từ OrderTrackingScreen
            }))
          );
        }
      }, [products]);

    const handleSetRating = (productId: string, rating: number) => {
        setReviews((prev) =>
            prev.map((r) => (r.productId === productId ? { ...r, rating } : r))
        );
    };

    const handleSetContent = (productId: string, content: string) => {
        setReviews((prev) =>
            prev.map((r) => (r.productId === productId ? { ...r, content } : r))
        );
    };

    const handleSubmit = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('userId');
          if (!storedUserId) {
            Alert.alert('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để gửi đánh giá');
            return;
          }
      
          const userId: string = storedUserId;
          setSubmitting(true);
      
          if (reviews.length === 1) {
            // ====== CHỈ 1 SẢN PHẨM: GỌI /comments/add ======
            const single = reviews[0];
            const payload = {
              userId,
              productId: single.productId,
              rating: single.rating,
              content: single.content,
              type: single.type || "normal",
            };
      
            console.log("📌 Submitting to /comments/add:", payload);
            const res = await API.post('/comments/add', payload);
      
            if (res.data.success) {
              Alert.alert('Thành công', 'Đánh giá của bạn đã được gửi!');
              navigation.goBack();
            } else {
              Alert.alert('Lỗi', 'Không thể gửi đánh giá, vui lòng thử lại!');
            }
          } else {
            // ====== NHIỀU SẢN PHẨM: GỌI /comments/add-multi ======
            const payload = {
              userId,
              reviews: reviews.map(r => ({
                productId: r.productId,
                rating: r.rating,
                content: r.content,
                type: r.type || "normal",
              }))
            };
      
            console.log("📌 Submitting to /comments/add-multi:", payload);
            const res = await API.post('/comments/add-multi', payload);
      
            if (res.data.success) {
              Alert.alert('Thành công', 'Đánh giá của bạn đã được gửi!');
              navigation.goBack();
            } else {
              Alert.alert('Lỗi', 'Không thể gửi đánh giá, vui lòng thử lại!');
            }
          }
        } catch (err: any) {
          console.error('❌ Submit error:', err.response?.data || err.message);
          Alert.alert('Lỗi', 'Không thể gửi đánh giá.');
        } finally {
          setSubmitting(false);
        }
      };
      


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerRow}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <Icon name="chevron-back" size={24} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Đánh giá sản phẩm</Text>
                <View style={{ width: 24 }} />
            </View>

            {products.map((p: any, idx: number) => {
                const review = reviews.find((r) => r.productId === p.productId);
                return (
                    <View key={idx} style={{ marginBottom: 24 }}>
                        <View style={styles.productBox}>
                            <Image
                                source={{
                                    uri: p.productImage && p.productImage.trim() !== ""
                                        ? p.productImage
                                        : "https://via.placeholder.com/60x60.png?text=No+Image"
                                }}
                                style={styles.productImage}
                            />
                            <Text style={styles.productName}>{p.productName}</Text>
                        </View>

                        <Text style={styles.label}>Chọn số sao</Text>
                        <View style={styles.starRow}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => handleSetRating(p.productId, star)}>
                                    <Icon
                                        name={star <= (review?.rating || 0) ? 'star' : 'star-outline'}
                                        size={36}
                                        color={star <= (review?.rating || 0) ? '#facc15' : '#9ca3af'}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={styles.label}>Nội dung đánh giá</Text>
                        <TextInput
                            style={styles.textArea}
                            multiline
                            numberOfLines={5}
                            value={review?.content}
                            onChangeText={(text) => handleSetContent(p.productId, text)}
                            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                        />
                    </View>
                );
            })}

            <TouchableOpacity
                style={[styles.submitBtn, submitting && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={submitting}
            >
                <Text style={styles.submitText}>
                    {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default ReviewScreen;

const styles = StyleSheet.create({
    container: {
        padding: 16,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    backBtn: {
        padding: 4,
    },
    title: {
        flex: 1,
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
    },
    productBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    productImage: {
        width: 60,
        height: 60,
        borderRadius: 10,
        marginRight: 12,
        backgroundColor: '#eee',
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        marginTop: 10,
        marginBottom: 6,
    },
    starRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    textArea: {
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 10,
        padding: 10,
        textAlignVertical: 'top',
        minHeight: 100,
        fontSize: 14,
        marginBottom: 16,
    },
    submitBtn: {
        backgroundColor: '#ef4444',
        padding: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    submitText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});