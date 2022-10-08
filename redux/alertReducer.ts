import { AlertColor } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";

const initialState: {
  isOpen: boolean;
  message: string;
  type: AlertColor;
} = {
  isOpen: true,
  message: "message",
  type: "success",
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    openAlert: (
      state,
      action: {
        type: string;
        payload: {
          message: string;
          type: AlertColor;
        };
      }
    ) => {
      state.isOpen = true;
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    closeAlert: (state) => {
      state.isOpen = false;
      state.message = "";
      state.type = "success";
    },
  },
});

export const { openAlert, closeAlert } = alertSlice.actions;
export const alertReducer = alertSlice.reducer;
