import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import AccountScreen from '../screens/AccountScreen';
import { Image, TouchableOpacity } from 'react-native';
import CartScreen from '../screens/CartScreen'

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          borderTopLeftRadius: 30,
          borderTopRightRadius:30,
          backgroundColor: '#fff',
          elevation: 15,
          height: 55,
          zIndex: 100,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowRadius: 40,
          
        },
        
        tabBarIcon: ({ focused, color, size }) => {
          let iconSource;

          if (route.name === 'HomeTab'){
            iconSource= focused ? require("../assets/images/check_home.png") : require("../assets/images/uncheck_home.png");
          }else if (route.name === 'Search'){
            iconSource= focused ? require("../assets/images/check_search.png") : require("../assets/images/uncheck_search.png");
          }else if (route.name === 'Favorite'){
            iconSource= focused ? require("../assets/images/check_heart.png") : require("../assets/images/uncheck_heart.png");
          }
          else if (route.name === 'Account'){
            iconSource= focused ? require("../assets/images/check_user.png") : require("../assets/images/uncheck_user.png");
          }
          // else if (route.name === 'Cart') iconName = 'cart'

          return <Image source={iconSource} style={{ width: 25, height: 25}} />;
        },
        tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
        },
        tabBarActiveTintColor: '#EC761E',
        tabBarInactiveTintColor: '#9299A3',
        tabBarShowLabel: true,
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeScreen} options={{ tabBarLabel: 'Trang chủ'}} />
      <Tab.Screen name="Search" component={SearchScreen}  options={{ tabBarLabel: 'Tìm kiếm'}} />
      <Tab.Screen name="Favorite" component={FavoriteScreen}  options={{ tabBarLabel: 'Yêu thích'}} />
      <Tab.Screen name="Account" component={AccountScreen}  options={{ tabBarLabel: 'Hồ sơ'}} />
      {/* <Tab.Screen name="Cart" component={CartScreen}  options={{ tabBarLabel: 'Giỏ Hàng'}} /> */}

    </Tab.Navigator>
  );
};

export default TabNavigator;