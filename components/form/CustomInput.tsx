// components/CustomInput.tsx
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import React, { useState } from "react";
import {
  TextInput,
  StyleSheet,
  View,
  Text,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Image,
  DimensionValue,
} from "react-native";

interface CustomInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  helperText?: string;
  helperIcon?: React.ReactNode;
  disabled?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  width?: DimensionValue;
}

const CustomInput: React.FC<CustomInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  leadingIcon,
  trailingIcon,
  helperText,
  helperIcon,
  disabled = false,
  style,
  inputStyle,
  width = "80%",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  console.warn(isFocused);

  const inputStyles = [
    styles.input,
    inputStyle,
    isFocused && styles.focusedInput,
  ];

  return (
    <View
      style={[
        styles.container,
        { width: width },
        style,
        disabled && { opacity: 0.5 },
      ]}
    >
      {/* Label */}
      <Text style={[styles.label]}>{label}</Text>

      {/* Input field */}
      <View style={[styles.inputContainer]}>
        {leadingIcon && <View style={styles.iconContainer}>{leadingIcon}</View>}
        <TextInput
          style={inputStyles}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          editable={!disabled}
        />
        {trailingIcon && (
          <View style={styles.iconContainer}>{trailingIcon}</View>
        )}
      </View>

      {/* Helper text and icon */}
      {helperText && (
        <View style={styles.helperContainer}>
          {helperIcon && <View style={styles.iconContainer}>{helperIcon}</View>}
          <Text style={[styles.helperText]}>{helperText}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  label: {
    ...fonts.labelLarge,
    color: "black",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 4,
    borderColor: colors.tertiary3,
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  focusedInput: {
    borderColor: colors.tertiary1, // Blue color when focused
  },
  input: {
    ...fonts.bodyLarge,
    flex: 1,
    color: "#333",
  },
  iconContainer: {
    marginVertical: 4,
    marginHorizontal: 6,
  },
  helperContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  helperText: {
    ...fonts.bodyMedium,
    color: colors.tertiary2,
  },
});

export default CustomInput;
