// components/IconButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet, ViewStyle } from "react-native";
import { IconProps } from "@expo/vector-icons/build/createIconSet";
import { colors } from "@/theme/colors";

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
