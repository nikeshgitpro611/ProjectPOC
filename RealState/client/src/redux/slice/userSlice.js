import { createSlice, current } from "@reduxjs/toolkit";

let initialState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const counterSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signinStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    conditionError: (state) => {
      state.loading = false;
      state.error = null;
    },
    signinSuccess: (state, action) => {

      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },
    signinFailure: (state, action) => {
        
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { signinStart, signinSuccess, signinFailure, conditionError } =
  counterSlice.actions;

export default counterSlice.reducer;
