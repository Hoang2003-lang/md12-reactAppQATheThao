import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import API from '../../api';
import ProductCard from '../productCard/ProductCard';

const { width } = Dimensions.get('window');

const LogoMoreScreen = ({ navigation, route }: any) => {
  const { code, title } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProductsByCategory = async () => {
      try {
        const res = await API.get('/products');
        const all = res.data;
        const filtered = all.filter((p: any) => p.categoryCode === code);
        if (isMounted) setProducts(filtered);
      } catch (error) {
        console.error('Lỗi lấy sản phẩm theo danh mục:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProductsByCategory();

    return () => {
      isMounted = false;
    };
  }, [code]);

  const renderItem = ({ item }: any) => (
    <View style={styles.productWrapper}>
      <ProductCard item={item} navigation={navigation} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText} numberOfLines={1}>{title || 'Sản phẩm'}</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20, margin: 10 }} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={(item: any) => item._id}
          numColumns={2}
          contentContainerStyle={styles.list}
          removeClippedSubviews={false}

        />
      )}
    </SafeAreaView>
  );
};

export default LogoMoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3ff',
    
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
  },
  backButton: {
    marginRight: 10
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1
  },
  list: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  productWrapper: {
  width: (width - 30) / 2, // 2 cột
  margin: 5,               // khoảng cách đều giữa các item
  backgroundColor: '#fff',
  borderRadius: 8,
  overflow: 'hidden',
  elevation: 2, // bóng nhẹ (Android)
  shadowColor: '#000', // bóng iOS
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

});