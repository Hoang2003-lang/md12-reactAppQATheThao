import axios from 'axios';
import { BASE_URL } from './constants';

const API = axios.create({
<<<<<<< HEAD
  baseURL: 'http://192.168.194.88:3002/api', // ví dụ: http://192.168.1.10:3000 
  timeout: 10000,   
=======
  baseURL: `${BASE_URL}/api`,
  timeout: 10000,
>>>>>>> 5b324896eddaafe3d5c029514ec5d36e1e3b4538
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;