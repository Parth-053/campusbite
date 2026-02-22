import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001/api/v1',
});

api.interceptors.request.use(
  async (config) => {
    await auth.authStateReady(); 
    
    const user = auth.currentUser;
    
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
      
      config.headers['x-user-role'] = 'owner'; 
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;