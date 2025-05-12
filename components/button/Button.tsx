// components/Button.tsx
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  DimensionValue,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isDisable?: boolean;
  width?: DimensionValue;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  isDisable,
  width = "80%",
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: width }, style]}
      onPress={onPress}
      disabled={isDisable === true}
    >
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.primary1,
  },
  text: {
    ...fonts.bodyLarge,
    color: "white",
    textAlign: "center",
  },
});

export default Button;
