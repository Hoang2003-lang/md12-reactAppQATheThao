import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import ProductCard from '../productCard/ProductCard';
import API from '../../api';

const CategoryScreen = ({ route, navigation }: any) => {
  const { code, title } = route.params;
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/products');
        const filtered = res.data.filter((p: any) => p.categoryCode === code);
        setProducts(filtered);
      } catch (err) {
        console.error('Lỗi lấy sản phẩm danh mục:', err);
      }
    })();
  }, [code]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.wrapRow}>
        {products.map(item => (
          <View key={item._id} style={styles.productWrapper}>
            <ProductCard item={item} navigation={navigation} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },
  productWrapper: {
    width: '48%',
    marginBottom: 15,
  }
});
