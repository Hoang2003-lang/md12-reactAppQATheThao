// App.tsx
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Linking, AppState } from 'react-native';
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
import BannerDT from './src/screens/banner/BannerDetail';
import SaleMore from './src/screens/semore/SaleMoreScreen';
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

const Stack = createNativeStackNavigator();

const App = () => {
  const navigationRef = useRef<any>(null);

  useEffect(() => {
    // Hàm xử lý deep link (đồng bộ với BE redirect)
    const handleDeepLink = (url: string) => {
      console.log(" Deep link received:", url);

      // Kiểm tra tất cả các loại deep link có thể có
      if (url.includes('payment-result') || url.includes('f7shop://')) {
        try {
          console.log("Processing payment result deep link...");
          
          // Cải thiện parse URL để xử lý tốt hơn
          let searchParams = {};
          
          // Parse URL thủ công vì URLSearchParams không hoạt động với custom scheme
          const queryString = url.split('?')[1] || '';
          if (queryString) {
            searchParams = queryString.split('&').reduce((params, param) => {
              const [key, value] = param.split('=');
              if (key && value) {
                params[decodeURIComponent(key)] = decodeURIComponent(value);
              }
              return params;
            }, {});
            console.log(" Parsed manually:", searchParams);
          } else {
            console.log(" No query string found in URL");
          }

          // Kiểm tra xem có params hợp lệ không
          if (Object.keys(searchParams).length > 0) {
            console.log(" Valid params found:", searchParams);
            
            // Lưu params vào global để CheckVnPayMent có thể truy cập
            global.paymentResultParams = searchParams;

            // Thêm delay nhỏ để đảm bảo navigation sẵn sàng
            setTimeout(() => {
              if (navigationRef.current) {
                console.log(" Navigating to CheckVnPayMent...");
                navigationRef.current.navigate('CheckVnPayMent', {
                  searchParams: searchParams,
                });
              } else {
                console.log(" Navigation ref not available");
              }
            }, 100);
          } else {
            console.log("No valid params found in deep link");
            
            // Nếu không có params, vẫn navigate để hiển thị màn hình lỗi
            setTimeout(() => {
              if (navigationRef.current) {
                console.log(" Navigating to CheckVnPayMent without params...");
                navigationRef.current.navigate('CheckVnPayMent', {
                  searchParams: {},
                });
              }
            }, 100);
          }
        } catch (error) {
          console.error(" Error parsing deep link:", error);
          
          // Nếu có lỗi parse, vẫn navigate để hiển thị màn hình lỗi
          setTimeout(() => {
            if (navigationRef.current) {
              console.log("Navigating to CheckVnPayMent after error...");
              navigationRef.current.navigate('CheckVnPayMent', {
                searchParams: {},
              });
            }
          }, 100);
        }
      } else {
        console.log(" Deep link không phải payment-result:", url);
      }
    };

    // Xử lý khi app mở từ deep link lúc khởi động
    const handleInitialURL = async () => {
      try {
        const initialURL = await Linking.getInitialURL();
        if (initialURL) {
          console.log(" Initial URL:", initialURL);
          handleDeepLink(initialURL);
        }
      } catch (error) {
        console.error(" Error getting initial URL:", error);
      }
    };

    // Lắng nghe deep link khi app đang chạy
    const subscription = Linking.addEventListener('url', (event) => {
      console.log(" URL event:", event.url);
      console.log(" App state:", event.url);
      handleDeepLink(event.url);
    });

    // Thêm listener để kiểm tra app state
    const handleAppStateChange = (nextAppState: string) => {
      console.log("App state changed to:", nextAppState);
    };

    // Thêm listener cho app state changes
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    // Xử lý khi app mở lần đầu
    handleInitialURL();

    return () => {
      subscription?.remove();
      appStateSubscription?.remove();
    };
  }, []);

  return (
    <ActionSheetProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
          {/* Tab chính */}
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Home" component={TabNavigator} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="ForgotP" component={ForgotPassword} />

          {/* Sản phẩm */}
          <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
          <Stack.Screen name="Promotion" component={SeemoreScreen} />
          <Stack.Screen name="BannerDT" component={BannerDT} />
          <Stack.Screen name="SaleMore" component={SaleMore} />
          <Stack.Screen name="SaleProductDetail" component={SaleProductDetail} />

          {/* Giỏ hàng & thanh toán */}
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Checkout" component={CheckoutScreen} />
          <Stack.Screen name="CheckoutVNPay" component={CheckoutVNPay} />
          <Stack.Screen name="CheckVnPayMent" component={CheckVnPayMent} />

          {/* Khác */}
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
