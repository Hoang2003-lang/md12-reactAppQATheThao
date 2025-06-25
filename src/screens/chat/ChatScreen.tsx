import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import Icon from 'react-native-vector-icons/Ionicons';

const ChatScreen = ({ navigation }: any) => {
  const [userId, setUserId] = useState('');
  const [chatId, setChatId] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef<Socket | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const API_URL = 'http://10.0.2.2:3001'; // Đổi thành IP thật nếu dùng máy thật
  const adminId = '683e9c91e2aa5ca0fbfb1030';


  useEffect(() => {
    const initializeChat = async () => {
      const uid = await AsyncStorage.getItem('userId');
      console.log("📦 UserId từ AsyncStorage:", uid);
      if (!uid) return;

      setUserId(uid);

      // Gọi API tạo hoặc lấy chatId giữa user và admin
      try {
        const res = await axios.post(`${API_URL}/api/chats/create`, {
          participants: [uid, adminId]
        });
        setChatId(res.data.data._id);
      } catch (err) {
        console.error('❌ Không lấy được chatId:', err);
      }
    };

    initializeChat();
  }, []);

  // 1️⃣ Khởi tạo socket và lắng nghe message mới
  useEffect(() => {
    if (!chatId) return;

    socketRef.current = io(API_URL);

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected');
      socketRef.current?.emit('join chat', chatId);
    });

    socketRef.current.on('new message', (msg: any) => {
      const rawMsg = msg.message;
      const normalizedMsg = {
        ...rawMsg,
        senderId: rawMsg.senderId || rawMsg.sender?._id || rawMsg.sender || '',
      };
      setMessages(prev => [...prev, normalizedMsg]);

      console.log('✅ SOCKET MSG:', JSON.stringify(normalizedMsg, null, 2));


    });

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [chatId]);

  // Lấy lịch sử tin nhắn
  useEffect(() => {
    if (!chatId) return;

    axios.get(`${API_URL}/api/chats/${chatId}`)
      .then(res => {
        console.log('📦 API response:', res.data);

        const rawMessages = res.data?.data?.messages || [];

        const normalized = rawMessages.map((msg: any) => ({
          ...msg,
          senderId: msg.senderId || msg.sender?._id || msg.sender || '',
        }));

        setMessages(normalized);


      })
      .catch(err => {
        console.error('❌ Lỗi khi load lịch sử:', err);
      });
  }, [chatId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const msgData = {
      chatId,
      senderId: userId,
      content: message
    };

    try {
      // await axios.post(`${API_URL}/api/chats/message`, msgData);

      const tempMsg = {
        chatId,
        senderId: userId,
        content: message,
        timestamp: new Date().toISOString(),
        isRead: false,
        // _local: true
      };
      // setMessages(prev => [...prev, tempMsg]);


      socketRef.current?.emit('send message', msgData);
      // setMessages(prev => [...prev, sentMsg]);

      setMessage('');

    } catch (err) {
      console.error('❌ Không gửi được tin nhắn:', err);
    }
  };

  // Tự động cuộn xuống cuối danh sách tin nhắn khi có tin mới
  useEffect(() => {
  flatListRef.current?.scrollToEnd({ animated: true });
}, [messages]);


  if (!userId || !chatId) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Đang tải dữ liệu chat...</Text>
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="chevron-back" size={24} color="#000" />
        <Text style={styles.header}>Nhắn tin</Text>
      </TouchableOpacity>
      <FlatList
        ref={flatListRef}
        data={messages}
        removeClippedSubviews={false}
        keyExtractor={(_, index) => index.toString()}
        // keyExtractor={(item, index) => `${item.timestamp}-${item.content}-${index}`}
        renderItem={({ item }) => {
          const isUser = item.senderId?.toString() === userId?.toString();

          return (
            <View style={[styles.message, isUser ? styles.user : styles.admin]}>
              <Text>{item.content}</Text>
              <Text style={styles.time}>
                {new Date(item.timestamp).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          );
        }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tin nhắn..."
          value={message}
          onChangeText={setMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: 'white' }}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ChatScreen;

// 💅 Style gọn gàng
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  message: {
    marginVertical: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  time: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 20,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
  },
  input: {
    flex: 1,
    borderColor: '#CCC',
    borderWidth: 1,
    marginRight: 20,
    borderRadius: 6,
    padding: 8,
    marginLeft: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF', marginLeft: 8, paddingHorizontal: 16,
    paddingVertical: 8, borderRadius: 20
  },
  user: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  admin: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  content: {
    fontSize: 16,
    color: '#333',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 1,
    // marginTop: 10,
    backgroundColor: 'orange',
    color: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10,
    // backgroundColor: 'orange',
    // color: '#fff',
    textAlign: 'center',
  },
});