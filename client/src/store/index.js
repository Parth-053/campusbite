import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import locationReducer from './locationSlice';
import collegeReducer from './collegeSlice';
import hostelReducer from './hostelSlice';
import canteenReducer from './canteenSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import menuReducer from './menuSlice';
import orderHistoryReducer from './orderHistorySlice';
import notifications from './notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    location: locationReducer,
    college: collegeReducer,
    hostel: hostelReducer,
    canteen: canteenReducer,
    cart: cartReducer,
    order: orderReducer,
    menu: menuReducer,
    orderHistory: orderHistoryReducer,
    notifications: notifications,
  },
});