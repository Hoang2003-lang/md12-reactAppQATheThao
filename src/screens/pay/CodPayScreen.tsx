import React, { useState } from 'react';
import {
  StyleSheet, Text, View, TouchableOpacity,
  TextInput, SafeAreaView, ScrollView, Alert,
} from 'react-native';
import LocationPicker from './LocationPicker'; // Giả sử đã có

const CodPayScreen = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [note, setNote] = useState('');
  const [location, setLocation] = useState(null);

  const handleConfirm = () => {
    if (!name || !phone || !location) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin giao hàng.');
      return;
    }

    const fullAddress = `${location.ward.name}, ${location.district.name}, ${location.province.name}`;
    Alert.alert('Thành công', `Đơn hàng COD đã xác nhận đến địa chỉ:\n${fullAddress}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Thông tin giao hàng (COD)</Text>

        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ và tên"
          value={name}
          onChangeText={setName}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Vị trí giao hàng</Text>
        <View style={styles.locationContainer}>
          <LocationPicker onSelect={(loc) => setLocation(loc)} />
        </View>

        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={[styles.input, styles.noteInput]}
          placeholder="Ghi chú cho nhân viên giao hàng"
          multiline
          numberOfLines={4}
          value={note}
          onChangeText={setNote}
        />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>Xác nhận đơn hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CodPayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    color: '#222',
  },
  label: {
    fontSize: 16,
    color: '#444',
    marginTop: 16,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  noteInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  locationContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    elevation: 2,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  confirmButton: {
    backgroundColor: '#28a745',
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
  },
  confirmText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 16,
  },
});
