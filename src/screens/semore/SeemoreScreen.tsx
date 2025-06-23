import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import API from '../../api/api';
import Icon from 'react-native-vector-icons/Ionicons'


const { width } = Dimensions.get('window');

const SeemoreKMScreen = ({ navigation, route }: any) => {
    const { title, type } = route.params;
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        (async () => {
            try {
                const res = await API.get('/products');
                let filtered = res.data;

                if (type === 'promotion') {
                    filtered = filtered.filter((p: any) => p.name.includes('Áo Đấu'));
                } else if (type === 'club') {
                    filtered = filtered.filter((p: any) => p.name.includes('Manchester'));
                } else if (type === 'national') {
                    filtered = filtered.filter((p: any) => p.name.includes('Chelsea'));
                }

                setProducts(filtered);
            } catch (e) {
                console.error(e);
            }
        })();
    }, []);

    return (

        <View style={{ flex: 1, backgroundColor: '#fff' }}>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="chevron-back" size={24} color="#000" />
                <Text style={styles.header}>{title}</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                <View style={styles.wrapRow}>
                    {products.map((p: any) => (
                        <TouchableOpacity
                            key={p._id}
                            onPress={() => navigation.navigate('ProductDetail', { productId: p._id })}
                            style={styles.productItem}
                        >
                            <Image source={{ uri: p.image }} style={styles.productImage} />
                            <Text style={styles.productName}>{p.name}</Text>
                            <Text style={styles.productPrice}>{p.price.toLocaleString()} đ</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default SeemoreKMScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
        padding:10,
        // backgroundColor: 'orange',
        // color: '#fff',
        textAlign: 'center',
    },
    wrapRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    },
    productGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
        paddingTop: 10
    },
    productItem: {
        width: '45%',
        alignItems: 'center',
        marginVertical: 10
    },
    productImage: {
        width: 150,
        height: 150,
        borderRadius: 10
    },
    productName: {
        fontSize: 12,
        textAlign: 'center',
        marginTop: 5
    },
    productPrice: {
        color: 'gray'
    },

    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 1,
        // marginTop: 10,
        backgroundColor: 'orange',
        color: '#fff',
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
