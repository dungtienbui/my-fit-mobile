import AuthWrapper from "@/components/authWrapper/AuthWrapper";
import FontProvider from "@/providers/FontProvider";
import { persistor, store } from "@/store/store";
import * as Sentry from "@sentry/react-native";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

Sentry.init({
  dsn: "https://c904bbfb6f65934930cee96e6c7b676a@o4509285988499456.ingest.us.sentry.io/4509405337485317",

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [
    Sentry.mobileReplayIntegration(),
    Sentry.feedbackIntegration(),
  ],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
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
});
