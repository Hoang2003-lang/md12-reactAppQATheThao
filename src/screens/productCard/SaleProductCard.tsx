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
    width: 190,
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageWrapper: {
    position: 'relative',
  },
  image: {
    width: 160,
    height: 150,
    borderRadius: 10,
  },
  discountBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    backgroundColor: 'red',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  discountText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  name: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
    fontWeight: '500',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  discountPrice: {
    color: 'red',
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 12,
    color: '#888',
    textDecorationLine: 'line-through',
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
