// components/IconButton.tsx
import { colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, TouchableOpacity, ViewStyle } from "react-native";

type IconButtonProps = {
  icon: React.ReactElement;
  onPress?: () => void;
  style?: ViewStyle;
  disabled?: boolean;
};

const IconButton = ({
  icon,
  onPress,
  style,
  disabled = false,
}: IconButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style, disabled && styles.disabled]}
      activeOpacity={0.7}
      disabled={disabled}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 4,
    backgroundColor: colors.primary1,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
});

export default IconButton;
