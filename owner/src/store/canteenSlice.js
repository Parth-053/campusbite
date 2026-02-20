import { createSlice } from '@reduxjs/toolkit';
import { OWNER_PROFILE } from '../utils/constants';

const initialState = {
  canteen: OWNER_PROFILE
};

const canteenSlice = createSlice({
  name: 'canteen',
  initialState,
  reducers: {
    updateCanteenStatus: (state) => {
      state.canteen.status = state.canteen.status === 'Open' ? 'Closed' : 'Open';
    },
    updateCanteenName: (state, action) => {
      state.canteen.canteenName = action.payload;
    }
  }
});

export const { updateCanteenStatus, updateCanteenName } = canteenSlice.actions;
export default canteenSlice.reducer;