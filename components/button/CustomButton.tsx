// components/Button.tsx
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import React from "react";
import {
  DimensionValue,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

interface ButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isDisable?: boolean;
  width?: DimensionValue;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
}

const CustomButton: React.FC<ButtonProps> = ({
  title,
  onPress,
  style,
  textStyle,
  isDisable,
  width = "80%",
  leadingIcon,
  trailingIcon,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, { width: width }, style]}
      onPress={onPress}
      disabled={isDisable === true}
    >
      {leadingIcon && <View style={styles.iconContainer}>{leadingIcon}</View>}
      <Text style={[styles.text, textStyle]}>{title}</Text>
      {trailingIcon && <View style={styles.iconContainer}>{trailingIcon}</View>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.primary1,
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
  },
  text: {
    ...fonts.bodyLarge,
    color: "white",
    textAlign: "center",
  },
  iconContainer: {
    marginHorizontal: 6,
  },
});

export default CustomButton;
