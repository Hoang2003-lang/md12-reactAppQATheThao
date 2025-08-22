// src/components/ProductCard.tsx
import React, { useRef } from 'react';
import { Text, Image, Pressable, Animated, StyleSheet, View } from 'react-native';

const ProductCard = ({ item, navigation }: any) => {
  const scale = useRef(new Animated.Value(1)).current;

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
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[styles.productItem, { transform: [{ scale }] }]}>
        <Image source={{ uri: item.images?.[0] }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
        <View style={styles.soldInfo}>
          <Text style={styles.soldText}>Đã bán: {item.sold || 0}</Text>
        </View>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  productItem: {
    width: 180,
    alignItems: 'center',
    marginVertical: 2,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: 160,
    height: 170,
    borderRadius: 10,
  },
  productName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5,
  },
  productPrice: {
    color: 'red',
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

export default ProductCard;
