import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Image,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import ProductCard from './productCard/ProductCard';
import SaleProductCard from './productCard/SaleProductCard';
import { fetchAllProducts } from '../services/ProductServices';
import { fetchSaleProducts } from '../services/SaleProducts';
import { fetchBanners } from '../services/BannerServices';
import { fetchCategories } from '../services/CategoryServices';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const scrollRef = useRef<ScrollView>(null);
  const [banners, setBanners] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [saleProducts, setSaleProducts] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    loadAllData();

    const unsubscribe = navigation.addListener('focus', () => {
      loadCartCount();
    });

    loadCartCount();
    return unsubscribe;
  }, []);

  const loadAllData = async () => {
    try {
      const [bannerData, categoryData, productData, saleProductData] = await Promise.all([
        fetchBanners(),
        fetchCategories(),
        fetchAllProducts(),
        fetchSaleProducts()
      ]);

      setBanners(bannerData);
      setCategories(categoryData);
      setProducts(productData);
      setSaleProducts(saleProductData);
    } catch (error) {
      console.error('❌ Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleBannerPress = (banner: any) => {
    navigation.navigate('BannerDT', { banner });
  };

  useEffect(() => {
    if (banners.length === 0) return;

    const interval = setInterval(() => {
      setActiveIndex(prev => {
        const nextIndex = (prev + 1) % banners.length;
        scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [banners]);

  const loadCartCount = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) return;

      const res = await API.get(`/carts/${userId}`);
      const items = res.data?.data?.items || [];
      const totalQuantity = items.reduce(
        (sum: number, item: any) => sum + (item.quantity || 0),
        0
      );
      setCartCount(totalQuantity);
    } catch (err: any) {
      if (err.response?.status === 404) {
        setCartCount(0);
      } else {
        console.error('❌ Lỗi lấy giỏ hàng:', err);
        setCartCount(0);
      }
    }
  };

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(idx);
  };

  const Section = ({ title, onSeeMore, children }: any) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {onSeeMore && (
          <TouchableOpacity onPress={onSeeMore}>
            <Text style={styles.seeMore}>Xem thêm...</Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.wrapRow}>{children}</View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.header}>
        <Text style={styles.text}>F7 Shop</Text>
      </TouchableOpacity>

      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#999" style={{ marginHorizontal: 10 }} />
          <TextInput placeholder="Tìm kiếm ở đây" placeholderTextColor="#999" style={styles.input} />
        </View>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
          <View style={{ position: 'relative' }}>
            <Ionicons name="cart-outline" size={24} color="orange" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notification')}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Banners */}
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          style={styles.bannerWrapper}
        >
          {banners.map((b, index) => (
            <TouchableOpacity
              key={b.id || `banner-${index}`} // ✅ unique key
              activeOpacity={0.8}
              onPress={() => handleBannerPress(b)}
            >
              <Image source={{ uri: b.banner }} style={styles.bannerImage} />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.dotsContainer}>
          {banners.map((b, i) => (
            <View key={b.id || `dot-${i}`} style={[styles.dot, i === activeIndex && styles.activeDot]} />
          ))}
        </View>

        {/* Khuyến mãi */}
        <View style={{ marginTop: 10 }}>
          <Text style={styles.sectionTitle}>Khuyến mãi</Text>
          <View style={{ paddingHorizontal: 10 }}>
            <View style={styles.gridContainer}>
              {saleProducts.slice(0, 4).map(item => (
                <View key={item._id} style={styles.gridItem}>
                  <SaleProductCard item={item} navigation={navigation} />
                </View>
              ))}
            </View>
          </View>

        </View>

        <Section title="Tất cả sản phẩm">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {products.map((item, index) => (
              <View key={item._id || `product-${index}`} style={styles.productWrapper}>
                <ProductCard item={item} navigation={navigation} />
              </View>
            ))}
          </ScrollView>
        </Section>

        {/* Áo đội tuyển */}
        <Section
          title="Áo đội tuyển quốc gia"
          onSeeMore={() =>
            navigation.navigate('Promotion', {
              title: 'Áo Đội Tuyển Quốc Gia',
              type: 'national'
            })
          }
        >
          {products
            .filter(p => ['vietnam', 'japan', 'england', 'arsenal', 'psg', 'tottenham'].includes(p.categoryCode))
            .slice(0, 4)
            .map((item, index) => (
              <View key={item._id || `national-${index}`} style={styles.productWrapper1}>
                <ProductCard item={item} navigation={navigation} />
              </View>
            ))}
        </Section>

        {/* Danh mục */}
        <Section title="Danh mục">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryRow}>
              {categories.map((cat, index) => (
                <TouchableOpacity
                  key={cat.code || `cat-${index}`} // ✅ unique key
                  style={styles.categoryItem}
                  onPress={() =>
                    navigation.navigate('Category', {
                      code: cat.code,
                      title: cat.name
                    })
                  }
                >
                  <Image source={{ uri: cat.image }} style={styles.categoryImage} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Section>
      </ScrollView>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: 'orange', padding: 10, alignItems: 'center' },
  text: { fontSize: 23, fontWeight: 'bold' },
  topBar: { flexDirection: 'row', margin: 10, alignItems: 'center' },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 19,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 40,
    borderColor: '#ccc'
  },
  input: { flex: 1, fontSize: 14 },
  iconButton: { marginLeft: 10, padding: 6 },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: 'red',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold' },
  bannerWrapper: { height: width * 0.6, marginTop: 10 },
  bannerImage: {
    width: width * 0.9,
    height: width * 0.5,
    resizeMode: 'cover',
    borderRadius: 10,
    marginHorizontal: width * 0.05
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4
  },
  activeDot: { backgroundColor: '#000' },
  section: { marginVertical: 10 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 30,
    marginBottom: 5
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productWrapper: {
    width: 180,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    marginRight: 15,
    marginLeft: 10
  },
  productWrapper1: {
    width: (width - 20) / 2,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 5,
    margin: 20
  },
  seeMore: { color: 'orange', marginLeft: 15, marginTop: 5 },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  gridItem: {
    alignItems: 'center',
    margin: 20
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10
  },
  categoryItem: {
    backgroundColor: '#eee',
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    margin: 10
  },
  categoryImage: {
    width: '100%',
    height: '100%'
  },
});
