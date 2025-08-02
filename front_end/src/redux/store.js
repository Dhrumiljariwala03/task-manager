import { configureStore } from "@reduxjs/toolkit";
import authSlices from './slices/authSlice';
import userSlice from './slices/userSlice'
import teamSlice from "./slices/teamSlice";


export const store = configureStore({
  reducer: {
    auth: authSlices,
    user : userSlice,
    team : teamSlice
  },
});
