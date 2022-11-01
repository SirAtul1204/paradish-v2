import { createSlice } from "@reduxjs/toolkit";

interface TState {
  items: any;
  totalQuantity: number;
  totalPrice: number;
  totalCalories: number;
}

const initialState: TState = {
  items: {},
  totalQuantity: 0,
  totalPrice: 0,
  totalCalories: 0,
};

const cartSlice = createSlice({
  name: "Cart",
  initialState,
  reducers: {
    hydrateCart(state, action: { type: string; payload: TState }) {
      state.items = action.payload.items;
      state.totalQuantity = action.payload.totalQuantity;
      state.totalPrice = action.payload.totalPrice;
      state.totalCalories = action.payload.totalCalories;
    },
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
        state.totalCalories += action.payload.item.calories;
        localStorage.setItem("cart", JSON.stringify(state));
        return;
      }
      state.items[action.payload.item.id].quantity++;
      state.totalPrice += action.payload.item.price;
      state.totalQuantity++;
      state.totalCalories += action.payload.item.calories;
      localStorage.setItem("cart", JSON.stringify(state));
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
        state.totalCalories -= item.calories;
        localStorage.setItem("cart", JSON.stringify(state));
        return;
      }
      state.items[action.payload.itemId].quantity--;
      state.totalQuantity--;
      state.totalPrice -= item.price;
      state.totalCalories -= item.calories;
      localStorage.setItem("cart", JSON.stringify(state));
    },
    clearCart: (state) => {
      state.items = {};
      state.totalQuantity = 0;
      state.totalPrice = 0;
      state.totalCalories = 0;
      localStorage.setItem("cart", JSON.stringify(state));
    },
  },
});

export const { addItem, removeItem, hydrateCart, clearCart } =
  cartSlice.actions;
export const cartReducer = cartSlice.reducer;
