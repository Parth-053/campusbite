import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import canteenReducer from './canteenSlice';
import cartReducer from './cartSlice';
import orderReducer from './orderSlice';
import menuReducer from './menuSlice';
import orderHistoryReducer from './orderHistorySlice';
import notifications from './notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    canteen: canteenReducer,
    cart: cartReducer,
    order: orderReducer,
    menu: menuReducer,
    orderHistory: orderHistoryReducer,
    notifications: notifications,
  },
});