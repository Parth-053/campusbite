import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: {}, // Stores items by ID: { m1: { id: 'm1', name: 'Dosa', price: 60, qty: 1, type: 'veg' } }
  totalQuantity: 0,
  totalPrice: 0,
  canteenId: null, // To track which canteen we are ordering from
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    updateCartItem: (state, action) => {
      const { item, change, canteenId } = action.payload;

      // Reset cart if adding from a different canteen
      if (state.canteenId && state.canteenId !== canteenId) {
        state.items = {};
        state.totalQuantity = 0;
        state.totalPrice = 0;
      }
      state.canteenId = canteenId;

      const currentItem = state.items[item.id];
      const currentQty = currentItem ? currentItem.qty : 0;
      const newQty = Math.max(0, currentQty + change);

      if (newQty === 0) {
        delete state.items[item.id];
      } else {
        state.items[item.id] = { ...item, qty: newQty };
      }

      // Recalculate totals
      let qty = 0;
      let price = 0;
      Object.values(state.items).forEach((cartItem) => {
        qty += cartItem.qty;
        price += cartItem.qty * cartItem.price;
      });

      state.totalQuantity = qty;
      state.totalPrice = price;

      // Clear canteenId if cart is empty
      if (state.totalQuantity === 0) {
        state.canteenId = null;
      }
    },
    clearCart: (state) => {
      state.items = {};
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.canteenId = null;
    }
  }
});

export const { updateCartItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;