import axios from 'axios';
import { auth } from '../config/firebase.js';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken(); 
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-user-role'] = 'customer';  
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;