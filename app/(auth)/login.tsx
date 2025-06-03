import CustomButton from "@/components/button/CustomButton";
import CustomInput from "@/components/form/CustomInput";
import { setCredentials } from "@/store/features/auth/authSlice";
import { useLoginMutation } from "@/store/services/authApi";
import { saveToken } from "@/store/utils/tokenUtils";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";

export default function Login() {
  const dispatch = useDispatch();
  const [login, { isLoading, error }] = useLoginMutation();

  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  });

  const [isShowPassword, setIsShowPassword] = useState(false);

  const handleLogin = async () => {
    if (inputs.email.length === 0 || inputs.email.length === 0) {
      console.error("Email or password is empty");
      return;
    }

    try {
      const result = await login(inputs).unwrap();
      console.log("Đăng nhập thành công!", result);

      dispatch(setCredentials({ isLoggedIn: true }));
      saveToken(result.access_token);
      router.replace("/(tabs)/(home)");
    } catch (err) {
      const { data } = err as {
        data: { error: string; message: string; statusCode: number };
        status: number;
      };
      if (
        data.message === "Password incorrect" ||
        data.message === "Email not found"
      ) {
        Toast.show({
          text1: "Ooh!",
          text2: "The email or password is incorrect!",
          type: "error",
        });
      } else {
        Toast.show({
          text1: "Ooh!",
          text2: "A wrong happended when login. Please try again!",
          type: "error",
        });
      }
      console.error("Đăng nhập thất bại:", err);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/images/app-logo.png")}
            resizeMode="contain"
            width={150}
            style={styles.logoImg}
          />
          <Text style={styles.logoText}>Welcome</Text>
        </View>
        <View>
          <View style={styles.inputContainer}>
            <CustomInput
              inputStyle={styles.input}
              label=""
              value={inputs.email}
              placeholder="Email..."
              onChangeText={(e) => {
                setInputs({ ...inputs, email: e });
              }}
              leadingIcon={
                <Ionicons name="mail-outline" size={24} color="#000" />
              }
              inputBorder={999}
              width="90%"
              height={60}
            />

            <CustomInput
              inputStyle={styles.input}
              label=""
              value={inputs.password}
              placeholder="Password..."
              onChangeText={(e) => {
                setInputs({ ...inputs, password: e });
              }}
              leadingIcon={
                <Ionicons name="lock-closed-outline" size={24} color="#000" />
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
              inputBorder={999}
              width="90%"
              height={60}
            />
            <Text
              style={{
                width: "80%",
                textAlign: "right",
                color: "#F97316",
                textDecorationLine: "underline",
                ...fonts.titleMedium,
                lineHeight: 0,
                // paddingEnd: 20,
              }}
            >
              Forgot password
            </Text>
            <CustomButton
              title="Login"
              onPress={() => {
                if (!isLoading) {
                  handleLogin();
                }
              }}
              width="90%"
              leadingIcon={isLoading && <ActivityIndicator color="white" />}
            />
          </View>
        </View>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 40,
          marginVertical: 30,
        }}
      >
        <View style={styles.dividerBar}></View>
        <Text style={{ marginHorizontal: 5 }}>Or</Text>
        <View style={styles.dividerBar}></View>
      </View>
      <View style={{ alignItems: "center", gap: 20 }}>
        <CustomButton
          title="Continue with Google"
          onPress={() => {
            console.log("Login with google!");
          }}
          leadingIcon={
            <Image
              style={{ width: 25, height: 25 }}
              source={require("../../assets/images/Social_Icons.png")}
              resizeMode="contain"
            />
          }
          style={{ backgroundColor: "#E4E4E7" }}
          textStyle={{ color: "black" }}
          width="90%"
        />

        <Text
          style={{
            textAlign: "center",
            ...fonts.titleMedium,
          }}
        >
          <Text>Don't have an account? </Text>
          <Text
            style={{
              color: "#16A34A",
              fontSize: 20,
            }}
            onPress={() => {
              router.push("/(auth)/register");
            }}
          >
            Sign up
          </Text>
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 50,
  },
  logoContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#16A34A",
    fontFamily: "Roboto_700Bold",
    fontSize: 30,
  },
  logoImg: {
    // borderWidth: 1,
  },
  inputContainer: {
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginTop: 30,
  },

  input: {},
  dividerBar: {
    borderTopWidth: 3,
    borderColor: colors.tertiary3,
    flexGrow: 1,
  },
});
