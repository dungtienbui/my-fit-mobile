import AuthWrapper from "@/components/authWrapper/AuthWrapper";
import FontProvider from "@/providers/FontProvider";
import { persistor, store } from "@/store/store";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <FontProvider>
          <AuthWrapper>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
            <Toast topOffset={70} visibilityTime={2000} />
          </AuthWrapper>
        </FontProvider>
        <StatusBar barStyle="default" />
      </PersistGate>
    </Provider>
  );
}
