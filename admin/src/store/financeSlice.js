import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- MOCK DATABASE ---
const MOCK_TRANSACTIONS = [
  { id: 'TXN-9001', date: '2026-02-19', canteen: 'Tech Bites', type: 'Payout', amount: 4500, status: 'Completed', method: 'NEFT' },
  { id: 'TXN-9002', date: '2026-02-19', canteen: 'System', type: 'Platform Fee', amount: 315, status: 'Completed', method: 'Internal' },
  { id: 'TXN-9003', date: '2026-02-18', canteen: 'Delhi Cafe', type: 'Payout', amount: 12500, status: 'Pending', method: 'RTGS' },
  { id: 'TXN-9004', date: '2026-02-18', canteen: 'Coffee Hub', type: 'Refund', amount: 150, status: 'Completed', method: 'UPI' },
  { id: 'TXN-9005', date: '2026-02-17', canteen: 'Mumbai Snacks', type: 'Payout', amount: 3200, status: 'Failed', method: 'IMPS' },
  { id: 'TXN-9006', date: '2026-02-17', canteen: 'System', type: 'Platform Fee', amount: 224, status: 'Completed', method: 'Internal' },
  { id: 'TXN-9007', date: '2026-02-16', canteen: 'Tech Bites', type: 'Payout', amount: 5100, status: 'Completed', method: 'NEFT' },
  { id: 'TXN-9008', date: '2026-02-15', canteen: 'Delhi Cafe', type: 'Payout', amount: 8400, status: 'Completed', method: 'RTGS' },
];

// --- ASYNC THUNKS ---
export const fetchFinanceData = createAsyncThunk(
  'finance/fetchData',
  async (filters, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate API delay

      let filteredTxs = [...MOCK_TRANSACTIONS];

      // Apply Filters
      if (filters?.type && filters.type !== 'All') {
        filteredTxs = filteredTxs.filter(tx => tx.type === filters.type);
      }
      if (filters?.status && filters.status !== 'All') {
        filteredTxs = filteredTxs.filter(tx => tx.status === filters.status);
      }

      // Calculate Metrics (Simulated backend aggregation)
      // In a real app, these would be calculated securely on the backend based on the date range
      const metrics = {
        totalVolume: 245000,        // Total money processed
        platformEarnings: 17150,    // Our 7% cut
        totalPayouts: 195000,       // Money successfully sent to owners
        pendingPayouts: 32850,      // Money owed to owners but not yet settled
      };

      return {
        metrics,
        transactions: filteredTxs,
        totalTxs: filteredTxs.length
      };
    } catch  {
      return rejectWithValue('Failed to fetch financial data');
    }
  }
);

const financeSlice = createSlice({
  name: 'finance',
  initialState: {
    metrics: null,
    transactions: [],
    totalTransactions: 0,
    commissionPercent: 7, // Read-only state for display
    isLoading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFinanceData.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFinanceData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.metrics = action.payload.metrics;
        state.transactions = action.payload.transactions;
        state.totalTransactions = action.payload.totalTxs;
      })
      .addCase(fetchFinanceData.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default financeSlice.reducer;