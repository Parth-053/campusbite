import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notifications: [
    {
      id: 1,
      type: 'status',
      title: 'Order Ready!',
      desc: 'Your order from Tech Bites is ready for pickup.',
      time: '5 mins ago',
      unread: true,
      category: 'order'
    },
    {
      id: 2,
      type: 'promo',
      title: 'Lunch Discount',
      desc: 'Get 20% off on all Fruit Bowls at Healthy Bowl today.',
      time: '2 hours ago',
      unread: false,
      category: 'promo'
    },
    {
      id: 3,
      type: 'info',
      title: 'Canteen Update',
      desc: 'Late Night Craves will be closed this Sunday for maintenance.',
      time: '1 day ago',
      unread: false,
      category: 'info'
    }
  ]
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif) {
        notif.unread = false;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.unread = false);
    }
  }
});

export const { markAsRead, markAllAsRead } = notificationSlice.actions;
export default notificationSlice.reducer;