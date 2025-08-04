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

// Custom Image component với error handling
const CustomImage = ({ source, style, ...props }: any) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    console.log('❌ Image failed to load:', source?.uri);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    console.log('✅ Image loaded successfully:', source?.uri);
    setImageLoading(false);
  };

  if (imageError) {
    return (
      <View style={[style, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ fontSize: 10, color: '#ccc' }}>No Image</Text>
      </View>
    );
  }

  return (
    <View style={style}>
      <Image
        source={source}
        style={[style, { position: 'absolute' }]}
        resizeMode="cover"
        onError={handleImageError}
        onLoad={handleImageLoad}
        {...props}
      />
      {imageLoading && (
        <View style={[style, { position: 'absolute', backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="small" color="orange" />
        </View>
      )}
    </View>
  );
};

// Helper function để lấy URL ảnh sản phẩm
const getProductImageUrl = (product: any) => {
  if (!product) return 'https://via.placeholder.com/100';
  
  // Thử lấy từ images array trước
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    return product.images[0];
  }
  
  // Thử lấy từ image field
  if (product.image) {
    return product.image;
  }
  
  // Thử lấy từ imageUrl field
  if (product.imageUrl) {
    return product.imageUrl;
  }
  
  // Fallback
  return 'https://via.placeholder.com/100';
};

const FavoriteScreen = ({ navigation }: any) => {
  const [favoriteItems, setFavoriteItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    setIsLoading(true);
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('🔍 User ID:', userId);
      
      if (!userId) {
        setFavoriteItems([]);
        return;
      }
  
      const res = await API.get(`/favorites/${userId}`);
      console.log('🔍 Favorites API response:', JSON.stringify(res.data, null, 2));
      
      const data = res.data;
  
      if (!Array.isArray(data) || data.length === 0) {
        console.log('🔍 No favorites found or invalid data structure');
        setFavoriteItems([]);
        return;
      }
  
      const productDetails = await Promise.all(
        data.map(async (fav: any, index: number) => {
          console.log(`🔍 Processing favorite ${index + 1}:`, fav);
          
          const productId = fav.productId?._id || fav.productId || fav._id;
          const type = fav.type || 'normal';
          
          console.log(`🔍 Product ID: ${productId}, Type: ${type}`);
  
          try {
            let productRes;
            if (type === 'sale') {
              productRes = await API.get(`/sale-products/${productId}`);
              console.log(`🔍 Sale product response:`, JSON.stringify(productRes.data, null, 2));
            } else {
              productRes = await API.get(`/products/${productId}/detail`);
              console.log(`🔍 Normal product response:`, JSON.stringify(productRes.data, null, 2));
            }
  
            // Xử lý các cấu trúc response khác nhau
            let product;
            if (type === 'sale') {
              product = productRes.data.data || productRes.data.product || productRes.data;
            } else {
              product = productRes.data.product || productRes.data.data || productRes.data;
            }
            
            console.log(`🔍 Extracted product:`, product);
  
            if (
              product &&
              typeof product === 'object' &&
              product.name &&
              (product.price || product.discount_price) &&
              (product.image || product.images)
            ) {
              return {
                _id: product._id,
                name: product.name,
                price: type === 'sale' ? product.discount_price : product.price,
                image: getProductImageUrl(product),
                type: type,
              };
            } else {
              console.warn('❌ Thiếu hoặc sai định dạng dữ liệu sản phẩm:', {
                hasProduct: !!product,
                productType: typeof product,
                hasName: !!product?.name,
                hasPrice: !!(product?.price || product?.discount_price),
                hasImage: !!(product?.image || product?.images),
                product: product
              });
              return null;
            }
          } catch (e) {
            console.error('❌ Lỗi khi lấy chi tiết sản phẩm:', productId, e);
            return null;
          }
        })
      );
  
      const filtered = productDetails.filter((p) => p !== null);
      console.log('🔍 Final favorite items:', filtered);
      setFavoriteItems(filtered);
    } catch (err) {
      console.error('❌ Lỗi khi lấy danh sách yêu thích:', err);
      setFavoriteItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const testAPI = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      console.log('🧪 Testing API with userId:', userId);
      
      if (!userId) {
        console.log('🧪 No userId found');
        return;
      }
      
      // Test favorites API
      const favoritesRes = await API.get(`/favorites/${userId}`);
      console.log('🧪 Favorites API test:', JSON.stringify(favoritesRes.data, null, 2));
      
      // Test products API
      const productsRes = await API.get('/products');
      console.log('🧪 Products API test:', JSON.stringify(productsRes.data, null, 2));
      
      // Test sale products API
      const saleProductsRes = await API.get('/sale-products');
      console.log('🧪 Sale products API test:', JSON.stringify(saleProductsRes.data, null, 2));
      
    } catch (error) {
      console.error('🧪 API test error:', error);
    }
  };

  useEffect(() => {
    fetchFavorites();
    // Uncomment để test API
    // testAPI();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  const formatPrice = (price: number | string | undefined) =>
    price !== undefined ? Number(price).toLocaleString('vi-VN') + 'đ' : '';

  const Item = ({ item }: { item: any }) => {
    console.log('🔍 Rendering favorite item:', {
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      type: item.type
    });
    
    return (
      <View style={styles.card}>
        <CustomImage 
          source={{ uri: item.image || 'https://via.placeholder.com/100' }} 
          style={styles.imgCard} 
        />
        <Text style={styles.nameCard} numberOfLines={1}>
          {item.name || 'Sản phẩm không tên'}
        </Text>
        <Text style={styles.priceCard}>{formatPrice(item.price)}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Yêu thích</Text>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#EC761E" />
          <Text style={{ marginTop: 10, color: '#666' }}>Đang tải danh sách yêu thích...</Text>
        </View>
      ) : favoriteItems.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.textNull}>
            Hiện tại chưa có sản phẩm yêu thích nào
          </Text>
          <Text style={{ marginTop: 10, color: '#999', fontSize: 14 }}>
            Hãy thêm sản phẩm vào yêu thích để xem ở đây
          </Text>
        </View>
      ) : (
        <FlatList
          data={favoriteItems}
          keyExtractor={(item) => item._id || Math.random().toString()}
          numColumns={2}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1, margin: 8 }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  if (item.type === 'sale') {
                    navigation.navigate('SaleProductDetail', { productId: item._id });
                  } else {
                    navigation.navigate('ProductDetail', { productId: item._id });
                  }
                }}>
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: '#333',
  },
  priceCard: {
    fontSize: 13,
    marginTop: 5,
    marginLeft: 10,
    fontFamily: 'Lora-Regular',
    color: '#EC761E',
    fontWeight: 'bold',
  },
  textNull: {
    textAlign: 'center',
    fontFamily: 'Lora-Regular',
    fontSize: 16,
    color: '#666',
  },
});
