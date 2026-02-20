import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data with Customer Details
const MOCK_ORDERS = [
  { 
    id: 'ord_1', token: 'A-101', customerName: 'Rahul Sharma', mobile: '9876543210', status: 'Pending', total: 140, paymentMode: 'Online', isPaid: true, timestamp: new Date().toISOString(),
    items: [{ name: 'Veg Burger', qty: 1, price: 60 }, { name: 'Cold Coffee', qty: 1, price: 80 }]
  },
  { 
    id: 'ord_2', token: 'B-205', customerName: 'Priya Singh', mobile: '9123456789', status: 'Preparing', total: 120, paymentMode: 'Cash', isPaid: false, timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    items: [{ name: 'Chicken Wrap', qty: 1, price: 120 }]
  },
  { 
    id: 'ord_3', token: 'C-310', customerName: 'Amit Verma', mobile: '9988776655', status: 'Ready', total: 50, paymentMode: 'Online', isPaid: true, timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    items: [{ name: 'French Fries', qty: 1, price: 50 }]
  },
  { 
    id: 'ord_4', token: 'D-415', customerName: 'Sneha Gupta', mobile: '8877665544', status: 'Completed', total: 200, paymentMode: 'Online', isPaid: true, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    items: [{ name: 'Veg Biryani', qty: 1, price: 150 }, { name: 'Veg Burger', qty: 1, price: 50 }]
  },
];

// Async Thunk to fetch orders
export const fetchOrders = createAsyncThunk('order/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    return MOCK_ORDERS;
  } catch  {
    return rejectWithValue('Failed to fetch orders');
  }
});

const initialState = {
  orders: [],
  isLoading: false,
  error: null,
  filter: 'All', 
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderFilter: (state, action) => {
      state.filter = action.payload;
    },
    advanceOrderStatus: (state, action) => {
      const { orderId } = action.payload;
      const order = state.orders.find(o => o.id === orderId);
      
      if (order) {
        if (order.status === 'Pending') order.status = 'Preparing';
        else if (order.status === 'Preparing') order.status = 'Ready';
        else if (order.status === 'Ready') order.status = 'Completed';
      }
    },
    markAsPaid: (state, action) => {
      const order = state.orders.find(o => o.id === action.payload);
      if (order) order.isPaid = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setOrderFilter, advanceOrderStatus, markAsPaid } = orderSlice.actions;
export default orderSlice.reducer;