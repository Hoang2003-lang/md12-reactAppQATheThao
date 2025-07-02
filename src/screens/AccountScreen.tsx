import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import MCI from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import API from '../api';

type RootStackParamList = {
  Login: undefined;
  PersonalInfo: undefined;
  Cart: undefined;
  Chat: undefined;
};


type NavigationProp = NativeStackNavigationProp<RootStackParamList>;


interface MenuItem {
  icon: string;
  label: string;

  screen?: keyof RootStackParamList;
}

const menuItems: MenuItem[] = [
  { icon: 'cart-outline', label: 'Giỏ hàng', screen: 'Cart' },
  { icon: 'account-outline', label: 'Thông tin cá nhân', screen: 'PersonalInfo' },
  { icon: 'chat-outline', label: 'Trò chuyện', screen: 'Chat' },

  { icon: 'shield-lock-outline', label: 'Chính sách và bảo mật' },
];

const AccountScreen: React.FC = () => {

  const navigation = useNavigation<NavigationProp>();
  const [confirmLogout, setConfirmLogout] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const doLogout = async () => {
    try {
      await AsyncStorage.clear();
      Alert.alert('Đã đăng xuất!');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể đăng xuất tài khoản');
    }
  };

  const deleteProfile = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId) {
        Alert.alert('Lỗi', 'Không tìm thấy tài khoản');
        return;
      }

      await API.delete(`/users/${userId}`);
      await AsyncStorage.clear();
      Alert.alert('Tài khoản đã được xoá');
      navigation.navigate('Login');
    } catch (err) {
      Alert.alert('Lỗi', 'Không thể xoá hồ sơ. Vui lòng thử lại sau.');
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.header}>F7 Shop</Text>

      {menuItems.map((m) => (
        <TouchableOpacity
          key={m.icon}
          style={styles.row}
          onPress={() => {
            if (m.screen) {
              // Điều hướng tới màn hình tương ứng
              navigation.navigate(m.screen as never);
            }
          }}>
          <MCI name={m.icon} size={22} />
          <Text style={styles.label}>{m.label}</Text>
        </TouchableOpacity>
      ))}


      <TouchableOpacity style={styles.row} onPress={() => setConfirmLogout(true)}>

        <MCI name="logout" size={22} color="#e11d48" />
        <Text style={[styles.label, { color: '#e11d48' }]}>Đăng xuất</Text>
      </TouchableOpacity>


      <TouchableOpacity style={styles.row} onPress={() => setConfirmDelete(true)}>
        <MCI name="delete-outline" size={22} color="#ef4444" />
        <Text style={[styles.label, { color: '#ef4444' }]}>Xoá hồ sơ</Text>
      </TouchableOpacity>

      {/* Modal xác nhận đăng xuất */}
      {confirmLogout && (
        <View style={styles.modal}>
          <Text style={styles.modalText}>Bạn có muốn đăng xuất tài khoản không?</Text>

          <View style={styles.btnWrap}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#f87171' }]}
              onPress={doLogout}>
              <Text style={styles.btnTxt}>Có</Text>
            </TouchableOpacity>
<
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#4ade80' }]}
              onPress={() => setConfirmLogout(false)}>

              <Text style={styles.btnTxt}>Không</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}


      {/* Modal xác nhận xoá hồ sơ */}
      {confirmDelete && (
        <View style={styles.modal}>
          <Text style={styles.modalText}>
            Bạn có chắc chắn muốn xoá hồ sơ không? Hành động này không thể hoàn tác.
          </Text>
          <View style={styles.btnWrap}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#ef4444' }]}
              onPress={deleteProfile}>
              <Text style={styles.btnTxt}>Xoá</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#9ca3af' }]}
              onPress={() => setConfirmDelete(false)}>
              <Text style={styles.btnTxt}>Huỷ</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

    </View>
  );
};

export default AccountScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: {
    fontSize: 22,
    fontWeight: '700',
    alignSelf: 'center',
    marginBottom: 12,

    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 8,

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#e5e7eb',
  },
  label: { marginLeft: 12, fontSize: 16 },
  modal: {
    marginTop: 32,
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    padding: 18,
  },
  modalText: {
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    color: '#111827',
  },

  btnWrap: { flexDirection: 'row', justifyContent: 'space-evenly' },
  btn: { paddingVertical: 10, paddingHorizontal: 28, borderRadius: 8 },
  btnTxt: { color: '#fff', fontWeight: '600' },
});
