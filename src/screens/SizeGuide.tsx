import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

const SizeGuideScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Nút Back */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Hướng dẫn chọn size</Text>
      </View>

      <ScrollView>
        <Text style={styles.note}>
          Thông số trong bảng quy đổi kích cỡ này có thể sẽ {'\n'} chênh lệch 1-2 cm so với thực tế
        </Text>

        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.headerCell}>Size</Text>
            <Text style={styles.headerCell}>Vai (cm)</Text>
            <Text style={styles.headerCell}>Chiều dài áo (cm)</Text>
            <Text style={styles.headerCell}>Vòng ngực (cm)</Text>
            <Text style={styles.headerCell}>Eo (cm)</Text>
          </View>

          {[
            { size: 'S', vai: 41, dai: 63, nguc: 47, eo: 44 },
            { size: 'M', vai: 42, dai: 66, nguc: 48, eo: 45 },
            { size: 'L', vai: 42, dai: 68, nguc: 48, eo: 46 },
            { size: 'XL', vai: 43, dai: 71, nguc: 50, eo: 48 },
            { size: 'XXL', vai: 45, dai: 75, nguc: 55, eo: 50 },
          ].map((item, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{item.size}</Text>
              <Text style={styles.cell}>{item.vai}</Text>
              <Text style={styles.cell}>{item.dai}</Text>
              <Text style={styles.cell}>{item.nguc}</Text>
              <Text style={styles.cell}>{item.eo}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  note: {
    fontSize: 14,
    marginBottom: 20,
    color: 'black',
    width: 400,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 14,
    padding: 6,
    textAlign: 'center',
    backgroundColor: '#f2f2f2',
  },
  cell: {
    flex: 1,
    fontSize: 14,
    padding: 6,
    textAlign: 'center',
  },
});

export default SizeGuideScreen;