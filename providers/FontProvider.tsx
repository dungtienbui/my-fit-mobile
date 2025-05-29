import {
  Roboto_400Regular,
  Roboto_500Medium,
  Roboto_700Bold,
  useFonts,
} from "@expo-google-fonts/roboto";
import * as SplashScreen from "expo-splash-screen";
import React, { useCallback } from "react";
import { View } from "react-native";

interface FontProviderProps {
  children: React.ReactNode;
}

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function FontProvider({ children }: FontProviderProps) {
  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_500Medium,
    Roboto_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      {children}
    </View>
  );
}
