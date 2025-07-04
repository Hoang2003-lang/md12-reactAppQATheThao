import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CodPayScreen = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const navigation = useNavigation();

  const handleNext = () => {
    if (selectedMethod === 'cod') {
      navigation.navigate('CodPay');
    } else if (selectedMethod === 'shoppay') {
      navigation.navigate('ShopPay');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Chọn phương thức thanh toán</Text>

        {/* COD */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => setSelectedMethod('cod')}
        >
          <Image
            source={require('../../assets/images/cod_pay.jpg')}
            style={styles.icon}
          />
          <Text style={styles.optionText}>Thanh toán khi nhận hàng (COD)</Text>
          <View style={styles.radioOuter}>
            {selectedMethod === 'cod' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>

        {/* SHOPPAY */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => setSelectedMethod('shoppay')}
        >
          <Image
            source={require('../../assets/images/shop_pay.png')}
            style={styles.icon}
          />
          <Text style={styles.optionText}>Thanh toán qua ShopPay</Text>
          <View style={styles.radioOuter}>
            {selectedMethod === 'shoppay' && <View style={styles.radioInner} />}
          </View>
        </TouchableOpacity>
      </View>

      {/* Footer nút Tiếp theo */}
      {selectedMethod !== '' && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextText}>Tiếp theo</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CodPayScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 30,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    justifyContent: 'space-between',
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 10,
  },
  optionText: {
    flex: 1,
    fontSize: 16,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007bff',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  nextButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
  },
  nextText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
