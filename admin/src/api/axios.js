import axios from 'axios';
import { auth } from '../config/firebase.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to attach Firebase ID Token
api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      // Force refresh false, fetches cached token if valid
      const token = await user.getIdToken(); 
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-user-role'] = 'admin';  
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;