import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const fetchWalletData = createAsyncThunk('transactions/fetchWallet', async (_, { rejectWithValue }) => {
  try { 
    const res = await api.get('/transactions/wallet'); 
    return res.data.data; 
  } catch (err) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch wallet data'); 
  }
});

export const requestWithdrawal = createAsyncThunk('transactions/withdraw', async (amount, { rejectWithValue }) => {
  try { 
    const res = await api.post('/transactions/withdraw', { amount }); 
    return res.data.data; 
  } catch (err) { 
    return rejectWithValue(err.response?.data?.message || 'Withdrawal failed'); 
  }
});

const transactionSlice = createSlice({
  name: 'transactions',
  initialState: {
    wallet: { availableBalance: 0, totalWithdrawn: 0, grossEarnings: 0, minWithdrawalLimit: 500, commissionRatePercent: 10 },
    orderHistory: [],
    withdrawalHistory: [],
    isLoading: false,
    isActionLoading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWalletData.pending, (state) => { state.isLoading = true; })
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wallet = action.payload.wallet;
        state.orderHistory = action.payload.orderHistory;
        state.withdrawalHistory = action.payload.withdrawalHistory;
      })
      .addCase(fetchWalletData.rejected, (state) => { state.isLoading = false; })
      
      .addCase(requestWithdrawal.pending, (state) => { state.isActionLoading = true; })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.isActionLoading = false;
        // Instant UI update
        state.wallet.availableBalance -= action.payload.amountRequested;
        state.wallet.totalWithdrawn += action.payload.amountRequested;
        state.withdrawalHistory.unshift(action.payload);
        toast.success(`Successfully requested ₹${action.payload.amountRequested}`);
      })
      .addCase(requestWithdrawal.rejected, (state, action) => {
        state.isActionLoading = false;
        toast.error(action.payload || 'Action failed');
      });
  }
});

export default transactionSlice.reducer;