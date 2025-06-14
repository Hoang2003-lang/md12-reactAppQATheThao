import axios from 'axios';

const API = axios.create({
  baseURL: 'http://192.168.1.23:3001/api', // ví dụ: http://192.168.1.10:3000 
  timeout: 10000,   
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;