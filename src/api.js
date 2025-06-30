import axios from 'axios';

const API = axios.create({
<<<<<<< HEAD
  baseURL: 'http://192.168.0.104:3001/api', // ví dụ: http://192.168.1.10:3000 
=======
  baseURL: 'http://10.0.2.2:3001/api', // ví dụ: http://192.168.1.10:3000 
>>>>>>> 0a1a0a9aa998b1f85c2dbbf36a44a28aafea2dec
  timeout: 10000,   
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;