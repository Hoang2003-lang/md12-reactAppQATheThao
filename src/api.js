import axios from 'axios';

const API = axios.create({
<<<<<<< HEAD



  baseURL: 'http://192.168.0.104:3001/api', // ví dụ: http://192.168.1.10:3000 

=======
  baseURL: 'http://192.168.0.17:3001/api', // ví dụ: http://192.168.1.10:3000 
>>>>>>> 530d472b13d77c8a1c3e04eabf2bf0df032dfa2a
  timeout: 10000,   
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;