import { colors } from "@/theme/colors";
import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Activity screen</Text>
      <Text style={styles.button}>activities/index</Text>

      <Text
        onPress={() => {
          router.push("/(tabs)/(activities)/(add-metric)/add-sleep");
        }}
        style={styles.routerButton}
      >
        Add sleep
      </Text>
      <Text
        onPress={() => {
          router.push("/(tabs)/(activities)/(add-metric)/add-calories");
        }}
        style={styles.routerButton}
      >
        Add calories
      </Text>
      <Text
        onPress={() => {
          router.push("/(tabs)/(activities)/(add-metric)/add-hydration");
        }}
        style={styles.routerButton}
      >
        Add hydration
      </Text>
      <Text
        onPress={() => {
          router.push("/(tabs)/(activities)/(add-metric)/add-body-measurement");
        }}
        style={styles.routerButton}
      >
        Add body
      </Text>
      <Text
        onPress={() => {
          router.push("/(tabs)/(activities)/(add-metric)/add-exercise");
        }}
        style={styles.routerButton}
      >
        Add exe
      </Text>
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
  routerButton: {
    backgroundColor: colors.primary1,
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#fff",
    margin: 20,
    padding: 10,
  },
});
