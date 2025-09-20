// src/redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import sweetsReducer from "./features/sweets/sweetsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sweets: sweetsReducer,
  },
});

// default export for easy importing in non-TS files
export default store;
