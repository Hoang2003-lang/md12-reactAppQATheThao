// RegisterScreen.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
  Pressable,
  Alert
} from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import API from '../api';

export default function RegisterScreen({ navigation }: any) {

  const [agreeTerms, setAgreeTerms] = useState(false);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !email || !password || !confirmPassword) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu không khớp');
      return;
    }

    if (!agreeTerms) {
      Alert.alert('Lỗi', 'Bạn cần đồng ý với điều khoản');
      return;
    }

    try {
      const response = await API.post('/register', {
        name: username,
        email,
        password,
      });

      Alert.alert('Thành công', response.data.message, [
        {
          text: 'Đăng nhập',
          onPress: () => navigation.navigate('Login'),
        },
      ]);
    } catch (error) {
      const message = 'Đăng ký thất bại';
      Alert.alert('Lỗi', message);
      
    }
  };

  const LoginScreen =()=>{
    navigation.navigate('Login')
  }
  // return (
  //   <ImageBackground
  //     source={require('../assets/backgroundR.png')}
  //     style={styles.background}
  //     resizeMode="cover"
  //   >
  //     <View style={styles.container}>
  //       <Text style={styles.title}>Đăng ký</Text>


  //       <View style={styles.inputContainer}>
  //         <TextInput
  //           placeholder="Tên tài khoản"
  //           placeholderTextColor="#666"
  //           style={styles.input}
  //         />
  //       </View>


  //       <View style={styles.inputContainer}>
  //         <TextInput
  //           placeholder="Email"
  //           placeholderTextColor="#666"
  //           style={styles.input}
  //           keyboardType="email-address"
  //         />
  //       </View>

  //       <View style={styles.inputContainer}>
  //         <TextInput
  //           placeholder="Mật khẩu"
  //           placeholderTextColor="#666"
  //           style={styles.input}
  //           secureTextEntry
  //         />
  //       </View>

  //       <View style={styles.inputContainer}>
  //         <TextInput
  //           placeholder="Xác nhận mật khẩu"
  //           placeholderTextColor="#666"
  //           style={styles.input}
  //           secureTextEntry
  //         />
  //       </View>
  //       <View style={styles.checkboxContainer}>
  //         <Pressable onPress={() => setAgreeTerms(!agreeTerms)} style={styles.checkbox}>
  //           <View style={[styles.checkboxBox, agreeTerms && styles.checkboxChecked]} />
  //           <Text style={styles.checkboxText}>Tôi đồng ý</Text>
  //           <Text style={styles.checkboxText1}> với điều khoản dịch vụ của F7Shop</Text>
  //         </Pressable>
  //       </View>
  //     </View>

  //     <View style={styles.loginButton} >
  //       <TouchableOpacity style={styles.loginButton1}>
  //         <Text style={styles.loginText}>Đăng Ký</Text>
  //       </TouchableOpacity>
  //     </View>


  //     <View style={styles.dividerContainer}>
  //       <View style={styles.line} />
  //       <Text style={styles.orText}>Đăng ký bằng</Text>
  //       <View style={styles.line} />
  //     </View>
  //     <View style={styles.socialContainer}>
  //       <TouchableOpacity >
  //         <Image style={styles.faceB}
  //           source={require(`../assets/faceb.jpg`)} />
  //       </TouchableOpacity>
  //       <TouchableOpacity >
  //         <Image
  //           style={styles.googleIcon}
  //           source={require(`../assets/gg1.png`)}
  //         />
  //       </TouchableOpacity>
  //     </View>

  //     <Text style={styles.signupText}>
  //       Tôi đã có tài khoản {' '}
  //       <Text style={{ color: '#ff6600', fontWeight: 'bold' }} onPress={LoginScreen} >Đăng nhập</Text>
  //     </Text>
  //   </ImageBackground>
  // );

  return (
    <ImageBackground
      source={require('../assets/images/backgroundR.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <Text style={styles.title}>Đăng ký</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Tên tài khoản"
            placeholderTextColor="#666"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            style={styles.input}
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Mật khẩu"
            placeholderTextColor="#666"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Xác nhận mật khẩu"
            placeholderTextColor="#666"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
        </View>

        <View style={styles.checkboxContainer}>
          <Pressable
            onPress={() => setAgreeTerms(!agreeTerms)}
            style={styles.checkbox}
          >
            <View
              style={[
                styles.checkboxBox,
                agreeTerms && styles.checkboxChecked,
              ]}
            />
            <Text style={styles.checkboxText}>Tôi đồng ý</Text>
            <Text style={styles.checkboxText1}>
              {' '}
              với điều khoản dịch vụ của F7Shop
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.loginButton}>
        <TouchableOpacity style={styles.loginButton1} onPress={handleRegister}>
          <Text style={styles.loginText}>Đăng Ký</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Đăng ký bằng</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity>
          <Image style={styles.faceB} source={require(`../assets/images/logo_fb.png`)} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Image
            style={styles.googleIcon}
            source={require(`../assets/images/logo_gg.png`)}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.signupText}>
        Tôi đã có tài khoản{' '}
        <Text
          style={{ color: '#ff6600', fontWeight: 'bold' }}
          onPress={LoginScreen}
        >
          Đăng nhập
        </Text>
      </Text>
    </ImageBackground>
  );

}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
    marginHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    marginBottom: 20,
    paddingBottom: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginBottom: 20
  },
  faceB: {
    width: 40,
    height: 40,
    resizeMode: 'cover'
  },
  googleIcon: {
    width: 40,
    height: 40,
    // resizeMode: 'contain'
  },
  loginButton: {
    paddingVertical: 6,
    alignItems: 'center',
    marginTop: 10
  },
  loginButton1: {
    backgroundColor: '#000',
    paddingVertical: 6,
    width: 250,
    height: 50,
    alignItems: 'center',
    borderRadius: 6

  },
  loginText: {
    color: '#fff',
    fontSize: 16,
    marginTop: 5
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 15
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd'
  },
  orText: {
    marginHorizontal: 10,
    color: '#888',
    fontSize: 13
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#666',
    borderRadius: 4,
    marginRight: 8,
    backgroundColor: '#fff',
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkboxText: {
    fontSize: 11,
    color: '#333',
  },
  checkboxText1: {
    fontSize: 11,
    color: 'orange',
  },
  signupText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555'
  },
});
