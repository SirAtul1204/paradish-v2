import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  items: any;
  totalQuantity: number;
  totalPrice: number;
} = {
  items: {},
  totalQuantity: 0,
  totalPrice: 0,
};

const cartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    addItem: (
      state,
      action: {
        type: string;
        payload: {
          item: {
            id: string;
            name: string;
            price: number;
            calories: number;
            type: string;
          };
        };
      }
    ) => {
      const item = state.items[action.payload.item.id];
      if (!item) {
        state.items[action.payload.item.id] = {
          ...action.payload.item,
          quantity: 1,
        };
        state.totalQuantity++;
        state.totalPrice += action.payload.item.price;
        return;
      }
      state.items[action.payload.item.id].quantity++;
      state.totalPrice += action.payload.item.price;
      state.totalQuantity++;
    },
    removeItem: (
      state,
      action: { type: string; payload: { itemId: string } }
    ) => {
      const item = state.items[action.payload.itemId];
      if (item.quantity === 1) {
        delete state.items[action.payload.itemId];
        state.totalQuantity--;
        state.totalPrice -= item.price;
        return;
      }
      state.items[action.payload.itemId].quantity--;
      state.totalQuantity--;
      state.totalPrice -= item.price;
    },
  },
});

export const { addItem, removeItem } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
