import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
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
  Pressable
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';
import { Animated } from 'react-native';
import ProductCard from './productCard/ProductCard';


const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {

  const scrollRef = useRef<ScrollView>(null);
  const [banners, setBanners] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  // banner chuyển động
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

  // call api danh muc
  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/categories');
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    })();
  }, []);

  // load sp
  useEffect(() => {
    loadBanners();
    loadProducts();
    const unsubscribe = navigation.addListener('focus', () => {
      loadCartCount();
    });
    loadCartCount();
    return unsubscribe;
  }, []);

  // call banner
  const loadBanners = async () => {
    try {
      const res = await API.get('/banners');
      // console.log('lấy dl t cong', res.data)
      setBanners(res.data)
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu banner', error);
    }
  }

  const handleBannerPress = (banner: any) => {
    navigation.navigate('BannerDT', { banner });
  };



  // call api sp
  const loadProducts = async () => {
    try {
      const res = await API.get('/products');
      setProducts(res.data);
    } catch (error) {
      console.error('❌ Lỗi khi lấy sản phẩm:', error);
    }
  };

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
        setCartCount(0); // giỏ hàng chưa tồn tại
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


  const Section = ({ title, children }: any) => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.wrapRow}>{children}</View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <TouchableOpacity style={styles.header}>
        <Text style={styles.text}>F7 Shop</Text>
      </TouchableOpacity>

      {/* Top Search + Icons */}
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color="#999" style={{ marginHorizontal: 10 }} />
          <TextInput placeholder="Tìm kiếm ở đây" placeholderTextColor="#999" style={styles.input} />
        </View>

        {/* Giỏ hàng */}
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

        {/* Chat */}
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Chat')}>
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#000" />
        </TouchableOpacity>
        {/* Thông báo*/}
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Notification')}>
          <Ionicons name="notifications-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Body scroll */}
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
          {banners.map(b => (
            <TouchableOpacity
              key={b.id}
              activeOpacity={0.8}
              onPress={() => handleBannerPress(b)}
            >
              <Image source={{ uri: b.banner }} style={styles.bannerImage} />
            </TouchableOpacity>
          ))}


        </ScrollView>
        <View style={styles.dotsContainer}>
          {banners.map((b, i) => (
            <View key={b.id || i} style={[styles.dot, i === activeIndex && styles.activeDot]} />
          ))}
        </View>

        {/* Sản phẩm các loại */}
        <Section title="Khuyến mãi">
          {products.slice(0, 4).map((item, index) => (
            <View key={`${item._id}-${index}`} style={styles.productWrapper}>
              <ProductCard item={item} navigation={navigation} />
            </View>
          ))
          }

          <View style={{ paddingHorizontal: 10, alignItems: 'flex-end' }} >
            <TouchableOpacity onPress={() => navigation.navigate('Promotion', { title: 'Khuyến mãi', type: 'promotion' })}>
              <Text style={styles.seeMore}>Xem thêm...</Text>
            </TouchableOpacity>
          </View>

        </Section>

        <Section title="Áo Câu Lạc Bộ">
          {products
            .filter(p => p.name.includes('Áo Đấu'))
            .slice(0, 4)
            .map((item, index) => (
              <View key={`${item._id}-${index}`} style={styles.productWrapper}>
                <ProductCard item={item} navigation={navigation} />
              </View>
            ))
          }
          <TouchableOpacity onPress={() => navigation.navigate('Promotion', { title: 'Áo Câu Lạc Bộ', type: 'club' })}>
            <Text style={styles.seeMore}>Xem thêm...</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Áo đội tuyển quốc gia">
          {products
            .filter(p => p.name.includes('Manchester'))
            .slice(0, 4)
            .map((item, index) => (
              <View key={`${item._id}-${index}`} style={styles.productWrapper}>
                <ProductCard item={item} navigation={navigation} />
              </View>
            ))
          }
          <TouchableOpacity onPress={() => navigation.navigate('Promotion', { title: 'Áo Đội Tuyển Quốc Gia', type: 'national' })}>
            <Text style={styles.seeMore}>Xem thêm...</Text>
          </TouchableOpacity>
        </Section>


        <Section title="Danh mục">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryRow}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat._id || cat.id}
                  style={styles.categoryItem}
                  onPress={() => navigation.navigate('Category', {
                    categoryId: cat.id,
                    code: cat.code,
                    title: cat.name,
                  })}
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
  bannerWrapper: { width: width, height: width * 0.6, marginTop: 10 },
  bannerImage: {
    width: width * 0.9,
    height: width * 0.57,
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
  activeDot: {
    backgroundColor: '#000'
  },
  section: {
    marginVertical: 10
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 5
  },
  wrapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  productItem: {
    width: (width - 40) / 2,
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
    borderRadius: 10
  },
  productName: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 5
  },
  productPrice: {
    color: 'red'
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10
  },
  categoryItem: {
    backgroundColor: '#eee',
    borderRadius: 50,
    width: 70,
    height: 70,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden', // bo ảnh trong
    margin: 10
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  seeMore: {
    color: 'orange',
    marginLeft: 15,
    marginTop: 5,
    // alignSelf: 'flex-end'
  },
  productItemHover: {
    transform: [{ scale: 1.03 }],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  productWrapper: {
    width: (width - 40) / 2,
    marginBottom: 15,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,

  }

});