// // import React from 'react';
// // import {
// //     View,
// //     Text,
// //     TextInput,
// //     TouchableOpacity,
// //     Image,
// //     StyleSheet,
// //     Switch,
// //     Pressable,
// //     Alert
// // } from 'react-native';
// // import { useState } from 'react';
// // import API from '../api';


// // export default function LoginScreen({ navigation }: any) {
// //     const [rememberMe, setRememberMe] = React.useState(false);
// //     const [passwordVisible, setPasswordVisible] = React.useState(false);

// //     const [agreeTerms, setAgreeTerms] = useState(false);

// //     const [email, setEmail] = useState('');
// //     const [password, setPassword] = useState('');


// //     const handleDK = () => {
// //         navigation.navigate('Register');
// //     }

// //     const handleForgot = () => {
// //         navigation.navigate('ForgotP')
// //     }

// //     const handleLogin = async () => {
// //         if (!email || !password) {
// //             Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
// //             return;
// //         }

// //         try {
// //             const res = await API.post('/login', {
// //                 email,
// //                 password,
// //             });

// //             const { token, user } = res.data;
// //             console.log('Đăng nhập thành công:', user);

// //             Alert.alert('Thành công', 'Đăng nhập thành công');

// //             // TODO: Lưu token vào AsyncStorage nếu cần
// //             navigation.navigate('Home'); // hoặc màn hình chính của bạn
// //         } catch (err: any) {
// //             const message = err.response?.data?.message || 'Đăng nhập thất bại';
// //             Alert.alert('Lỗi', message);
// //         }
// //     };

// //     // return (
// //     //     <View style={styles.container}>
// //     //         <Image
// //     //             source={require('../assets/banner1.png')}
// //     //             style={styles.image}
// //     //             resizeMode="cover"
// //     //         />

// //     //         <View style={styles.formContainer}>
// //     //             <Text style={styles.title}>Đăng nhập</Text>

// //     //             <View style={styles.inputContainer}>

// //     //                 <TextInput
// //     //                     style={styles.input}
// //     //                     placeholder="Tên tài khoản hoặc email"
// //     //                     placeholderTextColor="#aaa"
// //     //                     // value={name}
// //     //                 />
// //     //             </View>

// //     //             <View style={styles.inputContainer}>

// //     //                 <TextInput
// //     //                     style={styles.input}
// //     //                     placeholder="Mật khẩu"
// //     //                     placeholderTextColor="#aaa"
// //     //                     secureTextEntry={!passwordVisible}
// //     //                 />
// //     //                 <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>

// //     //                 </TouchableOpacity>
// //     //             </View>

// //     //             <View style={styles.checkboxContainer}>
// //     //                 <Pressable onPress={() => setRememberMe(!rememberMe)} style={styles.checkbox}>
// //     //                     <View style={[styles.checkboxBox, agreeTerms && styles.checkboxChecked]} />
// //     //                     <Text style={styles.checkboxText}>Nhớ tài khoản</Text>
// //     //                 </Pressable>
// //     //             </View>

// //     //             <TouchableOpacity style={styles.loginButton}>
// //     //                 <Text style={styles.loginText}>Đăng nhập</Text>
// //     //             </TouchableOpacity>

// //     //             <Text style={styles.forgotText}>Quên mật khẩu?</Text>

// //     //             <View style={styles.dividerContainer}>
// //     //                 <View style={styles.line} />
// //     //                 <Text style={styles.orText}>Đăng nhập bằng</Text>
// //     //                 <View style={styles.line} />
// //     //             </View>

// //     //             <View style={styles.socialContainer}>
// //     //                 <TouchableOpacity >
// //     //                     <Image style={styles.faceB}
// //     //                         source={require(`../assets/faceb.jpg`)} />
// //     //                 </TouchableOpacity>
// //     //                 <TouchableOpacity >
// //     //                     <Image
// //     //                         style={styles.googleIcon}
// //     //                         source={require(`../assets/gg1.png`)}
// //     //                     />
// //     //                 </TouchableOpacity>
// //     //             </View>

// //     //             <Text style={styles.signupText}>
// //     //                 Bạn không có tài khoản?{' '}
// //     //                 <Text style={{ color: '#ff6600', fontWeight: 'bold' }} onPress={handleDK} >tạo tài khoản</Text>
// //     //             </Text>
// //     //         </View>
// //     //     </View>
// //     // );

// //     return (
// //         <View style={styles.container}>
// //             <Image
// //                 source={require('../assets/banner1.png')}
// //                 style={styles.image}
// //                 resizeMode="cover"
// //             />

// //             <View style={styles.formContainer}>
// //                 <Text style={styles.title}>Đăng nhập</Text>

// //                 <View style={styles.inputContainer}>
// //                     <TextInput
// //                         style={styles.input}
// //                         placeholder="Tên tài khoản hoặc email"
// //                         placeholderTextColor="#aaa"
// //                         value={email}
// //                         onChangeText={setEmail}
// //                     />
// //                 </View>

// //                 <View style={styles.inputContainer}>
// //                     <TextInput
// //                         style={styles.input}
// //                         placeholder="Mật khẩu"
// //                         placeholderTextColor="#aaa"
// //                         secureTextEntry={!passwordVisible}
// //                         value={password}
// //                         onChangeText={setPassword}
// //                     />
// //                     <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
// //                         {/* Bạn có thể thêm icon mắt nếu muốn */}
// //                     </TouchableOpacity>
// //                 </View>

// //                 <View style={styles.checkboxContainer}>
// //                     <Pressable onPress={() => setRememberMe(!rememberMe)} style={styles.checkbox}>
// //                         <View style={[styles.checkboxBox, agreeTerms && styles.checkboxChecked]} />
// //                         <Text style={styles.checkboxText}>Nhớ tài khoản</Text>
// //                     </Pressable>
// //                 </View>

// //                 <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
// //                     <Text style={styles.loginText}>Đăng nhập</Text>
// //                 </TouchableOpacity>

// //                 <Text style={styles.forgotText} onPress={handleForgot} >Quên mật khẩu?</Text>

// //                 <View style={styles.dividerContainer}>
// //                     <View style={styles.line} />
// //                     <Text style={styles.orText}>Đăng nhập bằng</Text>
// //                     <View style={styles.line} />
// //                 </View>

// //                 <View style={styles.socialContainer}>
// //                     <TouchableOpacity>
// //                         <Image
// //                             style={styles.faceB}
// //                             source={require(`../assets/faceb.jpg`)}
// //                         />
// //                     </TouchableOpacity>
// //                     <TouchableOpacity>
// //                         <Image
// //                             style={styles.googleIcon}
// //                             source={require(`../assets/gg1.png`)}
// //                         />
// //                     </TouchableOpacity>
// //                 </View>

// //                 <Text style={styles.signupText}>
// //                     Bạn không có tài khoản?{' '}
// //                     <Text style={{ color: '#ff6600', fontWeight: 'bold' }} onPress={handleDK}>
// //                         tạo tài khoản
// //                     </Text>
// //                 </Text>
// //             </View>
// //         </View>
// //     );



// // }
// // const styles = StyleSheet.create({
// //     container: { flex: 1, backgroundColor: '#fff' },
// //     image: {
// //         width: '100%',
// //         height: 350
// //     },
// //     formContainer: {
// //         flex: 1,
// //         padding: 20,
// //         backgroundColor: '#fff',
// //         marginTop: -30,
// //         borderTopLeftRadius: 10,
// //         borderTopRightRadius: 10,
// //         elevation: 5
// //     },
// //     title: {
// //         fontSize: 22,
// //         fontWeight: 'bold',
// //         alignSelf: 'center',
// //         marginBottom: 20
// //     },
// //     inputContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         borderColor: '#ddd',
// //         borderWidth: 1,
// //         borderRadius: 10,
// //         marginBottom: 15,
// //         paddingHorizontal: 10
// //     },
// //     icon: {
// //         marginRight: 10,
// //         color: '#666'
// //     },
// //     input: {
// //         flex: 1,
// //         height: 45,
// //         color: '#333'
// //     },
// //     rememberContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         marginBottom: 15
// //     },
// //     rememberText: {
// //         marginLeft: 5,
// //         fontSize: 14,
// //         color: '#333'
// //     },
// //     loginButton: {
// //         backgroundColor: '#000',
// //         paddingVertical: 12,
// //         borderRadius: 10,
// //         alignItems: 'center',
// //         marginBottom: 10
// //     },
// //     loginText: {
// //         color: '#fff',
// //         fontSize: 16
// //     },
// //     forgotText: {
// //         textAlign: 'center',
// //         color: 'orange',
// //         fontSize: 13,
// //         marginBottom: 20
// //     },
// //     dividerContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         marginBottom: 15
// //     },
// //     line: {
// //         flex: 1,
// //         height: 1,
// //         backgroundColor: '#ddd'
// //     },
// //     orText: {
// //         marginHorizontal: 10,
// //         color: '#888',
// //         fontSize: 13
// //     },
// //     socialContainer: {
// //         flexDirection: 'row',
// //         justifyContent: 'center',
// //         gap: 20,
// //         marginBottom: 20
// //     },
// //     faceB: {
// //         width: 45,
// //         height: 43,
// //         resizeMode: 'cover'
// //     },
// //     googleIcon: {
// //         width: 40,
// //         height: 40,
// //         // resizeMode: 'contain'
// //     },
// //     signupText: {
// //         textAlign: 'center',
// //         fontSize: 14,
// //         color: '#555'
// //     },
// //     checkboxContainer: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //         marginBottom: 10,
// //     },
// //     checkboxBox: {
// //         width: 20,
// //         height: 20,
// //         borderWidth: 1,
// //         borderColor: '#666',
// //         borderRadius: 4,
// //         marginRight: 8,
// //         backgroundColor: '#fff',
// //     },
// //     checkboxChecked: {
// //         backgroundColor: '#4CAF50',
// //     },
// //     checkboxText: {
// //         fontSize: 11,
// //         color: '#333',
// //     },
// //     checkboxText1: {
// //         fontSize: 11,
// //         color: 'orange',
// //     },
// //     checkbox: {
// //         flexDirection: 'row',
// //         alignItems: 'center',
// //     },
// // }); 


// // 📂 LoginScreen.tsx
// import React, { useState } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     Image,
//     StyleSheet,
//     Pressable,
//     Alert
// } from 'react-native';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import API from '../api';

// export default function LoginScreen({ navigation }: any) {
//     const [rememberMe, setRememberMe] = useState(false);
//     const [passwordVisible, setPasswordVisible] = useState(false);
//     const [agreeTerms, setAgreeTerms] = useState(false);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const handleDK = () => {
//         navigation.navigate('Register');
//     };

//     const handleForgot = () => {
//         navigation.navigate('ForgotP');
//     };

//     const handleLogin = async () => {
//         if (!email || !password) {
//             Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
//             return;
//         }

//         try {
//             const res = await API.post('/login', { email, password });
//             const { token, user } = res.data;
//             console.log('Đăng nhập thành công:', user);

//             // Lưu user thông tin
//             await AsyncStorage.setItem('userId', user.id);
//             await AsyncStorage.setItem('userEmail', user.email);
//             await AsyncStorage.setItem('userName', user.name);

//             Alert.alert('Thành công', 'Đăng nhập thành công');
//             navigation.navigate('Home');
//         } catch (err: any) {
//             const message = err.response?.data?.message || 'Đăng nhập thất bại';
//             Alert.alert('Lỗi', message);
//         }
//     };

//     return (
//         <View style={styles.container}>
//             <Image
//                 source={require('../assets/banner1.png')}
//                 style={styles.image}
//                 resizeMode="cover"
//             />

//             <View style={styles.formContainer}>
//                 <Text style={styles.title}>Đăng nhập</Text>

//                 <View style={styles.inputContainer}>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Tên tài khoản hoặc email"
//                         placeholderTextColor="#aaa"
//                         value={email}
//                         onChangeText={setEmail}
//                     />
//                 </View>

//                 <View style={styles.inputContainer}>
//                     <TextInput
//                         style={styles.input}
//                         placeholder="Mật khẩu"
//                         placeholderTextColor="#aaa"
//                         secureTextEntry={!passwordVisible}
//                         value={password}
//                         onChangeText={setPassword}
//                     />
//                     <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
//                         {/* Có thể thêm icon "mắt" ở đây nếu muốn */}
//                     </TouchableOpacity>
//                 </View>

//                 <View style={styles.checkboxContainer}>
//                     <Pressable onPress={() => setRememberMe(!rememberMe)} style={styles.checkbox}>
//                         <View style={[styles.checkboxBox, agreeTerms && styles.checkboxChecked]} />
//                         <Text style={styles.checkboxText}>Nhớ tài khoản</Text>
//                     </Pressable>
//                 </View>

//                 <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
//                     <Text style={styles.loginText}>Đăng nhập</Text>
//                 </TouchableOpacity>

//                 <Text style={styles.forgotText} onPress={handleForgot}>Quên mật khẩu?</Text>

//                 <View style={styles.dividerContainer}>
//                     <View style={styles.line} />
//                     <Text style={styles.orText}>Đăng nhập bằng</Text>
//                     <View style={styles.line} />
//                 </View>

//                 <View style={styles.socialContainer}>
//                     <TouchableOpacity>
//                         <Image style={styles.faceB} source={require(`../assets/faceb.jpg`)} />
//                     </TouchableOpacity>
//                     <TouchableOpacity>
//                         <Image style={styles.googleIcon} source={require(`../assets/gg1.png`)} />
//                     </TouchableOpacity>
//                 </View>

//                 <Text style={styles.signupText}>
//                     Bạn không có tài khoản?{' '}
//                     <Text style={{ color: '#ff6600', fontWeight: 'bold' }} onPress={handleDK}>
//                         tạo tài khoản
//                     </Text>
//                 </Text>
//             </View>
//         </View>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, backgroundColor: '#fff' },
//     image: { width: '100%', height: 350 },
//     formContainer: {
//         flex: 1,
//         padding: 20,
//         backgroundColor: '#fff',
//         marginTop: -30,
//         borderTopLeftRadius: 10,
//         borderTopRightRadius: 10,
//         elevation: 5
//     },
//     title: { fontSize: 22, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 },
//     inputContainer: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         borderColor: '#ddd',
//         borderWidth: 1,
//         borderRadius: 10,
//         marginBottom: 15,
//         paddingHorizontal: 10
//     },
//     icon: { marginRight: 10, color: '#666' },
//     input: { flex: 1, height: 45, color: '#333' },
//     rememberContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
//     rememberText: { marginLeft: 5, fontSize: 14, color: '#333' },
//     loginButton: {
//         backgroundColor: '#000',
//         paddingVertical: 12,
//         borderRadius: 10,
//         alignItems: 'center',
//         marginBottom: 10
//     },
//     loginText: { color: '#fff', fontSize: 16 },
//     forgotText: { textAlign: 'center', color: 'orange', fontSize: 13, marginBottom: 20 },
//     dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
//     line: { flex: 1, height: 1, backgroundColor: '#ddd' },
//     orText: { marginHorizontal: 10, color: '#888', fontSize: 13 },
//     socialContainer: {
//         flexDirection: 'row',
//         justifyContent: 'center',
//         gap: 20,
//         marginBottom: 20
//     },
//     faceB: { width: 45, height: 43, resizeMode: 'cover' },
//     googleIcon: { width: 40, height: 40 },
//     signupText: { textAlign: 'center', fontSize: 14, color: '#555' },
//     checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
//     checkboxBox: {
//         width: 20,
//         height: 20,
//         borderWidth: 1,
//         borderColor: '#666',
//         borderRadius: 4,
//         marginRight: 8,
//         backgroundColor: '#fff'
//     },
//     checkboxChecked: { backgroundColor: '#4CAF50' },
//     checkboxText: { fontSize: 11, color: '#333' },
//     checkboxText1: { fontSize: 11, color: 'orange' },
//     checkbox: { flexDirection: 'row', alignItems: 'center' }
// });


import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';

export default function LoginScreen({ navigation }: any) {
  const [rememberMe, setRememberMe] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDK = () => navigation.navigate('Register');
  const handleForgot = () => navigation.navigate('ForgotP');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Lỗi', 'Vui lòng nhập email và mật khẩu');
      return;
    }

    try {
      const res = await API.post('/login', { email, password });
      const { token, user } = res.data;

      // ✅ Lưu thông tin người dùng để sử dụng cho giỏ hàng và bình luận
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('userEmail', user.email);
      await AsyncStorage.setItem('userName', user.name);

      // (Tuỳ chọn) lưu token nếu dùng API có bảo mật
      if (rememberMe) {
        await AsyncStorage.setItem('authToken', token);
      }

      Alert.alert('✅ Thành công', 'Đăng nhập thành công');
      navigation.navigate('Home');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Đăng nhập thất bại';
      Alert.alert('❌ Lỗi', message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/banner1.png')}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.formContainer}>
        <Text style={styles.title}>Đăng nhập</Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tên tài khoản hoặc email"
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="#aaa"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            {/* Bạn có thể thêm icon mắt ở đây nếu cần */}
          </TouchableOpacity>
        </View>

        <View style={styles.checkboxContainer}>
          <Pressable onPress={() => setRememberMe(!rememberMe)} style={styles.checkbox}>
            <View style={[styles.checkboxBox, rememberMe && styles.checkboxChecked]} />
            <Text style={styles.checkboxText}>Nhớ tài khoản</Text>
          </Pressable>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>Đăng nhập</Text>
        </TouchableOpacity>

        <Text style={styles.forgotText} onPress={handleForgot}>Quên mật khẩu?</Text>

        <View style={styles.dividerContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Đăng nhập bằng</Text>
          <View style={styles.line} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity>
            <Image style={styles.faceB} source={require(`../assets/faceb.jpg`)} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image style={styles.googleIcon} source={require(`../assets/gg1.png`)} />
          </TouchableOpacity>
        </View>

        <Text style={styles.signupText}>
          Bạn không có tài khoản?{' '}
          <Text style={{ color: '#ff6600', fontWeight: 'bold' }} onPress={handleDK}>
            tạo tài khoản
          </Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 350 },
  formContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop: -30,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 5
  },
  title: { fontSize: 22, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10
  },
  input: { flex: 1, height: 45, color: '#333' },
  loginButton: {
    backgroundColor: '#000',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10
  },
  loginText: { color: '#fff', fontSize: 16 },
  forgotText: { textAlign: 'center', color: 'orange', fontSize: 13, marginBottom: 20 },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  line: { flex: 1, height: 1, backgroundColor: '#ddd' },
  orText: { marginHorizontal: 10, color: '#888', fontSize: 13 },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20
  },
  faceB: { width: 45, height: 43, resizeMode: 'cover' },
  googleIcon: { width: 40, height: 40 },
  signupText: { textAlign: 'center', fontSize: 14, color: '#555' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#fff'
  },
  checkboxChecked: { backgroundColor: '#4CAF50' },
  checkboxText: { fontSize: 11, color: '#333' },
  checkbox: { flexDirection: 'row', alignItems: 'center' }
});
