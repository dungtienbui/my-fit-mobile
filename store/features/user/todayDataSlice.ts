// redux/slices/todayDataSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TodayData {
  walking: number;
  water: number;
  calories: number;
  sleep: number;
  activityTime: number;
}

const initialState: TodayData = {
  walking: 0,
  water: 0,
  calories: 0,
  sleep: 0,
  activityTime: 0,
};

const todayDataSlice = createSlice({
  name: "todayData",
  initialState,
  reducers: {
    setTodayData: (state, action: PayloadAction<TodayData>) => {
      return { ...state, ...action.payload };
    },
    resetTodayData: () => initialState,
  },
});

export const { setTodayData, resetTodayData } = todayDataSlice.actions;

const todayDataReducer = todayDataSlice.reducer;

export default todayDataReducer;

export const selectTodayData = (state: { todayData: TodayData }) =>
  state.todayData;
