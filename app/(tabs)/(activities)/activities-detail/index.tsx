import { useTodayDate } from "@/hooks/useTodayDate";
import { useTodayData } from "@/hooks/useTodayHealthData";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  const today = useTodayDate();

  const todayData = useTodayData();

  console.log("todayData: ", todayData);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Add metric Index screen</Text>
      <Text style={styles.button}>activities/index</Text>
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
