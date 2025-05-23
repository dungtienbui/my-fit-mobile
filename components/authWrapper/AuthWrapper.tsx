import { selectIsLoggedIn } from "@/store/features/auth/authSlice";
import { baseApi } from "@/store/services/apis/baseApi";
import { deleteToken } from "@/store/utils/tokenUtils";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useDispatch();
  useEffect(() => {
    if (isLoggedIn === false) {
      deleteToken();
      dispatch(baseApi.util.resetApiState());
      router.replace("/(auth)");
    }
  }, [isLoggedIn]);
  return <>{children}</>;
};

export default AuthWrapper;
