import { configureStore } from "@reduxjs/toolkit";
import { alertReducer } from "./alertReducer";
import { cartReducer } from "./cart";
// ...
const store = configureStore({
  reducer: {
    alert: alertReducer,
    cart: cartReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
