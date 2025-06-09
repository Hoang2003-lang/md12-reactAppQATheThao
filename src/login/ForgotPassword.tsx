import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

const ForgotPassword = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-back" size={24} color="#000" />
        <Text style={styles.title1} > Quên mật khẩu </Text>
      </TouchableOpacity>

      <View style={styles.title}>
        <Text style={{ fontSize: 16 }}>Vui lòng cung cấp địa chỉ Email !</Text>

        <View style={styles.inputContainer}>
          <TextInput
            placeholder="Email"
            placeholderTextColor="#666"
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity style={styles.button} >
          <Text style={{ color: '#fff', fontWeight: 'bold' }} >Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>

  )
}

export default ForgotPassword
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginTop: 10,
  },
  title: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title1: {
    fontSize: 20,
    marginLeft: 70
  },
  inputContainer: {
    marginTop: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#aaa',
    width: '80%',
  },
  input: {
    height: 40,
    fontSize: 16,
    color: '#000',
  },
  button: {
    marginTop: 30,
    backgroundColor: '#000',      // nền đen
    paddingVertical: 12,
    paddingHorizontal: 100,
    borderRadius: 8,
    borderWidth: 1,               // viền
    borderColor: '#fff',          // màu viền trắng (có thể đổi)
    alignItems: 'center',
  },

})
