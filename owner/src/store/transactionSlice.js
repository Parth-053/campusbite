import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const MOCK_HISTORY = [
  { id: 't1', type: 'credit', orderId: '#ORD-001', amount: 120, date: '2023-10-25T10:30:00', status: 'Success' },
  { id: 't2', type: 'credit', orderId: '#ORD-002', amount: 350, date: '2023-10-25T11:15:00', status: 'Success' },
  { id: 't3', type: 'debit', orderId: null, amount: 2000, date: '2023-10-24T18:00:00', status: 'Processing' }, // Withdrawal
  { id: 't4', type: 'credit', orderId: '#ORD-005', amount: 80, date: '2023-10-23T09:00:00', status: 'Success' },
];

export const fetchWalletData = createAsyncThunk('transaction/fetch', async (_, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      balance: 1250, // Current Wallet Balance
      commission: 7, // 7% Admin Commission
      minWithdraw: 500,
      history: MOCK_HISTORY
    };
  } catch {
    return rejectWithValue('Failed to load wallet');
  }
});

export const requestWithdrawal = createAsyncThunk('transaction/withdraw', async (amount, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    return {
      id: `t${Date.now()}`,
      type: 'debit',
      amount: amount,
      date: new Date().toISOString(),
      status: 'Pending'
    };
  } catch{
    return rejectWithValue('Withdrawal failed');
  }
});

const initialState = {
  balance: 0,
  commission: 7,
  minWithdraw: 500,
  history: [],
  isLoading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Fetch Data
    builder
      .addCase(fetchWalletData.pending, (state) => { state.isLoading = true; })
      .addCase(fetchWalletData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance = action.payload.balance;
        state.commission = action.payload.commission;
        state.minWithdraw = action.payload.minWithdraw;
        state.history = action.payload.history;
      })
      .addCase(fetchWalletData.rejected, (state) => { state.isLoading = false; });

    // Withdrawal
    builder
      .addCase(requestWithdrawal.pending, (state) => { state.isLoading = true; })
      .addCase(requestWithdrawal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.balance -= action.payload.amount; // Deduct from balance
        state.history.unshift(action.payload); // Add to history
      });
  }
});

export default transactionSlice.reducer;