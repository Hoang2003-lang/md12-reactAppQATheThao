import React from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Switch,
    Pressable,
} from 'react-native';
import { useState } from 'react';

export default function LoginScreen({ navigation }: any) {
    const [rememberMe, setRememberMe] = React.useState(false);
    const [passwordVisible, setPasswordVisible] = React.useState(false);

    const [agreeTerms, setAgreeTerms] = useState(false);


    const handleDK = () => {
        navigation.navigate('Register');
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/banner1.png')}
                style={styles.image}
                resizeMode="cover"
            />

            <View style={styles.formContainer}>
                <Text style={styles.title}>Đăng nhập</Text>

                <View style={styles.inputContainer}>

                    <TextInput
                        style={styles.input}
                        placeholder="Tên tài khoản hoặc email"
                        placeholderTextColor="#aaa"
                        // value={name}
                    />
                </View>

                <View style={styles.inputContainer}>

                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#aaa"
                        secureTextEntry={!passwordVisible}
                    />
                    <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>

                    </TouchableOpacity>
                </View>

                <View style={styles.checkboxContainer}>
                    <Pressable onPress={() => setRememberMe(!rememberMe)} style={styles.checkbox}>
                        <View style={[styles.checkboxBox, agreeTerms && styles.checkboxChecked]} />
                        <Text style={styles.checkboxText}>Nhớ tài khoản</Text>
                    </Pressable>
                </View>

                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginText}>Đăng nhập</Text>
                </TouchableOpacity>

                <Text style={styles.forgotText}>Quên mật khẩu?</Text>

                <View style={styles.dividerContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>Đăng nhập bằng</Text>
                    <View style={styles.line} />
                </View>

                <View style={styles.socialContainer}>
                    <TouchableOpacity >
                        <Image style={styles.faceB}
                            source={require(`../assets/faceb.jpg`)} />
                    </TouchableOpacity>
                    <TouchableOpacity >
                        <Image
                            style={styles.googleIcon}
                            source={require(`../assets/gg1.png`)}
                        />
                    </TouchableOpacity>
                </View>

                <Text style={styles.signupText}>
                    Bạn không có tài khoản?{' '}
                    <Text style={{ color: '#ff6600', fontWeight: 'bold' }} onPress={handleDK} >tạo tài khoản</Text>
                </Text>
            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    image: {
        width: '100%',
        height: 350
    },
    formContainer: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
        marginTop: -30,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        elevation: 5
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        alignSelf: 'center',
        marginBottom: 20
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        paddingHorizontal: 10
    },
    icon: {
        marginRight: 10,
        color: '#666'
    },
    input: {
        flex: 1,
        height: 45,
        color: '#333'
    },
    rememberContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
    },
    rememberText: {
        marginLeft: 5,
        fontSize: 14,
        color: '#333'
    },
    loginButton: {
        backgroundColor: '#000',
        paddingVertical: 12,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 10
    },
    loginText: {
        color: '#fff',
        fontSize: 16
    },
    forgotText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 13,
        marginBottom: 20
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15
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
    socialContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 20,
        marginBottom: 20
    },
    faceB: {
        width: 45,
        height: 43,
        resizeMode: 'cover'
    },
    googleIcon: {
        width: 40,
        height: 40,
        // resizeMode: 'contain'
    },
    signupText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#555'
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
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
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
    },
}); 
