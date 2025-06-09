import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoriteScreen from '../screens/FavoriteScreen';
import AccountScreen from '../screens/AccountScreen';
import { TouchableOpacity } from 'react-native';


const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 20,
          right: 20,
          borderRadius: 10,
          backgroundColor: '#fff',
          elevation: 5,
          height: 60,
          zIndex: 100,
        },
        
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = '';

          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'Search') iconName = 'search';
          else if (route.name === 'Favorite') iconName = 'heart';
          else if (route.name === 'Account') iconName = 'person';

          return <Icon name={iconName} size={24} color={focused ? '#66CC00' : '#333'} />;
        },
        tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '500',
        },
        tabBarActiveTintColor: '#66CC00',
        tabBarInactiveTintColor: '#333',
        tabBarShowLabel: true,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: 'Trang chủ'}} />
      <Tab.Screen name="Search" component={SearchScreen}  options={{ tabBarLabel: 'Tìm kiếm'}} />
      <Tab.Screen name="Favorite" component={FavoriteScreen}  options={{ tabBarLabel: 'Yêu thích'}} />
      <Tab.Screen name="Account" component={AccountScreen}  options={{ tabBarLabel: 'Tài khoản'}} />
    </Tab.Navigator>
  );
};

export default TabNavigator;