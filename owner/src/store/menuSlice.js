import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Initial Data
const MOCK_MENU_ITEMS = [
  { id: 'm1', name: 'Veg Burger', price: 60, category: 'Food', available: true },
  { id: 'm2', name: 'Chicken Wrap', price: 120, category: 'Food', available: true },
  { id: 'm3', name: 'Cold Coffee', price: 80, category: 'Drink', available: true },
  { id: 'm4', name: 'French Fries', price: 50, category: 'Food', available: false },
  { id: 'm5', name: 'Vanilla Scoop', price: 40, category: 'Ice Cream', available: true },
];

export const fetchMenuItems = createAsyncThunk('menu/fetchMenuItems', async (_, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    return MOCK_MENU_ITEMS;
  } catch  {
    return rejectWithValue('Failed to load menu');
  }
});

const initialState = {
  items: [],
  isLoading: false,
  error: null,
  filter: 'All', // 'All', 'Available', 'Sold Out'
};

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    setMenuFilter: (state, action) => {
      state.filter = action.payload;
    },
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    updateItem: (state, action) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteItem: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    toggleAvailability: (state, action) => {
      const item = state.items.find(i => i.id === action.payload);
      if (item) {
        item.available = !item.available;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuItems.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMenuItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchMenuItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { setMenuFilter, addItem, updateItem, deleteItem, toggleAvailability } = menuSlice.actions;
export default menuSlice.reducer;