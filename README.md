b1 : clone code về chạy npm i 
b2 : chạy npm start -- --reset-cache hoặc npm run start 
b3 : kiểm tra xem có lỗi không
b4 : kiểm tra cấu trúc của các file được tạo

//kiểm tra package.json đã cài dặt navigation chưa

--
npm install @react-navigation/native
npm install react-native-screens react-native-safe-area-context
npm install @react-navigation/native-stack
--

// 6/4/2025  mới chỉ code màn SplashScreen và HomeScreen_____ và App.tsx dùng để điều hướng  

// sửa lỗi
cd android
./gradlew clean
xong chạy lại

// 12/6: Lệnh font chữ
--
npm react-native-asset
--

Để áp dụng font sử dụng: 
- fontFamily: "Lora-Regular"
- fontFamily: "Lora-Bold"

*Vì sử dụng font ko dùng đc fontWeight nên sử dụng Bold/Regular để thay thế
