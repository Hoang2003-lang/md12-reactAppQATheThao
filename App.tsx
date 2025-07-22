// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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


import PayScreen from './src/screens/pay/PayScreen';
import CodPayScreen from './src/screens/pay/CodPayScreen';
import ShopPayScreen from './src/screens/pay/ShopPayScreen';
import CreditCardPayScreen from './src/screens/pay/CreditCardPayScreen';

import LoginScreen from './src/login/LoginScreen';
import RegisterScreen from './src/login/RegisterScreen';
import ForgotPassword from './src/login/ForgotPassword';



import TabNavigator from './src/TabNavigator/TabNavigator';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import NotificationScreen from './src/screens/NotificationScreen';




const Stack = createNativeStackNavigator();

const App = () => {


  return (

    <ActionSheetProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
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

          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="Pay" component={PayScreen} />
          <Stack.Screen name="CodPay" component={CodPayScreen} />
          <Stack.Screen name="ShopPay" component={ShopPayScreen} />
          <Stack.Screen name="CreditCardPay" component={CreditCardPayScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Category" component={Logomore} />
          <Stack.Screen name="Notification" component={NotificationScreen} />
          <Stack.Screen name="OrderTracking" component={OrderTrackingScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} options={{ title: 'Thông tin cá nhân' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </ActionSheetProvider>
  );
};

export default App;
