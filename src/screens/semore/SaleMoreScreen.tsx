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
import { getDiscountProducts } from '../../services/SaleProducts';
import SaleProductCard from '../productCard/SaleProductCard';

const { width } = Dimensions.get('window');

const SaleMoreScreen = ({ navigation, route }: any) => {
  const { title, type } = route.params;
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      if (type === 'promotion') {
        try {
          const discountList = await getDiscountProducts();
          if (isMounted) setProducts(discountList);
        } catch (err) {
          console.error('Lỗi khi lấy sản phẩm khuyến mãi:', err);
        } finally {
          if (isMounted) setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [type]);

  const renderItem = ({ item }: any) => (
    <View style={styles.productWrapper}>
      <SaleProductCard item={item} navigation={navigation} />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText} numberOfLines={1}>
          {title || 'Khuyến mãi'}
        </Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
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

export default SaleMoreScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  productWrapper: {
    width: (width - 40) / 2, // 10 + 10 padding + 10 khoảng giữa
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
});
