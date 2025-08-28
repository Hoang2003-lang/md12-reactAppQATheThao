import React, { useRef } from 'react';
import {
  Text,
  Image,
  Pressable,
  Animated,
  StyleSheet,
  View,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SaleProductCard = ({ item, navigation }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.02,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  // Lấy rating (nếu không có thì mặc định 0)
  const rating = item.averageRating || 0;

  return (
    <Pressable
      onPress={() =>
        navigation.navigate('SaleProductDetail', { productId: item._id })
      }
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={{ flex: 1 }}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        {/* Ảnh sản phẩm */}
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: item.images?.[0] }}
            style={styles.image}
          />

          {/* Badge giảm giá */}
          {item.discount_percent > 0 && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                -{item.discount_percent}%
              </Text>
            </View>
          )}
        </View>

        {/* Tên sản phẩm */}
        <Text
          style={styles.name}
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {item.name}
        </Text>

        {/* Giá + đã bán */}
        <View style={styles.priceContainer}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.discountPrice}>
              {item.discount_price.toLocaleString()} đ
            </Text>
            <Text style={styles.originalPrice}>
              {item.price.toLocaleString()} đ
            </Text>
          </View>
          <Text style={styles.sold}>
            Đã bán {item.sold || 0}
          </Text>
        </View>

        {/* Đánh giá sao */}
        <View style={styles.ratingContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Ionicons
              key={index}
              name={index < Math.round(rating) ? 'star' : 'star-outline'}
              size={14}
              color="#FFD700"
              style={{ marginRight: 2 }}
            />
          ))}
          <Text style={styles.ratingText}>
            ({rating.toFixed(1)})
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  imageWrapper: {
    width: '100%',
    height: 230,
  },
  image: {
    width: '100%',
    height: 230,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: '#ff424f',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 3,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  name: {
    fontSize: 13,
    color: '#333',
    marginHorizontal: 6,
    marginTop: 8,
    height: 36,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 6,
    marginTop: 6,
  },
  discountPrice: {
    color: '#d0011b',
    fontWeight: 'bold',
    fontSize: 14,
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  sold: {
    fontSize: 12,
    color: '#666',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 6,
    marginBottom: 8,
    marginTop: 4,
  },
  ratingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

export default SaleProductCard;