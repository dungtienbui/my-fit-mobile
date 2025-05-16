import { selectIsLoggedIn } from "@/store/features/auth/authSlice";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  useEffect(() => {
    router.replace("/(auth)");
  }, [isLoggedIn]);
  return <>{children}</>;
};

export default AuthWrapper;
