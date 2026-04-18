import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isInitialized: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setIsInitialized: (state, action: PayloadAction<boolean>) => {
      state.isInitialized = action.payload;
    },
  },
});

export const { setIsInitialized } = appSlice.actions;
export const appReducer = appSlice.reducer;
