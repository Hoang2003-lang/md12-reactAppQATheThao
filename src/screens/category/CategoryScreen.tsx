import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import ProductCard from '../productCard/ProductCard';
import API from '../../api';

const CategoryScreen = ({ route, navigation }: any) => {
  const { code, title } = route.params;
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   navigation.setOptions({ title }); // set tiêu đề header

  //   (async () => {
  //     try {
  //       const res = await API.get('/products');
  //       console.log('📦 Toàn bộ sản phẩm:', res.data);
  //       console.log('🔍 Code cần lọc:', code);
  //       const filtered = res.data.filter(
  //         (p: any) => p.categoryCode?.toLowerCase() === code.toLowerCase()
  //       );
  //       setProducts(filtered);
  //     } catch (err) {
  //       console.error('❌ Lỗi lấy sản phẩm danh mục:', err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, [code]);

  useEffect(() => {
  navigation.setOptions({ title });

  (async () => {
    try {
      const res = await API.get('/products');
      console.log('📦 Tất cả sản phẩm:', res.data);
      console.log('🔍 Mã danh mục cần lọc:', code);

      const filtered = res.data.filter((p: any) => {
        console.log('🔍 So sánh:', p.name, '|', p.categoryCode, '===', code);
        return p.categoryCode?.toLowerCase() === code.toLowerCase();
      });

      setProducts(filtered);
    } catch (err) {
      console.error('❌ Lỗi lấy sản phẩm danh mục:', err);
    } finally {
      setLoading(false);
    }
  })();
}, [code]);

  return (
    <ScrollView style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="orange" style={{ marginTop: 30 }} />
      ) : products.length === 0 ? (
        <Text style={styles.noProduct}>Không có sản phẩm trong danh mục này</Text>
      ) : (
        <View style={styles.wrapRow}>
          {products.map((item) => (
            <View key={item._id} style={styles.productWrapper}>
              <ProductCard item={item} navigation={navigation} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

export default CategoryScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 10 },
  noProduct: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
    marginTop: 40,
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productWrapper: {
    width: '48%',
    marginBottom: 15,
  },
});
