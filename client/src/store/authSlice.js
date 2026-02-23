import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../api/axios';

export const sendRegistrationOtp = createAsyncThunk('auth/sendOtp', async (formData, { rejectWithValue }) => {
  try {
    await api.post('/auth/customer/send-otp', { email: formData.email, name: formData.name });
    return formData; 
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Failed to send OTP"); }
});

export const verifyOtpAndRegister = createAsyncThunk('auth/verifyAndRegister', async ({ otp, userData }, { rejectWithValue }) => {
  try {
    await api.post('/auth/customer/verify-otp-only', { email: userData.email, otp });
    const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
    const token = await userCredential.user.getIdToken();

    const customerData = { ...userData };
    delete customerData.password; 

    const res = await api.post('/auth/customer/register', customerData, { headers: { Authorization: `Bearer ${token}` } });
    return res.data.data;
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') return rejectWithValue("Email is already registered.");
    return rejectWithValue(err.response?.data?.message || err.message || "Registration failed");
  }
});

export const loginCustomer = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    const res = await api.post('/auth/customer/login', {}, { headers: { Authorization: `Bearer ${token}` } });
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || "Invalid Email or Password"); }
});

export const fetchCustomerProfile = createAsyncThunk('auth/fetchProfile', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/profiles/customer'); 
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const forgotPassword = createAsyncThunk('auth/forgotPassword', async (email, { rejectWithValue }) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch { return rejectWithValue("Failed to send reset link."); }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await signOut(auth);
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, tempUserData: null, isAuthenticated: false, isLoading: true, error: null },
  reducers: {
    clearAuthError: (state) => { state.error = null; },
    setAuthLoading: (state, action) => { state.isLoading = action.payload; },
    logoutLocal: (state) => { state.user = null; state.isAuthenticated = false; state.isLoading = false; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendRegistrationOtp.fulfilled, (state, action) => { state.isLoading = false; state.tempUserData = action.payload; })
      .addCase(verifyOtpAndRegister.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; state.isAuthenticated = true; state.tempUserData = null; })
      .addCase(loginCustomer.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; state.isAuthenticated = true; })
      
      .addCase(fetchCustomerProfile.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCustomerProfile.fulfilled, (state, action) => { state.isLoading = false; state.user = action.payload; state.isAuthenticated = true; })
      .addCase(fetchCustomerProfile.rejected, (state) => { state.isLoading = false; state.user = null; state.isAuthenticated = false; })
      
      .addCase(logout.fulfilled, (state) => { state.user = null; state.isAuthenticated = false; state.tempUserData = null; })
      .addCase('profile/updateProfile/fulfilled', (state, action) => { state.user = action.payload; })
      .addCase('profile/deleteAccount/fulfilled', (state) => { state.user = null; state.isAuthenticated = false; });
  }
});

export const { clearAuthError, setAuthLoading, logoutLocal } = authSlice.actions;
export default authSlice.reducer;