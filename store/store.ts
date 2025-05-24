import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import authReducer from "./features/auth/authSlice";
import todayDataReducer from "./features/user/todayDataSlice";
import userReducer from "./features/user/userSlice";
import { baseApi } from "./services/apis/baseApi";
import { authApi } from "./services/authApi";

const authPersistConfig = {
  key: "auth",
  storage: AsyncStorage,
};

const rootReducer = combineReducers({
  auth: persistReducer(authPersistConfig, authReducer),
  [baseApi.reducerPath]: baseApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  user: userReducer,
  todayData: todayDataReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(
      baseApi.middleware,
      authApi.middleware
    ),
});

export const persistor = persistStore(store);
