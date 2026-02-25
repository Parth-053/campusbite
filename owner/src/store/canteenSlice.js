import { createSlice } from '@reduxjs/toolkit';
import { loginOwner, restoreSession } from './authSlice';

const initialState = {
  canteen: null
};

const canteenSlice = createSlice({
  name: 'canteen',
  initialState,
  reducers: {
    updateCanteenStatus: (state) => {
      if (state.canteen) {
        state.canteen.status = state.canteen.status === 'Open' ? 'Closed' : 'Open';
      }
    },
    updateCanteenName: (state, action) => {
      if (state.canteen) {
        state.canteen.canteenName = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginOwner.fulfilled, (state, action) => {
         const owner = action.payload?.owner || action.payload;
         state.canteen = action.payload?.canteen || owner?.canteen || null;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
         const owner = action.payload?.owner || action.payload;
         state.canteen = action.payload?.canteen || owner?.canteen || null;
      });
  }
});

export const { updateCanteenStatus, updateCanteenName } = canteenSlice.actions;
export default canteenSlice.reducer;