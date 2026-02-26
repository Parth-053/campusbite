import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

// REAL API CALLS
export const fetchNotifications = createAsyncThunk('notification/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/notifications/owner'); // Hit your new specific route
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to fetch'); }
});

export const markAsRead = createAsyncThunk('notification/markRead', async (id, { rejectWithValue }) => {
  try {
    const res = await api.patch(`/notifications/owner/${id}/read`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update'); }
});

export const markAllAsRead = createAsyncThunk('notification/markAllRead', async (_, { rejectWithValue }) => {
  try {
    await api.patch('/notifications/owner/read-all');
    return true;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to update all'); }
});

export const deleteNotification = createAsyncThunk('notification/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/notifications/owner/${id}`);
    return id;
  } catch (err) { return rejectWithValue(err.response?.data?.message || 'Failed to delete'); }
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
    // Instant UI Update without waiting for API
    optimisticMarkRead: (state, action) => {
      const notification = state.notifications.find(n => n._id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => { 
        if (state.notifications.length === 0) state.isLoading = true; 
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) state.notifications[index] = action.payload;
      })
      
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(n => n.isRead = true);
        state.unreadCount = 0;
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        const notification = state.notifications.find(n => n._id === action.payload);
        if (notification) {
          if (!notification.isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
          state.notifications = state.notifications.filter(n => n._id !== action.payload);
        }
      });
  }
});

export const { optimisticMarkRead } = notificationSlice.actions;
export default notificationSlice.reducer;