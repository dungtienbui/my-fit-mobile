import CustomButton from "@/components/button/CustomButton";
import IconButton from "@/components/button/IconButton";
import CustomInput from "@/components/form/CustomInput";
import ScreenTitle from "@/components/screen/ScreenTitle";
import { fonts } from "@/theme/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function Register() {
  const [input, setInput] = useState("");

  const checkValidEmail = () => {
    if (input.length === 0) {
      return {
        isCorrect: undefined,
        message: undefined,
      };
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input) === false) {
      return {
        isCorrect: false,
        message: "Địa chỉ email không chính xác",
      };
    } else {
      return {
        isCorrect: true,
        message: undefined,
      };
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      resizeMode="cover"
      style={{ flex: 1, zIndex: -1 }}
    >
      <SafeAreaView
        style={{
          flex: 1,
          paddingTop: Platform.OS === "android" ? 50 : 0,
        }}
      >
        <ScreenTitle
          title="Register"
          LeadingIconButton={
            <IconButton
              icon={<Ionicons name="arrow-back" size={15} color="#fff" />}
              onPress={() => {
                router.back();
              }}
            />
          }
        />
        <View style={styles.container}>
          <CustomInput
            label="Enter your email address"
            labelStyle={styles.inputTitle}
            value={input}
            placeholder="example@gmail.com"
            onChangeText={setInput}
            width="90%"
            height={70}
            isEmailInput
            helperText={
              checkValidEmail().isCorrect === false
                ? "Email invalid"
                : undefined
            }
            helperIcon={
              checkValidEmail().isCorrect === false &&
              input.length !== 0 && (
                <Ionicons name="alert-circle-outline" size={18} color="red" />
              )
            }
            inputStatus={
              checkValidEmail().isCorrect === false
                ? "error"
                : checkValidEmail().isCorrect === true
                ? "success"
                : "default"
            }
            inputContainerStyle={{ borderColor: "#000" }}
            inputMode="email"
          />

          <KeyboardAvoidingView
            style={styles.keyboard}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={120}
          >
            <Text style={styles.privacyText}>
              By registering, you accept our{" "}
              <Text style={styles.privacyTextNote}> Terms of Use</Text> and{" "}
              <Text style={styles.privacyTextNote}> Privacy Policy</Text>
            </Text>
            <CustomButton
              title="Next"
              onPress={() => {
                router.push({
                  pathname: "/(auth)/RegisterPassword",
                  params: {
                    email: input,
                  },
                });
              }}
              width="90%"
              isDisable={checkValidEmail().isCorrect !== true}
            />
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  inputTitle: {
    ...fonts.headlineSmall,
  },
  keyboard: {
    width: "100%",
    alignItems: "center",
  },
  privacyText: {
    ...fonts.labelLarge,
    fontFamily: "Roboto_300Medium",
    width: "75%",
    marginBottom: 15,
  },
  privacyTextNote: {
    fontFamily: "Roboto_500Medium",
    textDecorationLine: "underline",
  },
});
