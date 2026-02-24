import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import collegeReducer from './collegeSlice';
import hostelReducer from './hostelSlice';
import canteenReducer from './canteenSlice';
import customerReducer from './customerSlice';
import orderReducer from './orderSlice';
import analyticsReducer from './analyticsSlice';
import financeReducer from './financeSlice';
import dashboardReducer from './dashboardSlice';
import settingsReducer from './settingsSlice';
import locationReducer from './locationSlice';
import categoryReducer from './categorySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    college: collegeReducer,
    hostel: hostelReducer,
    canteen: canteenReducer,
    customer: customerReducer,
    order: orderReducer,
    analytics: analyticsReducer,
    finance: financeReducer,
    dashboard: dashboardReducer,
    settings: settingsReducer,
    location: locationReducer,
    category: categoryReducer,
  },
});