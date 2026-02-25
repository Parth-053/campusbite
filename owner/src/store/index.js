import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import canteenReducer from './canteenSlice';
import menuReducer from './menuSlice';
import orderReducer from './orderSlice';
import analyticsReducer from './analyticsSlice';
import dashboard from './dashboardSlice';
import notificationReducer from './notificationSlice';
import profileReducer from './profileSlice';
import transactionReducer from './transactionSlice';
import locationReducer from './locationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    canteen: canteenReducer,
    menu: menuReducer,
    orders: orderReducer,
    analytics: analyticsReducer,
    dashboard: dashboard,
    notification: notificationReducer,
    profile: profileReducer,
    transaction: transactionReducer,
    location: locationReducer,
  }
});