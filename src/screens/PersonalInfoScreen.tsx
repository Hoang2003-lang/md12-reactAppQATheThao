import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const PersonalInfoScreen = () => {
  const navigation = useNavigation();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [gender, setGender] = useState('');
  const [dob, setDob] = useState('');

  const pickImage = async () => {
    const result = await launchImageLibrary({ mediaType: 'photo' });
    if (!result.didCancel && result.assets?.length) {
      setImageUri(result.assets[0].uri || null);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin cá nhân</Text>
        <View style={{ width: 26 }} /> {/* Empty space to balance header */}
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
        <TouchableOpacity style={styles.addImageBtn} onPress={pickImage}>
          <Icon name="camera" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Form Fields */}
      <View style={styles.form}>
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />

        <Text style={styles.label}>Email</Text>
        <TextInput value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />

        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput value={address} onChangeText={setAddress} style={styles.input} />

        <Text style={styles.label}>Giới tính</Text>
        <TextInput value={gender} onChangeText={setGender} style={styles.input} />

        <Text style={styles.label}>Ngày sinh</Text>
        <TextInput value={dob} onChangeText={setDob} style={styles.input} placeholder="YYYY-MM-DD" />
      </View>
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
});
