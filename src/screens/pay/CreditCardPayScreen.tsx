import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, Alert, Image
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CreditCardPayScreen = ({ route }) => {
  const { name, phone, note, location } = route.params;
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [useShippingAddress, setUseShippingAddress] = useState(true);

  const fullAddress = `${location.ward.name}, ${location.district.name}, ${location.province.name}`;

  const handlePay = () => {
    if (!cardNumber || !expiry || !cvv || !cardName) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin thẻ.');
      return;
    }
    Alert.alert('Thành công', `Đã thanh toán đơn hàng cho ${name} tại ${fullAddress}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentWrapper}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>THANH TOÁN</Text>

          <View style={styles.cardSection}>
            <View style={styles.paymentHeader}>
              <Text style={styles.paymentLabel}>Thẻ tín dụng</Text>
              <View style={styles.cardIcons}>
                <Image source={require('../../assets/images/shop_pay.png')} style={styles.cardIcon} />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <TextInput
                style={styles.input}
                placeholder="Số thẻ"
                keyboardType="number-pad"
                value={cardNumber}
                onChangeText={setCardNumber}
              />
              <Ionicons name="lock-closed-outline" size={20} style={styles.inputIcon} />
            </View>

            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1, marginRight: 10 }]}
                placeholder="MM/YY"
                keyboardType="number-pad"
                value={expiry}
                onChangeText={setExpiry}
              />
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <TextInput
                  style={[styles.input, { paddingRight: 30 }]}
                  placeholder="Mã bảo mật"
                  keyboardType="number-pad"
                  value={cvv}
                  onChangeText={setCvv}
                />
                <MaterialIcons name="help-outline" size={20} style={styles.inputIcon} />
              </View>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Tên chủ thẻ"
              value={cardName}
              onChangeText={setCardName}
            />

            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setUseShippingAddress(!useShippingAddress)}
            >
              <MaterialIcons
                name={useShippingAddress ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color={useShippingAddress ? '#2a71d0' : '#ccc'}
              />
              <Text style={styles.checkboxLabel}> Sử dụng địa chỉ giao hàng làm địa chỉ thanh toán</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.summary}>
            <Text style={styles.summaryTitle}>TÓM TẮT ĐƠN HÀNG</Text>
            <View style={styles.productRow}>
              <Image source={require('../../assets/images/shop_pay.png')} style={styles.productImage} />
              <View style={{ flex: 1 }}>
                <Text>Áo sơ mi trắng</Text>
                <Text style={styles.productDesc}>Loại: Trắng</Text>
              </View>
              <Text style={styles.productPrice}>250.000 đ</Text>
            </View>

            <View style={styles.couponRow}>
              <TextInput placeholder="Mã giảm giá" style={styles.couponInput} />
              <TouchableOpacity style={styles.couponBtn}>
                <Text style={styles.couponBtnText}>Áp dụng</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.priceRow}><Text>Tổng phụ</Text><Text>250.000 đ</Text></View>
            <View style={styles.priceRow}><Text>Vận chuyển</Text><Text>Nhập địa chỉ</Text></View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Tổng cộng</Text>
              <Text style={styles.totalPrice}>250.000 đ</Text>
            </View>
          </View>
        </ScrollView>

        {/* Footer cố định */}
        <View style={styles.footer}>
          <TouchableOpacity style={styles.payButton} onPress={handlePay}>
            <Text style={styles.payButtonText}>Mua ngay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CreditCardPayScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  contentWrapper: { flex: 1 },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 120, // Để tránh nội dung bị footer che
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  payButton: {
    backgroundColor: '#d00',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#222',
  },
  cardSection: {
    borderWidth: 1,
    borderColor: '#2a71d0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    backgroundColor: '#f9f9f9',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2a2a2a',
  },
  cardIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardIcon: {
    width: 40,
    height: 24,
    marginLeft: 8,
    resizeMode: 'contain',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    fontSize: 15,
    color: '#333',
    marginTop: 14,
  },
  inputGroup: {
    position: 'relative',
    flex: 1,
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: 26,
    color: '#888',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  checkboxLabel: {
    fontSize: 14,
    marginLeft: 8,
    color: '#333',
  },

  summary: { marginBottom: 20, paddingTop: 8 },
  summaryTitle: { fontSize: 16, fontWeight: '600', marginVertical: 12, color: '#222' },
  productRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fafafa',
    borderRadius: 10,
    padding: 10,
  },
  productImage: { width: 60, height: 60, marginRight: 12, borderRadius: 8, resizeMode: 'contain' },
  productDesc: { color: '#666', fontSize: 13 },
  productPrice: { color: '#d00', fontWeight: 'bold' },

  couponRow: { flexDirection: 'row', marginTop: 12, alignItems: 'center' },
  couponInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    fontSize: 14,
  },
  couponBtn: {
    backgroundColor: '#222',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  couponBtnText: { color: '#fff', fontSize: 14 },

  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#111' },
  totalPrice: { fontSize: 16, fontWeight: 'bold', color: '#d00' },
});
