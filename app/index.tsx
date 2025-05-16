import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, View } from "react-native";
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

  return <Redirect href={isFirstLaunch ? "/onboarding" : "/(auth)"} />;
}
