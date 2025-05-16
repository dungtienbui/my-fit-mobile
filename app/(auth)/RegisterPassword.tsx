import CustomButton from "@/components/button/CustomButton";
import IconButton from "@/components/button/IconButton";
import CustomInput from "@/components/form/CustomInput";
import ScreenTitle from "@/components/screen/ScreenTitle";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useRegisterMutation } from "@/store/services/authApi";
import { saveToken } from "@/store/utils/tokenUtils";
import { fonts } from "@/theme/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

export default function RegisterPassword() {
  const { email } = useLocalSearchParams();

  useEffect(() => {
    if (email === undefined) {
      console.log("emails: ", email);
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Đã có sự cố khi nhập email. Vui lòng nhập lại.",
      });
      router.dismissAll();
    }
  }, [email]);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isShowPassword, setIsShowPassword] = useState(false);
  const [isShowConfirmPassword, setIsConfirmShowPassword] = useState(false);

  const dispatch = useDispatch();
  const [register, { data, error, isLoading }] = useRegisterMutation();

  const checkValidPassword = () => {
    if (password.length > 7) {
      return {
        isCorrect: true,
        message: undefined,
      };
    } else if (password.length > 0) {
      return {
        isCorrect: false,
        message: "At least 8 characters, containing both letters and numbers",
      };
    }
    return {
      isCorrect: undefined,
      message: undefined,
    };
  };

  const checkConfirmPassword = () => {
    if (password == confirmPassword && password.length !== 0) {
      return {
        isCorrect: true,
        message: "Correct",
      };
    } else if (confirmPassword.length > 0) {
      return {
        isCorrect: false,
        message: "Incorrect",
      };
    }
    return {
      isCorrect: undefined,
      message: undefined,
    };
  };

  const handleSubmitInput = async () => {
    if (checkConfirmPassword().isCorrect === true) {
      const userEmail = Array.isArray(email) ? email[0] : email;
      const userName = userEmail.slice(0, userEmail.indexOf("@"));

      console.log("userEmail: ", userEmail);
      console.log("pass: ", password);
      console.log("userName: ", userName);

      await register({
        email: userEmail,
        password: password,
        name: userName,
      });
    }
  };

  useEffect(() => {
    if (data) {
      console.log("result: ", data);

      dispatch(setCredentials({ isLoggedIn: true }));

      saveToken(data.access_token);

      Toast.show({
        type: "success",
        text1: "Chúc mừng",
        text2:
          "Bạn đã đăng ký tài khoản thành công. Hãy bắt đầu khám pháp MyFIT.",
      });
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const errorCast = error as { data: { message: string }; status: Number };
      if (errorCast.data.message === "Email already exists") {
        Toast.show({
          type: "error",
          text1: "Xin lỗi",
          text2: "Email đã tồi tại tài khoản trước đó.",
        });
        return;
      }
      Toast.show({
        type: "error",
        text1: "Xin lỗi",
        text2: "Đã có sự cố khi nhập đăng ký. Vui lòng thử lại.",
      });

      // router.dismissAll();
    }
  }, [error]);

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      resizeMode="cover"
      style={{ flex: 1, zIndex: -1 }}
    >
      <SafeAreaView style={{ borderWidth: 1, borderColor: "red", flex: 1 }}>
        <ScreenTitle
          title="Đăng ký tài khoản"
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
          <View
            style={{
              width: "100%",
              alignItems: "center",
              gap: 20,
            }}
          >
            <CustomInput
              label="Nhập mật khẩu"
              labelStyle={styles.inputTitle}
              value={password}
              placeholder="Mật khẩu..."
              onChangeText={setPassword}
              width="90%"
              height={50}
              isEmailInput
              helperText={checkValidPassword().message}
              helperIcon={
                checkValidPassword().isCorrect === false && (
                  <Ionicons name="alert-circle-outline" size={18} color="red" />
                )
              }
              inputStatus={
                checkValidPassword().isCorrect === false
                  ? "error"
                  : checkValidPassword().isCorrect === true
                  ? "success"
                  : "default"
              }
              trailingIcon={
                <Pressable
                  onPress={() => {
                    setIsShowPassword((prev) => !prev);
                  }}
                >
                  {!isShowPassword ? (
                    <Ionicons name="eye-outline" size={24} color="#000" />
                  ) : (
                    <Ionicons name="eye-off-outline" size={24} color="#000" />
                  )}
                </Pressable>
              }
              secureTextEntry={!isShowPassword}
            />

            <CustomInput
              label="Xác nhận mật khẩu"
              labelStyle={styles.inputTitle}
              value={confirmPassword}
              placeholder="Mật khẩu..."
              onChangeText={setConfirmPassword}
              width="90%"
              height={50}
              isEmailInput
              helperText={checkConfirmPassword().message}
              helperIcon={
                checkConfirmPassword().isCorrect === false ? (
                  <Ionicons name="alert-circle-outline" size={18} color="red" />
                ) : (
                  checkConfirmPassword().isCorrect === true && (
                    <Ionicons
                      name="checkmark-outline"
                      size={18}
                      color="green"
                    />
                  )
                )
              }
              inputStatus={
                checkConfirmPassword().isCorrect === false
                  ? "error"
                  : checkConfirmPassword().isCorrect === true
                  ? "success"
                  : "default"
              }
              disabled={checkValidPassword().isCorrect !== true}
              trailingIcon={
                <Pressable
                  onPress={() => {
                    setIsConfirmShowPassword((prev) => !prev);
                  }}
                >
                  {!isShowConfirmPassword ? (
                    <Ionicons name="eye-outline" size={24} color="#000" />
                  ) : (
                    <Ionicons name="eye-off-outline" size={24} color="#000" />
                  )}
                </Pressable>
              }
              secureTextEntry={!isShowConfirmPassword}
            />
          </View>

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
              title="Tiếp theo"
              onPress={handleSubmitInput}
              width="90%"
              isDisable={checkConfirmPassword().isCorrect !== true}
            />
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
      {/* 🌀 Modal hiển thị khi loading = true */}
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => {}}
      >
        <View style={styles.modalBackground}>
          <View style={styles.spinnerContainer}>
            <ActivityIndicator size="large" color="green" />
            <Text style={styles.loadingText}>Đăng gửi đăng ký...</Text>
          </View>
        </View>
      </Modal>
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
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  spinnerContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
