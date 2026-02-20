import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- MOCK DATABASE ---
let MOCK_USERS = [
  { id: 'usr_1', name: 'Student A', email: 'studentA@edu.com', phone: '+91 9876543210', college: 'Pune Institute of Technology', status: 'Active', joinedDate: '2023-08-15' },
  { id: 'usr_2', name: 'Student B', email: 'studentB@edu.com', phone: '+91 9876543211', college: 'Mumbai University', status: 'Active', joinedDate: '2023-09-01' },
  { id: 'usr_3', name: 'Student C', email: 'studentC@edu.com', phone: '+91 9876543212', college: 'Pune Institute of Technology', status: 'Inactive', joinedDate: '2023-10-10' },
  { id: 'usr_4', name: 'Student D', email: 'studentD@edu.com', phone: '+91 9876543213', college: 'Delhi Tech', status: 'Active', joinedDate: '2023-11-05' },
];

const MOCK_USER_ORDERS = [
  { id: 'ord_101', userId: 'usr_1', canteen: 'Tech Bites', amount: 150, date: '2023-10-25', status: 'Completed' },
  { id: 'ord_102', userId: 'usr_1', canteen: 'Coffee Hub', amount: 40, date: '2023-10-26', status: 'Completed' },
  { id: 'ord_103', userId: 'usr_2', canteen: 'Mumbai Snacks', amount: 200, date: '2023-10-26', status: 'Pending' },
];

// --- ASYNC THUNKS ---

// Extract unique colleges from users for the filter dropdown
export const fetchUserFilters = createAsyncThunk('user/fetchFilters', async () => {
  await new Promise(resolve => setTimeout(resolve, 400));
  const uniqueColleges = [...new Set(MOCK_USERS.map(u => u.college))];
  return { colleges: uniqueColleges };
});

export const fetchUsers = createAsyncThunk('user/fetchUsers', async (filters, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    let filtered = [...MOCK_USERS];
    
    if (filters?.college) filtered = filtered.filter(u => u.college === filters.college);
    if (filters?.status && filters.status !== 'All') filtered = filtered.filter(u => u.status === filters.status);

    return {
      users: filtered,
      totalCount: filtered.length,
      activeCount: filtered.filter(u => u.status === 'Active').length
    };
  } catch  {
    return rejectWithValue('Failed to fetch users');
  }
});

export const fetchUserById = createAsyncThunk('user/fetchById', async (id, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = MOCK_USERS.find(u => u.id === id);
    if (!user) throw new Error("User not found");
    
    // Attach order history to the user object
    const userOrders = MOCK_USER_ORDERS.filter(o => o.userId === id);
    
    return { ...user, orders: userOrders };
  } catch  {
    return rejectWithValue('User not found');
  }
});

export const toggleUserStatus = createAsyncThunk('user/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    const user = MOCK_USERS.find(u => u.id === id);
    if (user) user.status = user.status === 'Active' ? 'Inactive' : 'Active';
    return { id, status: user.status };
  } catch  {
    return rejectWithValue('Failed to toggle user status');
  }
});

export const deleteUser = createAsyncThunk('user/deleteUser', async (id, { rejectWithValue }) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 800));
    MOCK_USERS = MOCK_USERS.filter(u => u.id !== id);
    return id;
  } catch  {
    return rejectWithValue('Failed to delete user');
  }
});

// --- SLICE ---
const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [], totalUsers: 0, activeUsers: 0,
    filterData: { colleges: [] },
    currentUser: null,
    isLoading: false, isDetailLoading: false, error: null,
  },
  reducers: {
    clearCurrentUser: (state) => { state.currentUser = null; }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUserFilters.fulfilled, (state, action) => {
      state.filterData = action.payload;
    });

    builder
      .addCase(fetchUsers.pending, (state) => { state.isLoading = true; })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.isLoading = false; 
        state.users = action.payload.users;
        state.totalUsers = action.payload.totalCount; 
        state.activeUsers = action.payload.activeCount;
      });

    builder
      .addCase(fetchUserById.pending, (state) => { state.isDetailLoading = true; })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.isDetailLoading = false; 
        state.currentUser = action.payload;
      });

    builder.addCase(toggleUserStatus.fulfilled, (state, action) => {
      const user = state.users.find(u => u.id === action.payload.id);
      if (user) user.status = action.payload.status;
      if (state.currentUser?.id === action.payload.id) state.currentUser.status = action.payload.status;
    });

    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter(u => u.id !== action.payload);
      state.totalUsers -= 1;
    });
  }
});

export const { clearCurrentUser } = userSlice.actions;
export default userSlice.reducer;