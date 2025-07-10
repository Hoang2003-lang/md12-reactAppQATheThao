// src/components/ProductCard.tsx
import React, { useRef } from 'react';
import { Text, Image, Pressable, Animated, StyleSheet } from 'react-native';

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
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  productItem: {
    width: 160,
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
  productImage: {
    width: 150,
    height: 150,
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
});

export default ProductCard;
