import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Mock Data
const MOCK_NOTIFICATIONS = [
  { id: 'n1', type: 'order', orderId: 'ord_1', message: 'New Order #A-101 received', timestamp: new Date().toISOString(), isRead: false },
  { id: 'n2', type: 'system', orderId: null, message: 'Welcome to your new dashboard!', timestamp: new Date(Date.now() - 3600000).toISOString(), isRead: true },
  { id: 'n3', type: 'order', orderId: 'ord_2', message: 'Order #B-205 is pending for 5 mins', timestamp: new Date(Date.now() - 7200000).toISOString(), isRead: false },
];

export const fetchNotifications = createAsyncThunk('notification/fetch', async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return MOCK_NOTIFICATIONS;
});

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    // The "Smart" Action: Marks notification read if the Order ID matches (e.g. when order is accepted)
    markReadByOrderId: (state, action) => {
      const notification = state.notifications.find(n => n.orderId === action.payload && !n.isRead);
      if (notification) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    deleteNotification: (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification) {
        if (!notification.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { state.isLoading = true; })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      });
  }
});

export const { addNotification, markAsRead, markReadByOrderId, clearAllNotifications, deleteNotification } = notificationSlice.actions;
export default notificationSlice.reducer;