// src/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Image, Dimensions, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'
import { useState } from 'react';
import API from '../api';
import { Modal } from 'react-native';


const { width } = Dimensions.get('window');



const SearchScreen = ({ navigation }: any) => {
    const [searchText, setSearchText] = useState('');
    const [results, setResults] = useState([]);
    const [typingTimeout, setTypingTimeout] = useState<any>(null);
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [showRangeModal, setShowRangeModal] = useState(false);
    const [selectedRangeLabel, setSelectedRangeLabel] = useState('Chọn khoảng giá');

    const fetchProducts = async (query: string) => {
        try {
            const params: any = {
                keyword: query,
            };
            if (minPrice) params.minPrice = minPrice.replace(/\./g, '');
            if (maxPrice) params.maxPrice = maxPrice.replace(/\./g, '');


            const response = await API.get('/products/search', { params });
            setResults(response.data);
        } catch (error) {
            console.error('Lỗi khi gọi API:', error);
        }
    };

    const handleSearchChange = (text: string) => {
        setSearchText(text);

        if (typingTimeout) clearTimeout(typingTimeout);

        const timeout = setTimeout(() => {
            if (text.trim()) {
                fetchProducts(text);
            } else {
                setResults([]);
            }
        }, 500);

        setTypingTimeout(timeout);
    };

    const renderItem = ({ item }: { item: { _id: string, name: string, price: number, image: string } }) => (
        <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('ProductDetail', { productId: item._id })}>
            <Image source={{ uri: item.image }} style={styles.image} />
            <View>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>{item.price.toLocaleString()}đ</Text>
            </View>
        </TouchableOpacity>
    );

    const priceRanges = [
        { label: 'Dưới 100.000đ', min: '0', max: '100000' },
        { label: '100.000đ - 300.000đ', min: '100000', max: '300000' },
        { label: '300.000đ - 500.000đ', min: '300000', max: '500000' },
        { label: 'Trên 500.000đ', min: '500000', max: '' },
        { label: 'Tất cả', min: '0', max: '9999999999999999999999' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tìm kiếm sản phẩm</Text>
            </View>

            <View style={styles.searchContainer}>
                <Icon name="search-outline" size={20} color="#888" style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Tìm kiếm sản phẩm ..."
                    style={styles.searchInput}
                    value={searchText}
                    onChangeText={handleSearchChange}
                />

            </View>

            <View style={styles.priceRangeContainer}>

                <View style={styles.priceFilterRow}>
                    <Text style={styles.filterTitle}>Tìm theo giá:</Text>

                    <TouchableOpacity style={styles.rangeSelector} onPress={() => setShowRangeModal(true)}>
                        <Text style={styles.rangeText}>{selectedRangeLabel}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => {
                            if (!minPrice.trim() || !maxPrice.trim()) {
                                setResults([]); // Xóa kết quả cũ
                            } else {
                                fetchProducts(searchText);
                            }
                        }}
                        style={{
                            marginLeft: 8,
                            backgroundColor: '#007bff',
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            justifyContent: 'center',
                            height: 40,
                        }}
                    >
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Lọc</Text>
                    </TouchableOpacity>
                </View>

                <Modal visible={showRangeModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            {priceRanges.map((range, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={styles.modalItem}
                                    onPress={() => {
                                        setMinPrice(range.min);
                                        setMaxPrice(range.max);
                                        setSelectedRangeLabel(range.label);
                                        setShowRangeModal(false);
                                    }}
                                >
                                    <Text style={styles.modalItemText}>{range.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                </Modal>


            </View>



            <FlatList
                data={results}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                ListEmptyComponent={
                    <Text style={styles.noResults}>Không tìm thấy sản phẩm nào</Text>
                }
            />

        </View>


    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
        padding: 10,
        position: 'relative',
        backgroundColor: 'orange'
    },

    backIcon: {
        position: 'absolute',
        left: 0,
        paddingHorizontal: 10,
    },

    headerTitle: {
        fontSize: 23,
        fontWeight: 'bold',
        textAlign: 'center',
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#ccc',
        marginHorizontal: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 12,
        backgroundColor: '#f9f9f9',
    },
    image: {
        width: 60,
        height: 60,
        marginRight: 10,
        borderRadius: 8,
    },
    productName: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    productPrice: {
        fontSize: 13,
        color: '#555',
    },
    noResults: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
    },
    priceRangeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 16,
        justifyContent: 'space-between',
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },

    modalContent: {
        backgroundColor: '#fff',
        width: '80%',
        borderRadius: 10,
        padding: 15,
        elevation: 5,
    },

    modalItem: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },

    modalItemText: {
        fontSize: 16,
        color: '#333',
        textAlign: 'center',
    },

    priceFilterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        marginBottom: 12,
    },

    filterTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginRight: 10,
        width: 100,
    },

    rangeSelector: {
        flex: 1,
        height: 44,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 10,
        justifyContent: 'center',
        paddingHorizontal: 12,
        backgroundColor: '#f9f9f9',
    },

    rangeText: {
        fontSize: 15,
        color: '#333',
    },
});



