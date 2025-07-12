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
import SaleProductCard from './productCard/SaleProductCard';
import { fetchAllProducts } from '../services/ProductServices';
import { fetchSaleProducts } from '../services/SaleProducts';
import { fetchBanners } from '../services/BannerServices';
import { fetchCategories } from '../services/CategoryServices';



const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {

  const scrollRef = useRef<ScrollView>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const banners = [
    { id: '1', image: require('../assets/images/bannerDATN.jpg') },
    { id: '2', image: require('../assets/images/bannerDATN3.jpg') },
    { id: '3', image: require('../assets/images/bannerDATN2.jpg') },
    { id: '4', image: require('../assets/images/bannerDATN1.jpg') },
  ];

  const categories = [
    { id: 'psg', image: require('../assets/images/psg.png') },
    { id: 'arsenal', image: require('../assets/images/arsenal.png') },
    { id: 'chelsea', image: require('../assets/images/chelsea.png') },
    { id: 'vietnam', image: require('../assets/images/vietnam.png') },
    { id: 'japan', image: require('../assets/images/japan.png') },
  ];

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
  }, []);

  // load sp
  useEffect(() => {
    loadProducts();
    const unsubscribe = navigation.addListener('focus', () => {
      loadCartCount();
    });
    loadCartCount();
    return unsubscribe;
  }, []);

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
            <Image key={b.id} source={b.image} style={styles.bannerImage} />
          ))}


        </ScrollView>
        <View style={styles.dotsContainer}>
          {banners.map((b, i) => (
            <View key={b.id || i} style={[styles.dot, i === activeIndex && styles.activeDot]} />
          ))}
        </View>

        {/* Sản phẩm các loại */}
        <Section title="Khuyến mãi">
          {products.slice(0, 4).map(item => (
            <View key={item._id} style={styles.productWrapper} >

              <ProductCard key={item._id} item={item} navigation={navigation} />
            </View>
          ))}

          <View style={{ paddingHorizontal: 10, alignItems: 'flex-end' }} >
            <TouchableOpacity onPress={() => navigation.navigate('Promotion', { title: 'Khuyến mãi', type: 'promotion' })}>
              <Text style={styles.seeMore}>Xem thêm...</Text>
            </TouchableOpacity>
          </View>

        </Section>


        <Section
          title="Áo Câu Lạc Bộ"
          onSeeMore={() =>
            navigation.navigate('Promotion', { title: 'Áo Câu Lạc Bộ', type: 'club' })
          }
        >
          {products.filter(p => p.name.includes('Áo Đấu')).slice(0, 4).map(item => (
            <View key={item._id} style={styles.productWrapper}>
              <ProductCard item={item} navigation={navigation} />
            </View>
          ))}
        </Section>


        <Section
          title="Áo đội tuyển quốc gia"
          onSeeMore={() =>
            navigation.navigate('Promotion', { title: 'Áo Đội Tuyển Quốc Gia', type: 'national' })
          }
        >
          {products
            .filter(p => ['vietnam', 'japan', 'england', 'arsenal', 'psg', 'tottenham'].includes(p.categoryCode))
            .slice(0, 4)
            .map(item => (
              <View key={item._id} style={styles.productWrapper}>
                <ProductCard item={item} navigation={navigation} />
              </View>
            ))}
        </Section>




        <Section title="Danh mục">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.categoryRow}>
              {categories.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.categoryItem}
                  onPress={() => navigation.navigate('Category', { categoryId: cat.id })}
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
    margin: 10
  },
  categoryImage: { width: 40, height: 40 },
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

  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginBottom: 5,
    margin: 20
  },


});