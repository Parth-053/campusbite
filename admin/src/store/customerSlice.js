import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import toast from 'react-hot-toast';

// Fetch all customers from backend
export const fetchCustomers = createAsyncThunk('customer/fetchCustomers', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/admin/customers');
    return res.data.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch customers');
  }
});

// Toggle Ban/Block status (Assuming you will add this route in backend later)
export const toggleCustomerStatus = createAsyncThunk('customer/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/admin/customers/${id}/status`);
    toast.success("Customer status updated successfully");
    return res.data.data;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to update status');
    return rejectWithValue(err.response?.data?.message);
  }
});

// Delete customer
export const deleteCustomer = createAsyncThunk('customer/deleteCustomer', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/admin/customers/${id}`);
    toast.success("Customer deleted successfully");
    return id;
  } catch (err) {
    toast.error(err.response?.data?.message || 'Failed to delete customer');
    return rejectWithValue(err.response?.data?.message);
  }
});

const customerSlice = createSlice({
  name: 'customer',
  initialState: { 
    customers: [], 
    currentCustomer: null, 
    isLoading: false, 
    isDetailLoading: false, 
    error: null 
  },
  reducers: {
    setCurrentCustomer: (state, action) => {
      state.currentCustomer = state.customers.find(c => c._id === action.payload) || null;
    },
    clearCurrentCustomer: (state) => {
      state.currentCustomer = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCustomers.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCustomers.fulfilled, (state, action) => { 
        state.isLoading = false; 
        state.customers = action.payload; 
      })
      .addCase(fetchCustomers.rejected, (state, action) => { 
        state.isLoading = false; 
        state.error = action.payload; 
      })
      
      // Delete
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.customers = state.customers.filter(c => c._id !== action.payload);
      })
      
      // Toggle Status
      .addCase(toggleCustomerStatus.fulfilled, (state, action) => {
        const index = state.customers.findIndex(c => c._id === action.payload._id);
        if (index !== -1) state.customers[index] = action.payload;
        if (state.currentCustomer?._id === action.payload._id) {
          state.currentCustomer = action.payload;
        }
      });
  }
});

export const { setCurrentCustomer, clearCurrentCustomer } = customerSlice.actions;
export default customerSlice.reducer;