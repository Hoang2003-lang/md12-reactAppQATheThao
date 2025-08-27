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
import { _signInWithGoogle } from '../config/firebase/GoogleSignIn';
import { onFacebookButtonPress } from "../config/firebase/FacebookSignIn"

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

      //Lưu thông tin người dùng để sử dụng cho giỏ hàng và bình luận
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('userEmail', user.email);
      await AsyncStorage.setItem('userName', user.name);

      //Lưu token vào AsyncStorage nếu cần
      navigation.navigate('Home'); // hoặc màn hình chính của bạn
    } catch (err: any) {
      const message = err.response?.data?.message || 'Đăng nhập thất bại';
      Alert.alert('Lỗi', message);
    }
  };


  //Login by Google
  async function googleSignin() {
    try {
      const userData = await _signInWithGoogle();
      //Nếu không nhận được dữ liệu người dùng hoặc không có accessToken, thì dừng hàm (return)
      if (!userData || !userData.accessToken) {
        return;
      }

      // Gửi accessToken thật từ Google lên server
      // console.log("Gửi accessToken:", userData.accessToken);
      const res = await API.post('/auth/google', {
        accessToken: userData.accessToken
      });

      //Lấy thông tin user từ response data của server
      const user = res.data.user;

      //Lưu thông tin user vào AsyncStorage để app nhớ trạng thái đăng nhập
      await AsyncStorage.setItem('userId', user.id);
      await AsyncStorage.setItem('userEmail', user.email);
      await AsyncStorage.setItem('userName', user.name);

      navigation.navigate("Home");

    } catch (error) {
      console.error("Lỗi chi tiết:", (error as any)?.response?.data);
      Alert.alert("Lỗi", "Không thể đăng nhập bằng Google");
    }
  }

  //Login by Facebook
  const handleFacebookLogin = async () => {
    try {
      const userCredential = await onFacebookButtonPress();
      const user = userCredential.user;
  
      console.log('Facebook Firebase UID:', user.uid);
      console.log('Email:', user.email);
      console.log('DisplayName:', user.displayName);
  
      //Gửi thông tin user lên server backend
      const res = await API.post('/auth/facebook', {
        uid: user.uid,
        email: user.email,
        name: user.displayName,
      });
  
      //Lấy thông tin user từ response của server
      const backendUser = res.data.user;
  
      //Lưu thông tin user vào AsyncStorage
      await AsyncStorage.setItem('userId', backendUser.id);
      await AsyncStorage.setItem('userEmail', backendUser.email || '');
      await AsyncStorage.setItem('userName', backendUser.name || '');
  
      navigation.navigate('Home');
  
    } catch (error: any) {
      console.log('Facebook login error:', error);
  
      //Trường hợp email đã tồn tại với một phương thức khác 
      if (error.code === 'auth/account-exists-with-different-credential') {
        Alert.alert(
          'Tài khoản đã tồn tại', 
          'Email này đã được dùng cho phương thức khác. Vui lòng đăng nhập bằng phương thức cũ trước.',
          [{ text: 'OK' }]
        );
      } else {
        // Alert.alert('Lỗi', 'Không thể đăng nhập bằng Facebook.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/banner1.png')}
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
          <TouchableOpacity onPress={handleFacebookLogin}>
            <Image
              style={styles.faceB}
              source={require(`../assets/images/logo_fb.png`)}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => googleSignin()}>
            <Image
              style={styles.googleIcon}
              source={require(`../assets/images/logo_gg.png`)}
            />
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
  faceB: { width: 40, height: 40, resizeMode: 'cover' },
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
