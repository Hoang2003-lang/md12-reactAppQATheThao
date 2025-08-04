import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  InteractionManager,
} from 'react-native';

const allNotifications = [
  { id: '1', time: '10 phút trước', message: 'Đặt hàng thành công #A123', isRead: false },
  { id: '2', time: '1 giờ trước', message: 'Đơn hàng #A122 đang được giao', isRead: false },
  { id: '3', time: '3 giờ trước', message: 'Flash Sale 50% áo sơ mi', isRead: true },
  { id: '4', time: 'Hôm qua', message: ' Mã giảm 20%: SALE20', isRead: true },
  { id: '5', time: '2 ngày trước', message: 'SKH phản hồi đơn #A120', isRead: true },
];

const NotificationScreen = ({ navigation }: any) => {
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [showUI, setShowUI] = useState(false);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setShowUI(true);
    });
    return () => task.cancel();
  }, []);

  const filtered = allNotifications.filter((item) =>
    filter === 'read' ? item.isRead : filter === 'unread' ? !item.isRead : true
  );

  const renderItem = ({ item }: any) => (
    <View style={styles.notificationItem}>
      <Text style={styles.message}>{item.message}</Text>
      <Text style={styles.time}>{item.time}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông Báo</Text>
        <View style={styles.filterGroup}>
          <TouchableOpacity onPress={() => setFilter('unread')}>
            <Text style={[styles.filterText, filter === 'unread' && styles.activeFilter]}>Chưa đọc</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setFilter('read')}>
            <Text style={[styles.filterText, filter === 'read' && styles.activeFilter]}>Đã đọc</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showUI && (
        <FlatList
          data={filtered}
          renderItem={renderItem}
          keyExtractor={(item) => `notif-${item.id}`}
          contentContainerStyle={styles.list}
          removeClippedSubviews={false}
          initialNumToRender={5}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: 'orange',
    paddingTop: 30,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: { fontSize: 30, color: '#fff', marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff', flex: 1 },
  filterGroup: { flexDirection: 'row' },
  filterText: { color: '#fff', marginLeft: 10, fontWeight: '600' },
  activeFilter: { textDecorationLine: 'underline' },
  list: { padding: 16, paddingBottom: 30 },
  notificationItem: {
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  message: { fontSize: 16, color: '#333' },
  time: { fontSize: 12, color: '#888', marginTop: 6 },
});

export default NotificationScreen;
