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

// 14/6: Lệnh install thư viện
--
npm install @react-native-async-storage/async-storage
npm install react-native-snackbar
npm i react-native-image-
npm i react-native-actions-sheet
npm install --save @react-native-firebase/app
npm install @react-native-firebase/auth
npm i @react-native-google-signin/google-signin
npm install @react-native-firebase/auth@latest
--

// 4/7: Tài khoản
<<<<<<< HEAD
picker
=======

// xử lý khi bị xung đột git
Bước 1: Lưu code của bạn lại (commit nếu cần)
git add .
git commit -m "Commit code của tôi trước khi pull"

Bước 2: Kéo code mới nhất từ Git về (merge hoặc rebase)
git pull origin main

Nếu có conflict (xung đột), Git sẽ báo, và bạn phải mở file đó, chỉnh tay rồi:
git add <file bị conflict>
git commit -m "Resolve conflict"
git push origin main

 Ví dụ xử lý xung đột:
Xung đột:
<<<<<<< HEAD
<Text>Hello from my version</Text>
=======
<Text>Hello from their version</Text>
>>>>>>> abc1234
Bạn muốn giữ cả 2:
<Text>Hello from my version</Text>
<Text>Hello from their version</Text>

Hoặc chọn một bên:
<Text>Hello from my version</Text>
>>>>>>> 4e9fdeff11810d85c68d78a279983019e14e3b7d
