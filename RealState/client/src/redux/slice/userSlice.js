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
      //   state.error = null;
    },
    signinSuccess: (state, action) => {
      console.log("action.payload", action.payload);

      state.loading = false;
      state.currentUser = action.payload;
      state.error = null;
    },
    signinFailure: (state, action) => {
      console.log("action.payload for failed condition", action.payload);

      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { signinStart, signinSuccess, signinFailure } =
  counterSlice.actions;

export default counterSlice.reducer;
