import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../api/axios';

// 1. REGISTER
export const registerOwnerAccount = createAsyncThunk('auth/registerOwner', async (dataObj, { rejectWithValue }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, dataObj.personal.email, dataObj.personal.password);
    const token = await userCredential.user.getIdToken();

    const formData = new FormData();
    formData.append('personal', JSON.stringify(dataObj.personal));
    formData.append('payment', JSON.stringify(dataObj.payment));
    
    const { image, ...restCanteen } = dataObj.canteen;
    formData.append('canteen', JSON.stringify(restCanteen));
    if (image) formData.append('image', image); 

    const res = await api.post('/auth/owner/register', formData, { 
      headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'owner' }
    });
    
    return { data: res.data.data, email: dataObj.personal.email };
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') return rejectWithValue("Email is already registered.");
    return rejectWithValue(err.response?.data?.message || err.message || "Registration failed");
  }
});

// 2. VERIFY OTP
export const verifyOwnerEmail = createAsyncThunk('auth/verifyEmail', async ({ otp }, { rejectWithValue }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    const token = await user.getIdToken();
    
    const res = await api.post('/auth/owner/verify-email', { otp }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || err.message || "Verification failed");
  }
});

// 3. RESEND OTP
export const resendOTP = createAsyncThunk('auth/resendOTP', async (_, { rejectWithValue }) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("No user logged in");
    const token = await user.getIdToken();
    
    const res = await api.post('/auth/owner/resend-otp', {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Failed to resend OTP");
  }
});

// 4. LOGIN
export const loginOwner = createAsyncThunk('auth/loginOwner', async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    
    // Auth
    await api.post('/auth/owner/login', {}, { 
      headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'owner' } 
    });
     
    const res = await api.get('/profiles/owner');
    return res.data.data;
  } catch (err) {
    if (err.code === 'auth/invalid-credential') return rejectWithValue("Invalid email or password.");
    return rejectWithValue(err.response?.data?.message || err.message || "Login failed");
  }
});

// 5. RESTORE SESSION
export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try { 
    const res = await api.get('/profiles/owner');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Session expired");
  }
});

// 6. LOGOUT
export const logoutOwner = createAsyncThunk('auth/logoutOwner', async (_, { rejectWithValue }) => {
  try {
    await signOut(auth);
    return true;
  } catch  {
    return rejectWithValue("Logout failed");
  }
});

// 7. RESET PASSWORD
export const resetPassword = createAsyncThunk('auth/resetPassword', async (email, { rejectWithValue }) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (err) {
    if (err.code === 'auth/user-not-found') return rejectWithValue("Email not found");
    return rejectWithValue(err.message || "Failed to send reset email");
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    ownerData: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    registrationStep: 1, 
    registeredEmail: null 
  },
  reducers: {
    setRegistrationStep: (state, action) => { state.registrationStep = action.payload; },
    clearAuthError: (state) => { state.error = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerOwnerAccount.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerOwnerAccount.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.registeredEmail = action.payload.email; 
        state.registrationStep = 4;  
      })
      .addCase(registerOwnerAccount.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(verifyOwnerEmail.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyOwnerEmail.fulfilled, (state) => { 
        state.isLoading = false; 
        if(state.ownerData) state.ownerData.isVerified = true; 
        state.registrationStep = 5;  
      })
      .addCase(verifyOwnerEmail.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(loginOwner.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginOwner.fulfilled, (state, action) => { 
        state.isLoading = false;  
        state.ownerData = action.payload?.owner || action.payload; 
        state.isAuthenticated = true; 
      })
      .addCase(loginOwner.rejected, (state, action) => { 
        state.isLoading = false; 
        state.error = action.payload; 
        signOut(auth); 
      }) 

      .addCase(restoreSession.fulfilled, (state, action) => {  
        state.ownerData = action.payload?.owner || action.payload; 
        state.isAuthenticated = true; 
      })
      .addCase(restoreSession.rejected, (state) => { 
        state.ownerData = null; 
        state.isAuthenticated = false; 
      })
      
      .addCase(logoutOwner.fulfilled, (state) => { 
        state.ownerData = null; 
        state.isAuthenticated = false; 
        state.registrationStep = 1; 
      });
  }
});

export const { setRegistrationStep, clearAuthError } = authSlice.actions;
export default authSlice.reducer;