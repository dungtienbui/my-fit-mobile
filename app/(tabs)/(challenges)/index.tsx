import { useUpdateGoalMutation } from "@/store/services/apis/goalsApi";
import { Button, StyleSheet, Text, View } from "react-native";

export default function Index() {
  const [updateGoals] = useUpdateGoalMutation();

  const handleUpdate = async () => {
    try {
      const res = await updateGoals({
        id: "68315a22871f6301923f1da7",
        data: {
          health_weight: {
            target: 40,
            unit: "kg",
          },
        },
      }).unwrap();

      console.log("res: ", res);
    } catch (error) {
      console.error("error: ", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Challenge screen</Text>
      <Text style={styles.button}>challenges/index</Text>
      <Button
        title="Click"
        onPress={() => {
          handleUpdate();
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
