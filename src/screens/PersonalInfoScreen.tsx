import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';

const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
const [phone, setPhone] = useState('');

  const [user, setUser] = useState<any>(null);
  const [editing, setEditing] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  const loadUserData = async () => {
    const id = await AsyncStorage.getItem('userId');
    try {
      const res = await API.get('/users');
      const currentUser = res.data.find((u: any) => u._id === id);
      if (currentUser) {
        setUser(currentUser);
        setName(currentUser.name || '');
        setEmail(currentUser.email || '');
         setPhone(currentUser.phone || '');
        setImageUri(currentUser.avatar || null);
      }
    } catch (err) {
      Alert.alert('Lỗi tải dữ liệu', 'Không thể tải thông tin người dùng');
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadUserData();
    }
  }, [isFocused]);

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (!result.didCancel && result.assets?.length) {
      setImageUri(result.assets[0].uri || null);
    }
  };
const handleSave = async () => {
  // Kiểm tra email phải có đuôi @gmail.com
  if (!email.endsWith('@gmail.com')) {
    Alert.alert('Lỗi', 'Email phải có đuôi @gmail.com');
    return;
  }

  // Kiểm tra số điện thoại phải đúng 10 chữ số
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    Alert.alert('Lỗi', 'Số điện thoại phải đúng 10 chữ số');
    return;
  }

  try {
    await API.put(`/users/${user._id}`, {
      name,
      email,
      phone,
    });

    Alert.alert('Thành công', 'Thông tin đã được cập nhật');
    setEditing(false);
  } catch (err) {
    console.error('Lỗi cập nhật thông tin:', err);
    Alert.alert('Lỗi', 'Không thể cập nhật thông tin');
  }
};


  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin cá nhân</Text>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Icon name="pencil" size={22} />
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrap}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Icon name="person" size={42} color="#9ca3af" />
          </View>
        )}
        {editing && (
          <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
            <Icon name="camera" size={20} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Form */}
      <View style={styles.form}>
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          editable={editing}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          editable={editing}
          keyboardType="email-address"
        />

 <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          style={styles.input}
          editable={editing}
        />

        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          style={styles.input}
          editable={editing}
        />

        <Text style={styles.label}>Giới tính</Text>
        <TextInput
          value={gender}
          onChangeText={setGender}
          style={styles.input}
          editable={editing}
        />

        <Text style={styles.label}>Ngày sinh</Text>
        <TextInput
          value={dob}
          onChangeText={setDob}
          style={styles.input}
          editable={editing}
          placeholder="YYYY-MM-DD"
        />
      </View>

      {editing && (
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveText}>Lưu</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default PersonalInfoScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#d1d5db',
  },
  title: { fontSize: 18, fontWeight: 'bold' },

  avatarWrap: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#e5e7eb',
  },
  avatarPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageBtn: {
    backgroundColor: '#3b82f6',
    position: 'absolute',
    bottom: 0,
    right: 120,
    padding: 8,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#fff',
  },

  form: {
    paddingHorizontal: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 16,
    color: '#374151',
  },
  input: {
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  saveBtn: {
    margin: 20,
    backgroundColor: '#10b981',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});