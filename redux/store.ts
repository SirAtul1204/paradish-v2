import { configureStore } from "@reduxjs/toolkit";
import { alertReducer } from "./alertReducer";
// ...
const store = configureStore({
  reducer: {
    alert: alertReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;

export default store;
