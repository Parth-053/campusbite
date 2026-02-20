import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- MOCK DATABASE ---
const MOCK_MENUS = {
  'can_1': {
    canteenName: 'Tech Bites',
    menu: [
      {
        category: 'Food',
        items: [
          { id: 'm1', name: 'Masala Dosa', price: 60, type: 'veg' },
          { id: 'm2', name: 'Chicken Fried Rice', price: 120, type: 'non-veg' },
          { id: 'm3', name: 'Paneer Butter Masala', price: 150, type: 'veg' },
        ]
      },
      {
        category: 'Ice Creams & Desserts',
        items: [
          { id: 'm4', name: 'Vanilla Scoop', price: 40, type: 'veg' },
          { id: 'm5', name: 'Chocolate Brownie', price: 80, type: 'veg' },
        ]
      },
      {
        category: 'Cold Drinks',
        items: [
          { id: 'm6', name: 'Cold Coffee', price: 50, type: 'veg' },
          { id: 'm7', name: 'Sprite (250ml)', price: 20, type: 'veg' },
        ]
      }
    ]
  }
};

export const fetchMenu = createAsyncThunk(
  'menu/fetchMenu',
  async (canteenId, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate loading
      const data = MOCK_MENUS[canteenId] || MOCK_MENUS['can_1']; // Fallback for mock
      return data;
    } catch  {
      return rejectWithValue('Failed to load menu');
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    canteenName: '',
    categories: [],
    isLoading: true,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.isLoading = false;
        state.canteenName = action.payload.canteenName;
        state.categories = action.payload.menu;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export default menuSlice.reducer;