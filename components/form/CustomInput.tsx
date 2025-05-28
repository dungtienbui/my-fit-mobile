// components/CustomInput.tsx
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import React, { useState } from "react";
import {
  DimensionValue,
  InputModeOptions,
  KeyboardType,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

interface CustomInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  secureTextEntry?: boolean;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  helperText?: string;
  helperIcon?: React.ReactNode;
  disabled?: boolean;
  readonly?: boolean;
  style?: ViewStyle;
  inputStyle?: TextStyle;
  labelStyle?: TextStyle;
  width?: DimensionValue;
  height?: DimensionValue;
  inputBorder?: number;
  isEmailInput?: boolean;
  inputStatus?: "default" | "error" | "success";
  keyboardType?: KeyboardType;
  inputMode?: InputModeOptions;
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
  readonly = false,
  style,
  inputStyle,
  labelStyle,
  width = "80%",
  height = "auto",
  inputBorder = 4,
  isEmailInput,
  inputStatus = "default",
  keyboardType = "default",
  inputMode = "none",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const inputStyles = [styles.input, inputStyle];

  const inputContainerStyples = [
    styles.inputContainer,
    { borderRadius: inputBorder },
    { height: height },
    isFocused && styles.focusedInput,
    isFocused && inputStatus === "error" && styles.focusedInputError,
    inputStatus === "success" && {
      backgroundColor: "#F0FDF4",
    },
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
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}

      {/* Input field */}
      <View style={inputContainerStyples}>
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
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType={isEmailInput ? "email-address" : keyboardType}
          readOnly={readonly}
          inputMode={inputMode}
        />
        {trailingIcon && (
          <View style={styles.iconContainer}>{trailingIcon}</View>
        )}
      </View>

      {/* Helper text and icon */}
      {helperText && (
        <View style={styles.helperContainer}>
          {helperIcon && <View style={styles.iconContainer}>{helperIcon}</View>}
          <Text
            style={[
              styles.helperText,
              { color: inputStatus === "error" ? "red" : undefined },
            ]}
          >
            {helperText}
          </Text>
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
    borderColor: colors.tertiary3,
    // backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  focusedInput: {
    borderColor: colors.tertiary1, // Blue color when focused
  },
  focusedInputError: {
    borderColor: "red", // Blue color when focused
  },
  input: {
    fontFamily: "Roboto_300Medium",
    fontSize: 18,
    letterSpacing: 1,
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
    flexShrink: 1,
  },
});

export default CustomInput;
