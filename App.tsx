// App.tsx
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking } from 'react-native';
import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import SearchScreen from './src/screens/SearchScreen';
import FavoriteScreen from './src/screens/FavoriteScreen';
import AccountScreen from './src/screens/AccountScreen';
import ProductDetailScreen from './src/screens/ProductDetailScreen';
import SeemoreScreen from './src/screens/semore/SeemoreScreen';
import CartScreen from './src/screens/CartScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import ChatScreen from './src/screens/chat/ChatScreen';
import Logomore from './src/screens/semore/LogoMoreScreen';
import PersonalInfoScreen from './src/screens/PersonalInfoScreen';
import BannerDT from './src/screens/banner/BannerDetail'
import SaleMore from './src/screens/semore/SaleMoreScreen'
import OrderTrackingScreen from './src/screens/OrderTrackingScreen';
import SaleProductDetail from './src/screens/SaleProductDetail';
import CheckoutVNPay from './src/screens/payment/CheckoutVNPay';
import CheckVnPayMent from './src/screens/payment/CheckVnPayMent';
import LoginScreen from './src/login/LoginScreen';
import RegisterScreen from './src/login/RegisterScreen';
import ForgotPassword from './src/login/ForgotPassword';

import TabNavigator from './src/TabNavigator/TabNavigator';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import NotificationScreen from './src/screens/NotificationScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

const App = () => {
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    // Xóa dữ liệu đăng nhập khi khởi động app
    const clearLoginData = async () => {
      try {
        await AsyncStorage.removeItem('userId');
        await AsyncStorage.removeItem('token');
        console.log('🗑 Đã xóa userId & token khi khởi động');
      } catch (err) {
        console.error('❌ Lỗi khi xóa dữ liệu đăng nhập:', err);
      }
    };
    clearLoginData();
  }, []);

  useEffect(() => {
    // ✅ Xử lý deep link khi app đang chạy
    const handleDeepLink = (url: string) => {
      console.log("🔗 Deep link received:", url);
      
      if (url.includes('payment-result')) {
        try {
          // ✅ Parse URL parameters
          const urlParts = url.split('?');
          if (urlParts.length > 1) {
            const params = new URLSearchParams(urlParts[1]);
            const searchParams = Object.fromEntries(params);
            
            console.log("📦 Parsed payment params:", searchParams);
            
            // ✅ Navigate to CheckVnPayMent with params
            if (navigationRef.current) {
              navigationRef.current.navigate('CheckVnPayMent', { 
                searchParams: searchParams 
              });
            }
          }
        } catch (error) {
          console.error("❌ Error parsing deep link:", error);
        }
      }
    };

    // ✅ Xử lý deep link khi app khởi động
    const handleInitialURL = async () => {
      try {
        const initialURL = await Linking.getInitialURL();
        if (initialURL) {
          console.log("🚀 Initial URL:", initialURL);
          handleDeepLink(initialURL);
        }
      } catch (error) {
        console.error("❌ Error getting initial URL:", error);
      }
    };

    // ✅ Listen for deep links when app is running
    const subscription = Linking.addEventListener('url', (event) => {
      console.log("🔗 URL event:", event.url);
      handleDeepLink(event.url);
    });

    // ✅ Handle initial URL
    handleInitialURL();

    return () => {
      subscription?.remove();
    };
  }, []);

  return (
    <ActionSheetProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="CheckVnPayMent" screenOptions={{ headerShown: false }}>
          {/* thanh điều hướng, không xoá */}
          <Stack.Screen name="Home" component={TabNavigator} />
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotP" component={ForgotPassword} />
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Promotion" component={SeemoreScreen} />
          <Stack.Screen name="BannerDT" component={BannerDT} />
          <Stack.Screen name="SaleMore" component={SaleMore} />
          <Stack.Screen name="SaleProductDetail" component={SaleProductDetail} />

          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="CheckoutVNPay" component={CheckoutVNPay} />
          <Stack.Screen name="CheckVnPayMent" component={CheckVnPayMent} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Category" component={Logomore} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
          <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
          <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
};

export default App;
