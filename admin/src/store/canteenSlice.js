import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- MOCK DATABASE ---
const MOCK_LOCATIONS = {
  states: ['Maharashtra', 'Karnataka', 'Delhi'],
  districts: {
    'Maharashtra': ['Pune', 'Mumbai'],
    'Karnataka': ['Bangalore'],
    'Delhi': ['New Delhi']
  },
  colleges: {
    'Pune': ['Pune Institute of Technology', 'COEP'],
    'Mumbai': ['Mumbai University', 'VJTI'],
    'Bangalore': ['Bangalore Engineering College'],
    'New Delhi': ['Delhi Tech']
  }
};

let MOCK_CANTEENS = [
  { 
    id: 'can_1', name: 'Tech Bites', college: 'Pune Institute of Technology', state: 'Maharashtra', district: 'Pune', 
    ownerName: 'John Doe', phone: '9876543210', email: 'john@techbites.com', 
    openTime: '08:00', closeTime: '20:00', status: 'Active', 
    revenue: 15000, totalOrders: 1200,
    address: 'Campus Block A, Ground Floor, Pune',
    menu: [
      { id: 'm1', name: 'Veg Burger', price: 50, inStock: true, category: 'Snacks' },
      { id: 'm2', name: 'Cold Coffee', price: 40, inStock: true, category: 'Beverages' }
    ],
    transactions: [
      { id: 'tx_1', date: '2023-10-25', type: 'Withdrawal', amount: 5000, status: 'Success' },
      { id: 'tx_2', date: '2023-10-10', type: 'Withdrawal', amount: 3000, status: 'Success' }
    ]
  },
  { 
    id: 'can_2', name: 'Coffee Hub', college: 'Pune Institute of Technology', state: 'Maharashtra', district: 'Pune', 
    ownerName: 'Jane Smith', phone: '9876543211', email: 'jane@coffeehub.com', 
    openTime: '09:00', closeTime: '18:00', status: 'Inactive', 
    revenue: 8000, totalOrders: 540, address: 'Library Block, Pune', menu: [], transactions: []
  },
  { 
    id: 'can_3', name: 'Delhi Cafe', college: 'Delhi Tech', state: 'Delhi', district: 'New Delhi', 
    ownerName: 'Amit Singh', phone: '9876543212', email: 'amit@delhicafe.com', 
    openTime: '10:00', closeTime: '22:00', status: 'Active', 
    revenue: 25000, totalOrders: 2100, address: 'Main Gate Entrance, New Delhi', menu: [], transactions: []
  }
];

// --- ASYNC THUNKS ---
export const fetchCanteenFilters = createAsyncThunk('canteen/fetchFilters', async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_LOCATIONS;
});

export const fetchCanteens = createAsyncThunk('canteen/fetchCanteens', async (filters, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    let filtered = [...MOCK_CANTEENS];
    
    if (filters?.state) filtered = filtered.filter(c => c.state === filters.state);
    if (filters?.district) filtered = filtered.filter(c => c.district === filters.district);
    if (filters?.college) filtered = filtered.filter(c => c.college === filters.college);
    if (filters?.status && filters.status !== 'All') filtered = filtered.filter(c => c.status === filters.status);

    return {
      canteens: filtered,
      totalCount: filtered.length,
      activeCount: filtered.filter(c => c.status === 'Active').length
    };
  } catch {
    return rejectWithValue('Failed to fetch canteens');
  }
});

export const fetchCanteenById = createAsyncThunk('canteen/fetchById', async (id, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    const canteen = MOCK_CANTEENS.find(c => c.id === id);
    if (!canteen) throw new Error("Not found");
    return canteen;
  } catch {
    return rejectWithValue('Canteen not found');
  }
});

export const deleteCanteen = createAsyncThunk('canteen/deleteCanteen', async (id, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    MOCK_CANTEENS = MOCK_CANTEENS.filter(c => c.id !== id);
    return id;
  } catch {
    return rejectWithValue('Failed to delete canteen');
  }
});

export const toggleCanteenStatus = createAsyncThunk('canteen/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const canteen = MOCK_CANTEENS.find(c => c.id === id);
    if (canteen) canteen.status = canteen.status === 'Active' ? 'Inactive' : 'Active';
    return { id, status: canteen.status };
  } catch {
    return rejectWithValue('Failed to toggle status');
  }
});

export const updateMenuItem = createAsyncThunk('canteen/updateMenuItem', async ({ canteenId, item }, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 600));
    const canteen = MOCK_CANTEENS.find(c => c.id === canteenId);
    if (canteen) {
      const itemIndex = canteen.menu.findIndex(m => m.id === item.id);
      if (itemIndex !== -1) canteen.menu[itemIndex] = { ...canteen.menu[itemIndex], ...item };
    }
    return item;
  } catch {
    return rejectWithValue('Failed to update item');
  }
});

const canteenSlice = createSlice({
  name: 'canteen',
  initialState: {
    canteens: [], totalCanteens: 0, activeCanteens: 0,
    filterData: { states: [], districts: {}, colleges: {} },
    currentCanteen: null,
    isLoading: false, isDetailLoading: false, error: null,
  },
  reducers: {
    clearCurrentCanteen: (state) => { state.currentCanteen = null; }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCanteenFilters.fulfilled, (state, action) => { state.filterData = action.payload; });

    builder
      .addCase(fetchCanteens.pending, (state) => { state.isLoading = true; })
      .addCase(fetchCanteens.fulfilled, (state, action) => {
        state.isLoading = false; state.canteens = action.payload.canteens;
        state.totalCanteens = action.payload.totalCount; state.activeCanteens = action.payload.activeCount;
      });

    builder
      .addCase(fetchCanteenById.pending, (state) => { state.isDetailLoading = true; })
      .addCase(fetchCanteenById.fulfilled, (state, action) => {
        state.isDetailLoading = false; state.currentCanteen = action.payload;
      });

    builder.addCase(deleteCanteen.fulfilled, (state, action) => {
      state.canteens = state.canteens.filter(c => c.id !== action.payload);
      state.totalCanteens -= 1;
    });

    builder.addCase(toggleCanteenStatus.fulfilled, (state, action) => {
      const canteen = state.canteens.find(c => c.id === action.payload.id);
      if (canteen) canteen.status = action.payload.status;
      if (state.currentCanteen?.id === action.payload.id) state.currentCanteen.status = action.payload.status;
    });

    builder.addCase(updateMenuItem.fulfilled, (state, action) => {
      if (state.currentCanteen) {
        const itemIndex = state.currentCanteen.menu.findIndex(m => m.id === action.payload.id);
        if (itemIndex !== -1) state.currentCanteen.menu[itemIndex] = action.payload;
      }
    });
  }
});

export const { clearCurrentCanteen } = canteenSlice.actions;
export default canteenSlice.reducer;