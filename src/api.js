import axios from 'axios';

// Đổi IP này thành IP LAN của máy tính bạn, hoặc dùng 10.0.2.2 nếu chạy trên Android Emulator
const BASE_URL = 'http://192.168.0.103:3001/api'; // hoặc 'http://10.0.2.2:3001/api'

const API = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để log lỗi (tuỳ chọn)
API.interceptors.response.use(
  response => response,
  error => {
    console.error('API error:', error);
    return Promise.reject(error);
  }
);

export default API;