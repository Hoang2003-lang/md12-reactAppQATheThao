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





import LoginScreen from './src/login/LoginScreen';
import RegisterScreen from './src/login/RegisterScreen';
import ForgotPassword from './src/login/ForgotPassword';

import TabNavigator from './src/TabNavigatior/TabNavigator';



const Stack = createNativeStackNavigator();

const App = () => {
  return (
     <NavigationContainer>
       <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        {/* thanh điều hướng, không xoá */}
        <Stack.Screen name="Home" component={TabNavigator} />

        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotP" component={ForgotPassword} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
        
        
      </Stack.Navigator>
      
    </NavigationContainer>
  );
};

export default App;
