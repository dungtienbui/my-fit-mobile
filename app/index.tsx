import React from "react";
import { View, ActivityIndicator } from "react-native";
import { Redirect } from "expo-router";
import useFirstLaunch from "../hooks/useFirstLaunch";

export default function Index() {
  const isFirstLaunch = useFirstLaunch();

  if (isFirstLaunch === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={isFirstLaunch ? "/onboarding" : "/(auth)/login"} />;
}
