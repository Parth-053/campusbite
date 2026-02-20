import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// --- MOCK DATABASE ---
const MOCK_STATES = ['Maharashtra', 'Karnataka', 'Delhi', 'Gujarat'];
const MOCK_DISTRICTS = {
  'Maharashtra': ['Pune', 'Mumbai', 'Nagpur'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli'],
  'Delhi': ['New Delhi', 'South Delhi', 'North Delhi'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara']
};

let MOCK_COLLEGES = [
  { id: 'col_1', name: 'Pune Institute of Technology', state: 'Maharashtra', district: 'Pune', status: 'Active' },
  { id: 'col_2', name: 'Mumbai University', state: 'Maharashtra', district: 'Mumbai', status: 'Active' },
  { id: 'col_3', name: 'Bangalore Engineering College', state: 'Karnataka', district: 'Bangalore', status: 'Inactive' },
  { id: 'col_4', name: 'Delhi Tech', state: 'Delhi', district: 'New Delhi', status: 'Active' },
];

// --- ASYNC THUNKS ---
export const fetchLocationData = createAsyncThunk(
  'college/fetchLocationData',
  async (_, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      return { states: MOCK_STATES, districtsMap: MOCK_DISTRICTS };
    } catch {
      return rejectWithValue('Failed to load location data');
    }
  }
);

export const fetchColleges = createAsyncThunk(
  'college/fetchColleges',
  async (filters, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800)); 
      
      let filtered = [...MOCK_COLLEGES];
      
      if (filters?.state) filtered = filtered.filter(c => c.state === filters.state);
      if (filters?.district) filtered = filtered.filter(c => c.district === filters.district);
      if (filters?.status && filters.status !== 'All') filtered = filtered.filter(c => c.status === filters.status);

      return {
        colleges: filtered,
        totalCount: filtered.length,
        activeCount: filtered.filter(c => c.status === 'Active').length
      };
    } catch {
      return rejectWithValue('Failed to fetch colleges');
    }
  }
);

export const addNewCollege = createAsyncThunk(
  'college/addNewCollege',
  async (collegeData, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newCollege = { id: `col_${Date.now()}`, ...collegeData };
      MOCK_COLLEGES.unshift(newCollege);
      return newCollege;
    } catch {
      return rejectWithValue('Failed to add college');
    }
  }
);

// NEW: Edit College
export const editCollege = createAsyncThunk(
  'college/editCollege',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const index = MOCK_COLLEGES.findIndex(c => c.id === id);
      if (index !== -1) {
        MOCK_COLLEGES[index] = { ...MOCK_COLLEGES[index], ...data };
        return MOCK_COLLEGES[index];
      }
      throw new Error("Not found");
    } catch {
      return rejectWithValue('Failed to edit college');
    }
  }
);

// NEW: Delete College
export const deleteCollege = createAsyncThunk(
  'college/deleteCollege',
  async (id, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      MOCK_COLLEGES = MOCK_COLLEGES.filter(c => c.id !== id);
      return id;
    } catch {
      return rejectWithValue('Failed to delete college');
    }
  }
);

export const toggleCollegeStatus = createAsyncThunk(
  'college/toggleStatus',
  async (collegeId, { rejectWithValue }) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const college = MOCK_COLLEGES.find(c => c.id === collegeId);
      if (college) {
        college.status = college.status === 'Active' ? 'Inactive' : 'Active';
      }
      return { id: collegeId, status: college.status };
    } catch {
      return rejectWithValue('Failed to toggle status');
    }
  }
);

// --- SLICE ---
const collegeSlice = createSlice({
  name: 'college',
  initialState: {
    colleges: [], states: [], districtsMap: {}, totalColleges: 0, activeColleges: 0,
    isLoading: false, isActionLoading: false, error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchLocationData.fulfilled, (state, action) => {
      state.states = action.payload.states; state.districtsMap = action.payload.districtsMap;
    });

    builder
      .addCase(fetchColleges.pending, (state) => { state.isLoading = true; })
      .addCase(fetchColleges.fulfilled, (state, action) => {
        state.isLoading = false; state.colleges = action.payload.colleges;
        state.totalColleges = action.payload.totalCount; state.activeColleges = action.payload.activeCount;
      });

    builder
      .addCase(addNewCollege.pending, (state) => { state.isActionLoading = true; })
      .addCase(addNewCollege.fulfilled, (state, action) => {
        state.isActionLoading = false; state.colleges.unshift(action.payload);
        state.totalColleges += 1;
        if (action.payload.status === 'Active') state.activeColleges += 1;
      });

    builder
      .addCase(editCollege.pending, (state) => { state.isActionLoading = true; })
      .addCase(editCollege.fulfilled, (state, action) => {
        state.isActionLoading = false;
        const index = state.colleges.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          const oldStatus = state.colleges[index].status;
          state.colleges[index] = action.payload;
          if (oldStatus === 'Active' && action.payload.status === 'Inactive') state.activeColleges -= 1;
          if (oldStatus === 'Inactive' && action.payload.status === 'Active') state.activeColleges += 1;
        }
      });

    builder
      .addCase(deleteCollege.fulfilled, (state, action) => {
        const college = state.colleges.find(c => c.id === action.payload);
        if (college) {
          if (college.status === 'Active') state.activeColleges -= 1;
          state.totalColleges -= 1;
          state.colleges = state.colleges.filter(c => c.id !== action.payload);
        }
      });

    builder.addCase(toggleCollegeStatus.fulfilled, (state, action) => {
      const college = state.colleges.find(c => c.id === action.payload.id);
      if (college) {
        const oldStatus = college.status;
        college.status = action.payload.status;
        if (oldStatus === 'Active' && college.status === 'Inactive') state.activeColleges -= 1;
        if (oldStatus === 'Inactive' && college.status === 'Active') state.activeColleges += 1;
      }
    });
  }
});

export default collegeSlice.reducer;