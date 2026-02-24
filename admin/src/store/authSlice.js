import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../api/axios';
 
export const loginAdmin = createAsyncThunk(
  'auth/loginAdmin',
  async ({ email, password }, { rejectWithValue }) => {
    try { 
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
       
      const token = await user.getIdToken();
      localStorage.setItem('token', token); // 🚀 FIXED: Save token to localStorage on login
       
      const response = await api.post('/auth/admin/login', {}, {
        headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'admin' }
      });
      
      return response.data.data;  
    } catch (error) { 
      const errorMessage = error.response?.data?.message || error.message || 'Invalid admin credentials';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutAdmin = createAsyncThunk(
  'auth/logoutAdmin',
  async (_, { rejectWithValue }) => {
    try {
      await signOut(auth);
      localStorage.removeItem('token'); // 🚀 FIXED: Remove token on logout
      localStorage.removeItem('admin');
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  admin: localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')) : null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login Cases
      .addCase(loginAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.admin = action.payload;
        localStorage.setItem('admin', JSON.stringify(action.payload));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Logout Cases
      .addCase(logoutAdmin.fulfilled, (state) => {
        state.admin = null;
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;