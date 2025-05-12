import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AuthState = {
  isLoggedIn: boolean;
};

const initialState: AuthState = {
  isLoggedIn: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ isLoggedIn: boolean }>) => {
      console.log("Setting credentials:", action.payload);
      state.isLoggedIn = action.payload.isLoggedIn;
    },
    logout: (state) => {
      state.isLoggedIn = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
const authReducer = authSlice.reducer;
export default authReducer;

export const selectIsLoggedIn = (state: { auth: AuthState }) =>
  state.auth.isLoggedIn;
