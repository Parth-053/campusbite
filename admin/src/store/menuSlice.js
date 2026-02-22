import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// MOCK DUMMY DATA FOR FRONTEND TESTING
const mockMenuData = [
  { id: '1', name: 'Samosa', category: 'Snacks', price: 15, inStock: true },
  { id: '2', name: 'Masala Chai', category: 'Beverages', price: 10, inStock: true },
  { id: '3', name: 'Aloo Paratha', category: 'Breakfast', price: 30, inStock: false },
];

export const fetchMenuByCanteen = createAsyncThunk('menu/fetchMenu', async (canteenId) => {
  // Simulate API Delay
  return new Promise((resolve) => setTimeout(() => resolve(mockMenuData), 500));
});

export const updateMenuItem = createAsyncThunk('menu/updateItem', async ({ item }) => {
  return item; // Directly return updated item
});

const menuSlice = createSlice({
  name: 'menu',
  initialState: { items: [], isLoading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenuByCanteen.pending, (state) => { state.isLoading = true; })
      .addCase(fetchMenuByCanteen.fulfilled, (state, action) => { state.isLoading = false; state.items = action.payload; })
      .addCase(updateMenuItem.fulfilled, (state, action) => {
        const index = state.items.findIndex(i => i.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
      });
  }
});

export default menuSlice.reducer;