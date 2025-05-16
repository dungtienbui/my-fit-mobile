import CustomButton from "@/components/button/CustomButton";
import { logout } from "@/store/features/auth/authSlice";
import { Link } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { useDispatch } from "react-redux";

export default function Index() {
  const dispatch = useDispatch();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Home screen</Text>
      <Link href="/(tabs)/(home)" style={styles.button}>
        Go to Home screen
      </Link>

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
