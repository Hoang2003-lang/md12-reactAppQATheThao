import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';

const BASE_URL = 'https://provinces.open-api.vn/api';

export default function LocationPicker({ onSelect }) {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [provinceCode, setProvinceCode] = useState('');
  const [districtCode, setDistrictCode] = useState('');
  const [wardCode, setWardCode] = useState('');

  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);

  useEffect(() => {
    fetch(`${BASE_URL}/p/`)
      .then(res => res.json())
      .then(setProvinces)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!provinceCode) return;
    setLoadingDistricts(true);
    fetch(`${BASE_URL}/p/${provinceCode}?depth=2`)
      .then(res => res.json())
      .then(data => {
        setDistricts(data.districts);
        setDistrictCode('');
        setWardCode('');
        setWards([]);
      })
      .catch(console.error)
      .finally(() => setLoadingDistricts(false));
  }, [provinceCode]);

  useEffect(() => {
    if (!districtCode) return;
    setLoadingWards(true);
    fetch(`${BASE_URL}/d/${districtCode}?depth=2`)
      .then(res => res.json())
      .then(data => {
        setWards(data.wards);
        setWardCode('');
      })
      .catch(console.error)
      .finally(() => setLoadingWards(false));
  }, [districtCode]);

  useEffect(() => {
    if (provinceCode && districtCode && wardCode) {
      const province = provinces.find(p => p.code === provinceCode);
      const district = districts.find(d => d.code === districtCode);
      const ward = wards.find(w => w.code === wardCode);
      onSelect && onSelect({ province, district, ward });
    }
  }, [provinceCode, districtCode, wardCode]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Tỉnh / Thành phố</Text>
      <View style={styles.pickerWrapper}>
        <Picker selectedValue={provinceCode} onValueChange={setProvinceCode}>
          <Picker.Item label="-- Chọn tỉnh/thành --" value="" />
          {provinces.map(p => (
            <Picker.Item key={p.code} label={p.name} value={p.code} />
          ))}
        </Picker>
      </View>

      {loadingDistricts ? (
        <ActivityIndicator style={styles.loading} size="small" color="#28a745" />
      ) : (
        <>
          <Text style={styles.label}>Quận / Huyện</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={districtCode} onValueChange={setDistrictCode}>
              <Picker.Item label="-- Chọn quận/huyện --" value="" />
              {districts.map(d => (
                <Picker.Item key={d.code} label={d.name} value={d.code} />
              ))}
            </Picker>
          </View>
        </>
      )}

      {loadingWards ? (
        <ActivityIndicator style={styles.loading} size="small" color="#28a745" />
      ) : (
        <>
          <Text style={styles.label}>Phường / Xã</Text>
          <View style={styles.pickerWrapper}>
            <Picker selectedValue={wardCode} onValueChange={setWardCode}>
              <Picker.Item label="-- Chọn phường/xã --" value="" />
              {wards.map(w => (
                <Picker.Item key={w.code} label={w.name} value={w.code} />
              ))}
            </Picker>
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
  },
  label: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '500',
    color: '#333',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 12,
    elevation: 2,
  },
  loading: {
    marginVertical: 8,
    alignSelf: 'center',
  },
});
