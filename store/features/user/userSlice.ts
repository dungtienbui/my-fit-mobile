import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// type UserStateStrick = {
//   _id: string;
//   email: string;
//   name: string;
//   age?: number;
//   gender?: string;
//   height?: number;
//   weight?: number;
// };

type UserState = {
  _id: string | null;
  email: string | null;
  name: string | null;
  age?: number;
  address?: string;
  gender?: string;
  height?: number;
  weight?: number;
};

const initialState: UserState = {
  _id: null,
  email: null,
  name: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (
      state,
      action: PayloadAction<{
        _id: string;
        email: string;
        name: string;
        age?: number;
        address?: string;
        gender?: string;
        height?: number;
        weight?: number;
      }>
    ) => {
      return { ...action.payload } as UserState;
    },

    clearUserInfo: (state) => {
      state._id = null;
      state.email = null;
      state.name = null;
      state.age = undefined;
      state.address = undefined;
      state.gender = undefined;
      state.height = undefined;
      state.weight = undefined;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;
const userReducer = userSlice.reducer;
export default userReducer;

export const selectUserInfo = (state: { user: UserState }) => state.user;
