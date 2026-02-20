import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')) : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.admin = action.payload;
      localStorage.setItem('admin', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.admin = null;
      localStorage.removeItem('admin');
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;