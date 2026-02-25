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
      headers: { Authorization: `Bearer ${token}`, 'x-user-role': 'owner', 'Content-Type': 'multipart/form-data' }
    });
    
    return { data: res.data.data, email: dataObj.personal.email };
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') return rejectWithValue("Email is already registered.");
      
    const validationErrors = err.response?.data?.errors;
    const errorMessage = validationErrors && validationErrors.length > 0 
      ? validationErrors[0] 
      : (err.response?.data?.message || err.message);

    return rejectWithValue(errorMessage);
  }
});

// 2. VERIFY OTP
export const verifyOwnerEmail = createAsyncThunk('auth/verifyEmail', async ({ otp }, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/owner/verify-email', { otp });
    return res.data.data;
  } catch (err) { 
    return rejectWithValue(err.response?.data?.message || err.message); 
  }
});

// 3. RESEND OTP
export const resendOwnerOtp = createAsyncThunk('auth/resendOtp', async (_, { rejectWithValue }) => {
  try {
    const res = await api.post('/auth/owner/resend-otp');
    return res.data.message;
  } catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

// 4. LOGIN
export const loginOwner = createAsyncThunk('auth/loginOwner', async ({ email, password }, { rejectWithValue }) => {
  try {
    await signInWithEmailAndPassword(auth, email, password); 
    const res = await api.get('/profiles/owner'); 
    return res.data.data;
  } catch (err) { 
    return rejectWithValue(err.response?.data?.message || "Invalid Email or Password"); 
  }
});

// 5. RESET PASSWORD
export const resetOwnerPassword = createAsyncThunk('auth/resetPassword', async (email, { rejectWithValue }) => {
  try { await sendPasswordResetEmail(auth, email); return true; } 
  catch (err) { return rejectWithValue(err.message); }
});

// 6. LOGOUT
export const logoutOwner = createAsyncThunk('auth/logoutOwner', async () => {
  try { await signOut(auth); return null; } catch  { return null; }
});

// 7. RESTORE SESSION
export const restoreSession = createAsyncThunk('auth/restoreSession', async (_, { rejectWithValue }) => {
  try { 
    const res = await api.get('/profiles/owner'); 
    return res.data.data;
  } catch (err) { 
    return rejectWithValue(err.response?.data?.message || err.message); 
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: { registrationStep: 1, ownerData: null, isAuthenticated: false, isLoading: false, error: null, tempEmail: '' },
  reducers: { 
    setStep: (state, action) => { state.registrationStep = action.payload; }, 
    resetAuthError: (state) => { state.error = null; } 
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerOwnerAccount.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(registerOwnerAccount.fulfilled, (state, action) => { 
        state.isLoading = false; state.ownerData = action.payload.data; state.tempEmail = action.payload.email; state.registrationStep = 4; 
      })
      .addCase(registerOwnerAccount.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(verifyOwnerEmail.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(verifyOwnerEmail.fulfilled, (state) => { 
        state.isLoading = false; if(state.ownerData) state.ownerData.isVerified = true; state.registrationStep = 5; 
      })
      .addCase(verifyOwnerEmail.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; })
      
      .addCase(loginOwner.pending, (state) => { state.isLoading = true; state.error = null; })
      .addCase(loginOwner.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.ownerData = action.payload?.owner || action.payload; 
        state.isAuthenticated = true; 
      })
      .addCase(loginOwner.rejected, (state, action) => { state.isLoading = false; state.error = action.payload; signOut(auth); }) 

      .addCase(restoreSession.fulfilled, (state, action) => { 
        state.ownerData = action.payload?.owner || action.payload; 
        state.isAuthenticated = true; 
      })
      .addCase(restoreSession.rejected, (state) => { 
        state.ownerData = null; 
        state.isAuthenticated = false; 
      })
      
      .addMatcher((action) => action.type === logoutOwner.fulfilled.type, (state) => { 
        state.ownerData = null; state.isAuthenticated = false; state.registrationStep = 1; 
      });
  }
});

export const { setStep, resetAuthError } = authSlice.actions;
export default authSlice.reducer;