import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import collegeReducer from './collegeSlice';
import hostelReducer from './hostelSlice';
import canteenReducer from './canteenSlice';
import userReducer from './userSlice';
import orderReducer from './orderSlice';
import analyticsReducer from './analyticsSlice';
import financeReducer from './financeSlice';
import dashboardReducer from './dashboardSlice';
import settingsReducer from './settingsSlice';
import locationReducer from './locationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    college: collegeReducer,
    hostel: hostelReducer,
    canteen: canteenReducer,
    user: userReducer,
    order: orderReducer,
    analytics: analyticsReducer,
    finance: financeReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
    location: locationReducer,
  },
});