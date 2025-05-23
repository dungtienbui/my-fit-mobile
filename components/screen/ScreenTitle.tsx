import { fonts } from "@/theme/fonts";
import React from "react";
import { StyleSheet, Text, View, ViewStyle } from "react-native";

type ScreenTitleProps = {
  title: string;
  LeadingIconButton?: React.ReactElement;
  TrailingIconButton?: React.ReactElement;
  style?: ViewStyle;
};

const ScreenTitle = ({
  title,
  LeadingIconButton,
  TrailingIconButton,
  style,
}: ScreenTitleProps) => {
  return (
    <View style={[styles.container, style]}>
      {/* Icon trái */}
      {LeadingIconButton}

      {/* Title luôn ở giữa màn hình */}
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
        {title}
      </Text>

      {/* Icon phải */}
      {TrailingIconButton}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 50,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    position: "relative",
  },
  title: {
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
    ...fonts.titleLarge,
    zIndex: -1,
  },
});

export default ScreenTitle;
