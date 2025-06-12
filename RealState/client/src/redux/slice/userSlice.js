import { createSlice, current } from "@reduxjs/toolkit";

let initialState = {
  currentUser: null,
  loading: false,
  error: null,
  progress: 0,
  status: "",
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
    progressUpload: (state, action) => {
      const { progress, status } = action.payload;
      state.progress = progress;
      state.status = status;
      // console.log("action.payload", action.payload);
      
    },
    deleteSuccess: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.error = null;
    },

     deleteUserFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { signinStart, signinSuccess, signinFailure, conditionError, progressUpload, deleteSuccess, deleteUserFailure } =
  counterSlice.actions;

export default counterSlice.reducer;
