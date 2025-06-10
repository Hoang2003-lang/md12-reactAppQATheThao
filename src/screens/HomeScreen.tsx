// // src/screens/HomeScreen.tsx
// import React from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Dimensions, FlatList } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons'
// import { useState, useEffect } from 'react';


// import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
// import API from '../api';


// const { width } = Dimensions.get('window');



// const HomeScreen = ({ navigation }: any) => {

//   const [products, setProducts] = useState([]);
//   useEffect(() => {
//     getProducts();
//   }, []);

//   const banners = [
//     { id: '1', image: require('../assets/bannerc1.png') },
//     { id: '2', image: require('../assets/bannerc2.png') },
//     { id: '3', image: require('../assets/bannerc3.png') },
//   ];
//   const [activeIndex, setActiveIndex] = useState(0);

//   const categories = [
//     { id: 'psg', image: require('../assets/psg.png') },
//     { id: 'arsenal', image: require('../assets/arsenal.png') },
//     { id: 'chelsea', image: require('../assets/chelsea.png') },
//     { id: 'vietnam', image: require('../assets/vietnam.png') },
//     { id: 'japan', image: require('../assets/japan.png') },
//   ];

//   const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
//     const index = Math.round(event.nativeEvent.contentOffset.x / width);
//     setActiveIndex(index);
//   };

//   // Xem thêm
//   const handleKM = () => {
//     navigation.navigate('')
//   }

//   // get API sản phẩm :))
//   const getProducts = async () => {
//     try {
//       const response = await API.get('/products');
//       setProducts(response.data);
//     } catch (error) {
//       console.error('Lỗi khi lấy sản phẩm:', error);
//     }
//   };
//   // Item SP
//   // const renderItem = ({ item }: any) => {
//   //   return (
//   //     <View style={{ alignItems: 'center', margin: 10 }}>
//   //       <Image
//   //         source={{ uri: item.image }}
//   //         style={{ width: 150, height: 150, borderRadius: 10 }}
//   //       />
//   //       <Text style={{ marginTop: 5, fontSize: 10 }}>{item.name}</Text>
//   //       <Text style={{ color: 'gray' }}>{item.price} đ</Text>
//   //     </View>
//   //   );
//   // };


//   return (
//     <View style={styles.container}>
//       <TouchableOpacity style={styles.header} >
//         <Text style={styles.text}>F7 Shop</Text>
//       </TouchableOpacity>
//       <View style={styles.topBar}>
//         <View style={styles.searchBox}>
//           <Icon name="search" size={18} color="#999" style={{ marginHorizontal: 10 }} />
//           <TextInput
//             placeholder="Tìm kiếm ở đây"
//             placeholderTextColor="#999"
//             style={styles.input}
//           />
//         </View>

//         <TouchableOpacity style={styles.iconButton}>
//           <Icon name="cart-outline" size={24} color="#000" />
//         </TouchableOpacity>

//         <TouchableOpacity style={styles.iconButton}>
//           <Icon name="chatbubble-ellipses-outline" size={24} color="#000" />
//         </TouchableOpacity>
//       </View>

//       <ScrollView
//         style={{ flex: 1 }}
//         showsVerticalScrollIndicator={false}
//         contentContainerStyle={{ paddingBottom: 100 }}
//       >
//         <View style={styles.bannerWrapper}>
//           <ScrollView
//             horizontal
//             pagingEnabled
//             showsHorizontalScrollIndicator={false}
//             onScroll={handleScroll}
//             scrollEventThrottle={16}
//           >
//             {banners.map((banner) => (
//               <View key={banner.id} style={styles.bannerItem}>
//                 <Image source={banner.image} style={styles.bannerImage} />
//               </View>
//             ))}
//           </ScrollView>

//           <View style={styles.dotsContainer}>
//             {banners.map((_, index) => (
//               <View
//                 key={index}
//                 style={[
//                   styles.dot,
//                   { backgroundColor: index === activeIndex ? '#000' : '#ccc' },
//                 ]}
//               />
//             ))}
//           </View>
//         </View>

//         <Text style={styles.textKM}>Khuyến mãi</Text>

//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
//           {products.slice(0, 4).map((item: any) => (
//             <View key={item._id} style={{ alignItems: 'center', margin: 10 }}>
//               <Image
//                 source={{ uri: item.image }}
//                 style={{ width: 150, height: 150, borderRadius: 10 }}
//               />
//               <Text style={{ marginTop: 5, fontSize: 10 }}>{item.name}</Text>
//               <Text style={{ color: 'gray' }}>{item.price} đ</Text>
//             </View>
//           ))}

//           <Text style={{ color: 'orange' }} onPress={handleKM} >Xem thêm..</Text>
//         </View>


//         <Text style={styles.textKM}>Áo Câu Lạc Bộ</Text>

//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
//           {products
//             .filter((item: any) => item.name.includes('Áo Đấu')) // lọc sản phẩm theo danh mục
//             .slice(0, 4)
//             .map((item: any) => (
//               <View key={item._id} style={{ alignItems: 'center', margin: 10 }}>
//                 <Image
//                   source={{ uri: item.image }}
//                   style={{ width: 150, height: 150, borderRadius: 10 }}
//                 />
//                 <Text style={{ marginTop: 5, fontSize: 10 }}>{item.name}</Text>
//                 <Text style={{ color: 'gray' }}>{item.price} đ</Text>
//               </View>
//             ))}

//           <Text style={{ color: 'orange' }}>Xem thêm..</Text>
//         </View>

//         <Text style={styles.textKM}>Áo đội tuyển quốc gia</Text>

//         <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
//           {products
//             .filter((item: any) => item.name.includes('Áo Đấu')) // lọc sản phẩm theo danh mục
//             .slice(0, 4)
//             .map((item: any) => (
//               <View key={item._id} style={{ alignItems: 'center', margin: 10 }}>
//                 <Image
//                   source={{ uri: item.image }}
//                   style={{ width: 150, height: 150, borderRadius: 10 }}
//                 />
//                 <Text style={{ marginTop: 5, fontSize: 10 }}>{item.name}</Text>
//                 <Text style={{ color: 'gray' }}>{item.price} đ</Text>
//               </View>
//             ))}

//           <Text style={{ color: 'orange' }}>Xem thêm..</Text>
//         </View>

//         <Text style={styles.textKM}>Danh mục</Text>
//         <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 }}>
//           {categories.map((cat) => (
//             <TouchableOpacity
//               key={cat.id}
//               onPress={() => console.log('Clicked:', cat.id)} // xử lý sự kiện nhấn
//               style={{
//                 backgroundColor: '#eee',
//                 borderRadius: 50,
//                 width: 70,
//                 height: 70,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//               }}
//             >
//               <Image
//                 source={cat.image}
//                 style={{ width: 40, height: 40, resizeMode: 'contain' }}
//               />
//             </TouchableOpacity>
//           ))}
//         </View>


//       </ScrollView>
//     </View>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   text: {
//     fontSize: 23,
//     fontWeight: 'bold',
//     color: 'black'
//   },
//   header: {
//     backgroundColor: 'orange',
//     paddingVertical: 10,
//     paddingHorizontal: 100,
//     alignItems: 'center',
//   },
//   topBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginHorizontal: 10,
//     marginTop: 10,
//   },
//   searchBox: {
//     flex: 1,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderRadius: 19,
//     borderColor: 'black',
//     borderWidth: 1,
//     paddingHorizontal: 10,
//     height: 40,
//     backgroundColor: '#fff',
//   },
//   input: {
//     flex: 1,
//     fontSize: 14,
//     color: '#000',
//     paddingVertical: 0,
//   },
//   iconButton: {
//     marginLeft: 10,
//     padding: 6,
//   },

//   bannerWrapper: {
//     alignItems: 'center',
//     marginTop: 20,
//   },
//   bannerItem: {
//     width: width * 0.9,
//     height: width * 0.8, // vuông
//     borderRadius: 10,
//     borderWidth: 2,
//     overflow: 'hidden',
//     marginHorizontal: width * 0.1 / 2,
//   },
//   bannerImage: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'cover',
//   },
//   dotsContainer: {
//     flexDirection: 'row',
//     justifyContent: 'center',
//     marginTop: 10,
//   },
//   dot: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginHorizontal: 4,
//   },
//   bottomNav: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     backgroundColor: '#FFFFFF',
//     paddingVertical: 10,
//     borderRadius: 10,
//     position: 'absolute',
//     bottom: 10,
//     left: 20,
//     right: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   textKM: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     margin: 10
//   }
// });


import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import API from '../api';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const [banners] = useState([
    { id: '1', image: require('../assets/bannerc1.png') },
    { id: '2', image: require('../assets/bannerc2.png') },
    { id: '3', image: require('../assets/bannerc3.png') },
  ]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [categories] = useState([
    { id: 'psg', image: require('../assets/psg.png') },
    { id: 'arsenal', image: require('../assets/arsenal.png') },
    { id: 'chelsea', image: require('../assets/chelsea.png') },
    { id: 'vietnam', image: require('../assets/vietnam.png') },
    { id: 'japan', image: require('../assets/japan.png') },
  ]);

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
          <TouchableOpacity onPress={() => navigation.navigate('Promotion')}>
            <Text style={styles.seeMore}>Xem thêm...</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Áo Câu Lạc Bộ">
          {products.filter(p => p.name.includes('Áo Đấu')).slice(0, 4).map(renderProduct)}
          <TouchableOpacity onPress={() => navigation.navigate('ClubShirts')}>
            <Text style={styles.seeMore}>Xem thêm...</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Áo đội tuyển quốc gia">
          {products.filter(p => p.name.includes('Đội tuyển')).slice(0, 4).map(renderProduct)}
          <TouchableOpacity onPress={() => navigation.navigate('NationalTeam')}>
            <Text style={styles.seeMore}>Xem thêm...</Text>
          </TouchableOpacity>
        </Section>

        <Section title="Danh mục">
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
          <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.seeMore}>Xem thêm...</Text>
          </TouchableOpacity>
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { backgroundColor: 'orange', padding: 10, alignItems: 'center' },
  text: { fontSize: 23, fontWeight: 'bold' },
  topBar: { flexDirection: 'row', margin: 10, alignItems: 'center' },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', borderRadius: 19, borderWidth: 1, paddingHorizontal: 10, height: 40 },
  input: { flex: 1, fontSize: 14 },
  iconButton: { marginLeft: 10, padding: 6 },
  bannerWrapper: { height: width * 0.6, marginTop: 10 },
  bannerImage: { width, height: width * 0.6, resizeMode: 'cover', borderRadius: 10, marginHorizontal: width * 0.05 },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#000' },
  section: { marginVertical: 10 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginLeft: 10, marginBottom: 5 },
  wrapRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' },
  productItem: { alignItems: 'center', margin: 10 },
  productImage: { width: 150, height: 150, borderRadius: 10 },
  productName: { fontSize: 12, textAlign: 'center', marginTop: 5 },
  productPrice: { color: 'gray' },
  categoryRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10 },
  categoryItem: { backgroundColor: '#eee', borderRadius: 50, width: 70, height: 70, alignItems: 'center', justifyContent: 'center', margin: 10 },
  categoryImage: { width: 40, height: 40 },
  seeMore: { color: 'orange', marginLeft: 15, marginTop: 5 }
});

