import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const fetchOrders = createAsyncThunk('orders/fetchAll', async (params = {}, { rejectWithValue }) => {
  try { 
    const res = await api.get('/orders/owner', { params }); 
    return res.data.data; 
  } catch (err) { 
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch orders'); 
  }
});

export const updateOrderStatus = createAsyncThunk('orders/updateStatus', async ({ id, status }, { rejectWithValue }) => {
  try { 
    const res = await api.patch(`/orders/owner/${id}/status`, { status }); 
    return res.data.data; 
  } catch (err) { 
    return rejectWithValue({ id, message: err.response?.data?.message || 'Failed to update status' }); 
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: { 
    items: [], 
    isLoading: false, 
    isActionLoading: false 
  },
  reducers: {
    optimisticStatusUpdate: (state, action) => {
      const { id, status } = action.payload;
      const order = state.items.find(o => o._id === id);
      if (order) {
        order.previousStatus = order.status; 
        order.status = status;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { 
        if (state.items.length === 0) state.isLoading = true; 
      })
      .addCase(fetchOrders.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.items = action.payload; 
      })
      .addCase(fetchOrders.rejected, (state) => { 
        state.isLoading = false; 
      })
      .addCase(updateOrderStatus.pending, (state) => { 
        state.isActionLoading = true; 
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const index = state.items.findIndex(o => o._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
        toast.success(`Order ${action.payload.status}`);
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isActionLoading = false;
        const id = action.meta.arg.id;
        const order = state.items.find(o => o._id === id);
        if (order && order.previousStatus) order.status = order.previousStatus;
        toast.error(action.payload?.message || 'Failed to update order status');
      });
  }
});

export const { optimisticStatusUpdate } = orderSlice.actions;
export default orderSlice.reducer;