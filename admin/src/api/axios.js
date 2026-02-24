import axios from 'axios';
import { auth } from '../config/firebase';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8001/api/v1',
  // 🚀 FIXED: Removed hardcoded 'Content-Type: application/json' 
  // Axios is smart enough to set multipart/form-data when you send images!
});

const getFirebaseToken = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      unsubscribe(); 
      if (user) {
        try {
          const token = await user.getIdToken();
          resolve(token);
        } catch  { resolve(null); }
      } else { resolve(null); }
    });
  });
};

api.interceptors.request.use(
  async (config) => { 
    let token = null;

    if (auth.currentUser) {
      token = await auth.currentUser.getIdToken();
    } else {
      token = await getFirebaseToken();
    }

    if (!token) {
      token = localStorage.getItem('token');
    } else {
      localStorage.setItem('token', token);
    }
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-user-role'] = 'admin'; 
    }

    // 🚀 FIXED: Make sure we don't accidentally force JSON when sending files
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    } else if (!config.headers['Content-Type']) {
      config.headers['Content-Type'] = 'application/json';
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      if (window.location.pathname !== '/login') window.location.href = '/login'; 
    }
    return Promise.reject(error);
  }
);

export default api;