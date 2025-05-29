import CustomButton from "@/components/button/CustomButton";
import { logout } from "@/store/features/auth/authSlice";
import * as Sentry from "@sentry/react-native";
import { Link } from "expo-router";
import { Button, StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function Index() {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/(tabs)/(home)" style={styles.button}>
        Go to Home screen
      </Link>

      <Button
        title="Try!"
        onPress={() => {
          Sentry.captureException(new Error("First error"));
        }}
      />

      <CustomButton
        title="Logout"
        onPress={() => {
          dispatch(logout());
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#25292e",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: "#fff",
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
  },
});
