import FontProvider from "@/providers/FontProvider";
import { persistor, store } from "@/store/store";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "../global.css"

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <FontProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </FontProvider>
        <StatusBar barStyle="default" />
      </PersistGate>
    </Provider>
  );
}
