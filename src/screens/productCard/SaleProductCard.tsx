import React, { useRef } from 'react';
import {
  Text,
  Image,
  Pressable,
  Animated,
  StyleSheet,
  View,
} from 'react-native';

const SaleProductCard = ({ item, navigation }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

    // console.log('Danh sách ảnh:', item.images);

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 1.03,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };

  return (
    <Pressable

      onPress={() => {
        // console.log('>> ID sản phẩm được chọn:', item._id);
        navigation.navigate('SaleProductDetail', { productId: item._id })
      }
      }
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
        <View style={styles.imageWrapper}>
          <Image source={{ uri: item.images[0] }} style={styles.image} />
          
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{item.discount_percent}%</Text>
          </View>
        </View>
        <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceContainer}>
          <Text style={styles.discountPrice}>
            {item.discount_price.toLocaleString()} đ
          </Text>
          <Text style={styles.originalPrice}>
            {item.price.toLocaleString()} đ
          </Text>
        </View>
        <View style={styles.soldInfo}>
          <Text style={styles.soldText}>Đã bán: {item.sold || 0}</Text>
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
  soldInfo: {
    marginTop: 4,
  },
  soldText: {
    fontSize: 10,
    color: '#666',
    fontStyle: 'italic',
  },
});

export default SaleProductCard;
