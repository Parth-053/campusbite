import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Place the order
export const placeOrder = createAsyncThunk(
  'order/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      return {
        id: `ORD-${Math.floor(Math.random() * 100000)}`,
        ...orderData,
        status: 'Pending', // Statuses: Pending -> Preparing -> Ready -> Completed
        date: new Date().toISOString(),
      };
    } catch {
      return rejectWithValue('Failed to place order');
    }
  }
);

// Process Online Payment
export const processPayment = createAsyncThunk(
  'order/processPayment',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate Payment Gateway
      return 'Completed'; // Once paid online, status becomes Completed
    } catch  {
      return rejectWithValue('Payment Failed');
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    activeOrder: null, // Stores the current ongoing order
    isLoading: false,
    isPaying: false,
    error: null,
  },
  reducers: {
    // DEV TOOL: To simulate the canteen owner changing the status from their end
    simulateStatusUpdate: (state, action) => {
      if (state.activeOrder) {
        state.activeOrder.status = action.payload;
      }
    },
    clearActiveOrder: (state) => {
      state.activeOrder = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => { state.isLoading = true; })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.activeOrder = action.payload;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(processPayment.pending, (state) => { state.isPaying = true; })
      .addCase(processPayment.fulfilled, (state, action) => {
        state.isPaying = false;
        if (state.activeOrder) state.activeOrder.status = action.payload;
      })
      .addCase(processPayment.rejected, (state, action) => {
        state.isPaying = false;
        state.error = action.payload;
      });
  }
});

export const { simulateStatusUpdate, clearActiveOrder } = orderSlice.actions;
export default orderSlice.reducer;