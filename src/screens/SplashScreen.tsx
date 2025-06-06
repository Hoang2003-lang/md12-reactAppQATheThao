// src/screens/SplashScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      navigation.replace('Login'); // chuyển đến Home sau 2.5s
    }, 2500);

    return () => clearTimeout(timeout); // xóa timeout khi unmount
  }, []);

  return (
    <View style={styles.container}>
  <Image
    source={{
      uri: 'https://rubicmarketing.com/wp-content/uploads/2022/07/y-nghia-logo-fpt-lan-3.jpg',
    }}
    style={styles.logo}
  />
  <Text style={styles.title}>Chào mừng đến với app bán quần áo thể thao!</Text>
</View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    borderRadius: 60,
  },
  title: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
  },
});
