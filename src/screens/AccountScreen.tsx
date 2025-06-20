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

interface MenuItem {
  icon: string;
  label: string;
  screen?: string;
}

const menuItems: MenuItem[] = [
  { icon: 'cart-outline', label: 'Giỏ hàng' },
  { icon: 'account-outline', label: 'Thông tin cá nhân', screen: 'PersonalInfo' },
  { icon: 'headset', label: 'Liên hệ với chúng tôi' },
  { icon: 'chat-outline', label: 'Trò chuyện' },
  { icon: 'shield-lock-outline', label: 'Chính sách và bảo mật' },
];

const AccountScreen: React.FC = () => {
  const [confirm, setConfirm] = useState(false);
  const navigation = useNavigation();

  const onLogout = () => setConfirm(true);
  const doLogout = () => {
    setConfirm(false);
    Alert.alert('Đã đăng xuất!');
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

      <TouchableOpacity style={styles.row} onPress={onLogout}>
        <MCI name="logout" size={22} color="#e11d48" />
        <Text style={[styles.label, { color: '#e11d48' }]}>Đăng xuất</Text>
      </TouchableOpacity>

      {confirm && (
        <View style={styles.modal}>
          <Text style={styles.modalText}>
            Bạn có muốn đăng xuất tài khoản này của bạn không?
          </Text>

          <View style={styles.btnWrap}>
            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#f87171' }]}
              onPress={doLogout}>
              <Text style={styles.btnTxt}>Có</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, { backgroundColor: '#4ade80' }]}
              onPress={() => setConfirm(false)}>
              <Text style={styles.btnTxt}>Không</Text>
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
  modalText: { fontWeight: '600', textAlign: 'center', marginBottom: 16 },
  btnWrap: { flexDirection: 'row', justifyContent: 'space-evenly' },
  btn: { paddingVertical: 10, paddingHorizontal: 28, borderRadius: 8 },
  btnTxt: { color: '#fff', fontWeight: '600' },
});
