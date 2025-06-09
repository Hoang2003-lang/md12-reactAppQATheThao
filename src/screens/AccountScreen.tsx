// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { useState } from 'react';



const { width } = Dimensions.get('window');



const AccountScreen = ({ navigation }: any) => {

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="chevron-back" size={24} color="#000" />
                <Text style={styles.title1} > Màn Account</Text>
            </TouchableOpacity>

        </View>
    );
};

export default AccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginTop: 10,
    },
    title1: {
        fontSize: 20,
        marginLeft: 70
    },
    bottomNav: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        borderRadius: 10,
        position: 'absolute',
        bottom: 10,
        left: 20,
        right: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
});



