import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import API from '../../api';
import ProductCard from '../productCard/ProductCard';

const CategoryScreen = ({ route, navigation }) => {
  const { code, title } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

 useEffect(() => {
  const fetchProducts = async () => {
    try {
      // Sử dụng title làm tên category
      const res = await API.get(`/products/categoryByName/${encodeURIComponent(title)}`);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error('Error fetching products by category name:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchProducts();
}, [title]);


  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="orange" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {products.length === 0 ? (
        <Text style={styles.noProduct}>Không có sản phẩm trong danh mục này.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item._id}
          numColumns={2}
          renderItem={({ item }) => (
            <View style={styles.itemWrapper}>
              <ProductCard item={item} navigation={navigation} />
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', textAlign: 'center', marginVertical: 10 },
  noProduct: { textAlign: 'center', marginTop: 20, fontSize: 16, color: '#888' },
  itemWrapper: { flex: 1, margin: 5 },
});
