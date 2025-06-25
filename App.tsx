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
import ChatScreen from './src/screens/chat/ChatScreen';
import PersonalInfoScreen from './src/screens/PersonalInfoScreen';
import Category from './src/screens/category/CategoryScreen'

import LoginScreen from './src/login/LoginScreen';
import RegisterScreen from './src/login/RegisterScreen';
import ForgotPassword from './src/login/ForgotPassword';

import TabNavigator from './src/TabNavigator/TabNavigator';



const Stack = createNativeStackNavigator();

const App = () => {


  return (
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
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Category" component={Category} />

        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} options={{ title: 'Thông tin cá nhân' }} />


      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;
