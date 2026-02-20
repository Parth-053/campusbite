import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  pastOrders: [
    {
      id: 'ORD-9921',
      canteenName: 'Tech Bites',
      date: '2026-02-18T12:30:00Z',
      totalAmount: 155,
      status: 'Completed',
      items: [{ name: 'Masala Dosa', qty: 2 }, { name: 'Cold Coffee', qty: 1 }]
    },
    {
      id: 'ORD-8842',
      canteenName: 'Healthy Bowl',
      date: '2026-02-15T09:15:00Z',
      totalAmount: 85,
      status: 'Completed',
      items: [{ name: 'Fruit Bowl', qty: 1 }]
    }
  ]
};

const orderHistorySlice = createSlice({
  name: 'orderHistory',
  initialState,
  reducers: {
    addOrderToHistory: (state, action) => {
      state.pastOrders.unshift(action.payload);
    }
  }
});

export const { addOrderToHistory } = orderHistorySlice.actions;
export default orderHistorySlice.reducer;