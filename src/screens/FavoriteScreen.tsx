import React , { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import API from '../api';

const { width } = Dimensions.get('window');

const FavoriteScreen = ({ navigation }: any) => {
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        setFavoriteItems([]);
        return;
      }

      // B1: Lấy danh sách favorite bằng axios
      const res = await API.get(`/favorites/${userId}`);
      const data = res.data;

      if (!Array.isArray(data) || data.length === 0) {
        setFavoriteItems([]);
        return;
      }

      // B2: Lấy chi tiết sản phẩm cho từng yêu thích
      const productDetails = await Promise.all(
        data.map(async (fav: any) => {
          const productId = fav.productId?._id || fav.productId || fav._id;
          try {
            const productRes = await API.get(`/products/${productId}`);
            const product = productRes.data?.data;

            if (product && product.name && product.price && product.image) {
              return {
                _id: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
              };
            } else {
              console.warn('Thiếu dữ liệu sản phẩm:', product);
              return null;
            }
          } catch (e) {
            console.error('Lỗi khi lấy sản phẩm:', productId, e);
            return null;
          }
        })
      );

      const filtered = productDetails.filter((p) => p !== null);
      setFavoriteItems(filtered);
    } catch (err) {
      console.error('Lỗi khi lấy danh sách yêu thích:', err);
      setFavoriteItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const formatPrice = (price: number | string | undefined) =>
    price !== undefined ? Number(price).toLocaleString('vi-VN') + 'đ' : '';

  const Item = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.imgCard} />
      <Text style={styles.nameCard} numberOfLines={1}>
        {item.name}
      </Text>
      <Text style={styles.priceCard}>{formatPrice(item.price)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yêu thích</Text>

      {isLoading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : favoriteItems.length === 0 ? (
        <Text style={styles.textNull}>
          Hiện tại chưa có sản phẩm yêu thích nào
        </Text>
      ) : (
        <FlatList
          data={favoriteItems}
          keyExtractor={(item) => item._id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={{ flex: 1, margin: 8 }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('ProductDetail', { productId: item._id })
                }>
                <Item item={item} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default FavoriteScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#EC761E',
    paddingBottom: 8,
    paddingTop: 3,
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 32,
    fontFamily: 'Lora-Bold',
  },
  card: {
    backgroundColor: '#FFFFFF',
    paddingTop: 5,
    height: 230,
    width: 180,
    borderRadius: 16,
    elevation: 5,
  },
  imgCard: {
    width: width / 2 - 32,
    height: width / 2 - 32,
    borderRadius: 8,
    alignSelf: 'center',
  },
  nameCard: {
    fontSize: 13,
    marginTop: 5,
    marginLeft: 10,
    fontFamily: 'Lora-Regular',
    width: 165,
  },
  priceCard: {
    fontSize: 13,
    marginTop: 5,
    marginLeft: 10,
    fontFamily: 'Lora-Regular',
    color: '#EC761E',
  },
  textNull: {
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    fontFamily: 'Lora-Regular',
    fontSize: 16,
  },
});
