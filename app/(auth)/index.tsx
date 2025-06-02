// app/auth/index.tsx
import { selectIsLoggedIn } from "@/store/features/auth/authSlice";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function AuthIndex() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const router = useRouter();

  console.log("isLoggedIn: ", isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace("/(tabs)/(home)");
    } else {
      router.replace("/(auth)/login");
    }
  }, [isLoggedIn]);

  return null;
}
