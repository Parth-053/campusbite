import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Helper to generate a date relative to today
const getRelativeDate = (daysOffset) => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split('T')[0]; // YYYY-MM-DD
};

// --- MOCK DATABASE ---
const MOCK_ORDERS = [
  { id: 'ORD-1001', canteen: 'Tech Bites', college: 'Pune Institute of Technology', user: 'Student A', amount: 250, status: 'Completed', date: getRelativeDate(0), paymentMode: 'UPI', items: [{ name: 'Veg Burger', qty: 2, price: 50 }, { name: 'Cold Coffee', qty: 3, price: 50 }] },
  { id: 'ORD-1002', canteen: 'Coffee Hub', college: 'Mumbai University', user: 'Student B', amount: 120, status: 'Pending', date: getRelativeDate(0), paymentMode: 'Card', items: [{ name: 'Sandwich', qty: 1, price: 80 }, { name: 'Tea', qty: 2, price: 20 }] },
  { id: 'ORD-1003', canteen: 'Delhi Cafe', college: 'Delhi Tech', user: 'Student C', amount: 450, status: 'Cancelled', date: getRelativeDate(-1), paymentMode: 'Cash', items: [{ name: 'Pizza', qty: 1, price: 300 }, { name: 'Fries', qty: 1, price: 150 }] },
  { id: 'ORD-1004', canteen: 'Tech Bites', college: 'Pune Institute of Technology', user: 'Student D', amount: 80, status: 'Completed', date: getRelativeDate(-5), paymentMode: 'UPI', items: [{ name: 'Samosa', qty: 4, price: 20 }] },
  { id: 'ORD-1005', canteen: 'Coffee Hub', college: 'Mumbai University', user: 'Student A', amount: 300, status: 'Completed', date: getRelativeDate(-20), paymentMode: 'UPI', items: [{ name: 'Pasta', qty: 2, price: 150 }] },
  { id: 'ORD-1006', canteen: 'Delhi Cafe', college: 'Delhi Tech', user: 'Student B', amount: 500, status: 'Completed', date: getRelativeDate(-400), paymentMode: 'Card', items: [{ name: 'Thali', qty: 2, price: 250 }] },
];

// --- ASYNC THUNKS ---
export const fetchOrders = createAsyncThunk('order/fetchOrders', async (filters, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
    let filtered = [...MOCK_ORDERS];
    
    // Status Filter
    if (filters?.status && filters.status !== 'All') {
      filtered = filtered.filter(o => o.status === filters.status);
    }

    // Duration Filter Logic
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filters?.duration) {
      filtered = filtered.filter(o => {
        const orderDate = new Date(o.date);
        orderDate.setHours(0, 0, 0, 0);
        const diffTime = Math.abs(today - orderDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.duration) {
          case 'Today': return diffDays === 0;
          case 'Yesterday': return diffDays === 1;
          case 'Last Week': return diffDays <= 7;
          case 'Last Month': return diffDays <= 30;
          case 'Last Year': return diffDays <= 365;
          case 'Custom': 
            return filters.customDate ? o.date === filters.customDate : true;
          default: return true;
        }
      });
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    return { orders: filtered, totalCount: filtered.length };
  } catch  {
    return rejectWithValue('Failed to fetch orders');
  }
});

export const fetchOrderById = createAsyncThunk('order/fetchById', async (id, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    const order = MOCK_ORDERS.find(o => o.id === id);
    if (!order) throw new Error("Order not found");
    return order;
  } catch   {
    return rejectWithValue('Order not found');
  }
});

// --- SLICE ---
const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [], totalOrders: 0,
    currentOrder: null,
    isLoading: false, isDetailLoading: false, error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => { state.currentOrder = null; }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.totalCount; 
      });

    builder
      .addCase(fetchOrderById.pending, (state) => { state.isDetailLoading = true; })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isDetailLoading = false; 
        state.currentOrder = action.payload;
      });
  }
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;