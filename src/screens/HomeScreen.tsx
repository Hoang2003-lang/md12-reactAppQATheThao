
import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import API from '../api';

const { width } = Dimensions.get('window');



const HomeScreen = ({ navigation }: any) => {
  const scrollRef = useRef<ScrollView>(null);

  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [banners] = useState([
    { id: '1', image: require('../assets/bannerc1.png') },
    { id: '2', image: require('../assets/bannerc2.png') },
    { id: '3', image: require('../assets/bannerc3.png') },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  // const [categories] = useState([
  //   { id: 'psg', image: require('../assets/psg.png') },
  //   { id: 'arsenal', image: require('../assets/arsenal.png') },
  //   { id: 'chelsea', image: require('../assets/chelsea.png') },
  //   { id: 'vietnam', image: require('../assets/vietnam.png') },
  //   { id: 'japan', image: require('../assets/japan.png') },
  // ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prev => {
        const nextIndex = (prev + 1) % banners.length;
        scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);


  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/products');
        setProducts(res.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    })();
  }, []);

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

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIndex(idx);
  };

  const renderProduct = (item: any) => (
    <TouchableOpacity
      key={item._id}
      style={styles.productItem}
      onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price.toLocaleString()} đ</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header}>
        <Text style={styles.text}>F7 Shop</Text>
      </TouchableOpacity>
      <View style={styles.topBar}>
        <View style={styles.searchBox}>
          <Icon name="search" size={18} color="#999" style={{ marginHorizontal: 10 }} />
          <TextInput
            placeholder="Tìm kiếm ở đây"
            placeholderTextColor="#999"
            style={styles.input}
          />
        </View>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Cart')}>
          <Icon name="cart-outline" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Chat')}>
          <Icon name="chatbubble-ellipses-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Banner */}
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
          {banners.map((_, i) => (
            <View key={i} style={[styles.dot, i === activeIndex && styles.activeDot]} />
          ))}
        </View>

        {/* Sections */}
        <Section title="Khuyến mãi">
          {products.slice(0, 4).map(renderProduct)}
          <TouchableOpacity onPress={() => navigation.navigate('Promotion', { title: 'Khuyến mãi', type: 'promotion' })}>
            <Text style={styles.seeMore}>Xem thêm...</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Áo Câu Lạc Bộ">
          {products.filter(p => p.name.includes('Áo Đấu')).slice(0, 4).map(renderProduct)}
          <TouchableOpacity onPress={() => navigation.navigate('Promotion', { title: 'Áo Câu Lạc Bộ', type: 'club' })}>
            <Text style={styles.seeMore}>Xem thêm...</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Áo đội tuyển quốc gia">
          {products.filter(p => p.name.includes('Manchester')).slice(0, 4).map(renderProduct)}
          <TouchableOpacity onPress={() => navigation.navigate('Promotion', { title: 'Áo Đội Tuyển Quốc Gia', type: 'national' })}>
            <Text style={styles.seeMore}>Xem thêm...</Text>
          </TouchableOpacity>
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
                  <Image source={cat.image} style={styles.categoryImage} />
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

        </Section>

      </ScrollView>
    </View>
  );
};

const Section = ({ title, children }: any) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <View style={styles.wrapRow}>{children}</View>
  </View>
);

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center'
  },
  text: {
    fontSize: 23,
    fontWeight: 'bold',
    color: '#fff'
  },
  topBar: {
    flexDirection: 'row'
    , margin: 10,
    alignItems: 'center'
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 19,
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 40
  },
  input: {
    flex: 1,
    fontSize: 14
  },
  iconButton: {
    marginLeft: 10,
    padding: 6
  },
  bannerWrapper: {
    height: width * 0.6,
    marginTop: 10
  },
  bannerImage: {
    width, height: width * 0.6,
    resizeMode: 'cover',
    borderRadius: 10,
    // marginHorizontal: width * 0.01
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
    justifyContent: 'space-evenly'
  },
  productItem: {
    width: '45%', // hoặc Dimensions.get('window').width / 2 - margin
    alignItems: 'center',
    marginVertical: 10,
  },

  productImage:
  {
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
    margin: 10
  },
  categoryImage: {
    width: 40,
    height: 40
  },
  seeMore: {
    color: 'orange',
    marginLeft: 15,
    marginTop: 5
  }
});