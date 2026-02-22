import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import canteenReducer from './canteenSlice';
import menuReducer from './menuSlice';
import orderReducer from './orderSlice';
import analyticsReducer from './analyticsSlice';
import dashboard from './dashboardSlice';
import uiReducer from './ui/uiSlice'; 
import notificationReducer from './notificationSlice';
import profileReducer from './profileSlice';
import transactionReducer from './transactionSlice';
import locationReducer from './locationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    canteen: canteenReducer,
    menu: menuReducer,
    order: orderReducer,
    analytics: analyticsReducer,
    dashboard: dashboard,
    ui: uiReducer,
    notification: notificationReducer,
    profile: profileReducer,
    transaction: transactionReducer,
    location: locationReducer,
  }
});