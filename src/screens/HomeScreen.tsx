// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { useState } from 'react';



const { width } = Dimensions.get('window');



const HomeScreen = ({ navigation }: any) => {

  const [selected, setSelected] = useState('home');

  const handlePress = (iconName: 'home' | 'search' | 'heart' | 'user') => {
    setSelected(iconName);
    if (iconName === 'home') {
      navigation.navigate('Home');
    } else if (iconName === 'search') {
      navigation.navigate('Search');
    } else if (iconName === 'heart') {
      navigation.navigate('Favorite');
    } else if (iconName === 'user') {
      navigation.navigate('Account');
    }
  };

  const banners = [
    { id: '1', image: require('../assets/bannerc1.png') },
    { id: '2', image: require('../assets/bannerc2.png') },
    { id: '3', image: require('../assets/bannerc3.png') },
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} >
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

        <TouchableOpacity style={styles.iconButton}>
          <Icon name="cart-outline" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Icon name="chatbubble-ellipses-outline" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.bannerWrapper}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {banners.map((banner) => (
            <View key={banner.id} style={styles.bannerItem}>
              <Image source={banner.image} style={styles.bannerImage} />
            </View>
          ))}
        </ScrollView>

        <View style={styles.dotsContainer}>
          {banners.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                { backgroundColor: index === activeIndex ? '#000' : '#ccc' },
              ]}
            />
          ))}
        </View>
      </View>


      {/* Bottom Nav */}
      <View style={styles.bottomNav}>
        <Icon
          name="home"
          size={24}
          color={selected === 'home' ? '#66CC00' : '#333333'}
          onPress={() => handlePress('home')}
        />
        <Icon
          name="search"
          size={24}
          color={selected === 'search' ? '#66CC00' : '#333333'}
          onPress={() => handlePress('search')}
        />
        <Icon
          name="heart"
          size={24}
          color={selected === 'heart' ? '#66CC00' : '#333333'}
          onPress={() => handlePress('heart')}
        />
        <Icon
          name="user"
          size={24}
          color={selected === 'user' ? '#66CC00' : '#333333'}
          onPress={() => handlePress('user')}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 23,
    fontWeight: 'bold',
    color: 'black'
  },
  header: {
    backgroundColor: 'orange',
    paddingVertical: 10,
    paddingHorizontal: 100,
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    marginTop: 10,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 19,
    borderColor: 'black',
    borderWidth: 1,
    paddingHorizontal: 10,
    height: 40,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingVertical: 0,
  },
  iconButton: {
    marginLeft: 10,
    padding: 6,
  },

  bannerWrapper: {
    alignItems: 'center',
    marginTop: 20,
  },
  bannerItem: {
    width: width * 0.9,
    height: width * 0.8, // vuông
    borderRadius: 10,
    borderWidth: 2,
    overflow: 'hidden',
    marginHorizontal: width * 0.1 / 2,
  },
  bannerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    borderRadius: 10,
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
});



