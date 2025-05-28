import ScreenTitle from "@/components/screen/ScreenTitle";
import { useGetGoalsQuery } from "@/store/services/apis/goalsApi";
import { fonts } from "@/theme/fonts";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  const {
    data: goals,
    isLoading: isGoalsLoading,
    error: goalsError,
  } = useGetGoalsQuery();

  const handleNavigate = (
    pageName:
      | "activity"
      | "steps"
      | "sleep"
      | "weight"
      | "bodyFat"
      | "food"
      | "energyBurned"
      | "water",
    data1?: {
      value: number;
      unit: string;
      frequency: string;
    },

    data2?: {
      target: number;
      unit: string;
    },
    data3?: {
      start: string;
      end: string;
      frequency: string;
    }
  ) => {
    if (
      pageName == "activity" ||
      pageName == "steps" ||
      pageName == "water" ||
      pageName == "energyBurned" ||
      pageName == "food"
    ) {
      router.push({
        pathname: `/(tabs)/(challenges)/edit/${pageName}` as any,
        params: {
          id: goals?._id,
          value: data1?.value,
          unit: data1?.unit,
          frequency: data1?.frequency,
        },
      });
    } else if (pageName == "bodyFat" || pageName == "weight") {
      router.push({
        pathname: `/(tabs)/(challenges)/edit/${pageName}` as any,
        params: {
          id: goals?._id,
          target: data2?.target,
          unit: data2?.unit,
        },
      });
    } else if (pageName == "sleep") {
      router.push({
        pathname: `/(tabs)/(challenges)/edit/${pageName}` as any,
        params: {
          id: goals?._id,
          start: data3?.start,
          end: data3?.end,
          frequency: data3?.frequency,
        },
      });
    }
  };

  useEffect(() => {
    console.warn("goals: ", goals);
  }, [goals]);

  const sleepTimeCombine = (start?: Date | string, end?: Date | string) => {
    if (!start || !end) return "";

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return "";

    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Ho_Chi_Minh",
    };

    return `${startDate.toLocaleTimeString(
      "vi-VN",
      options
    )} - ${endDate.toLocaleTimeString("vi-VN", options)}`;
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScreenTitle
          title="Your goals"
          style={{ marginTop: Platform.OS === "android" ? 40 : 0 }}
        />
        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.sectionGroup}>
            <Text style={styles.sectionTitle}>Activity</Text>
            <Card
              label="Total exercise time"
              value={goals?.activity_exerciseHours?.value}
              frequency={goals?.activity_exerciseHours?.frequency}
              unit={goals?.activity_exerciseHours?.unit}
              onPress={() =>
                handleNavigate("activity", {
                  value: goals?.activity_exerciseHours?.value ?? 0,
                  unit: goals?.activity_exerciseHours?.unit ?? "hours",
                  frequency:
                    goals?.activity_exerciseHours?.frequency ?? "Daily",
                })
              }
              isLoading={isGoalsLoading}
              isSetGoal={goals?.activity_exerciseHours ? false : true}
            />
            <Card
              label="Steps"
              value={goals?.activity_steps?.value}
              frequency={goals?.activity_steps?.frequency}
              unit={goals?.activity_steps?.unit}
              onPress={() =>
                handleNavigate("steps", {
                  value: goals?.activity_steps?.value ?? 0,
                  unit: goals?.activity_steps?.unit ?? "steps",
                  frequency: goals?.activity_steps?.frequency ?? "Daily",
                })
              }
              isLoading={isGoalsLoading}
              isSetGoal={goals?.activity_steps ? false : true}
            />
            <Card
              label="Sleeping"
              value={sleepTimeCombine(
                goals?.activity_sleeping?.start,
                goals?.activity_sleeping?.end
              )}
              frequency={goals?.activity_sleeping?.frequency}
              onPress={() => {
                let startDate = new Date(
                  goals?.activity_sleeping?.start ?? "2025-01-01T00:00:00.000Z"
                );
                let endDate = new Date(
                  goals?.activity_sleeping?.end ?? "2025-01-01T08:00:00.000Z"
                );

                if (isNaN(startDate.getTime())) {
                  console.warn("Start date không hợp lệ");
                  startDate = new Date("2025-01-01T00:00:00.000Z");
                }

                if (isNaN(endDate.getTime())) {
                  console.warn("End date không hợp lệ");
                  endDate = new Date("2025-01-01T08:00:00.000Z");
                }

                // rồi mới dùng startDate, endDate
                handleNavigate("sleep", undefined, undefined, {
                  start: startDate.toISOString(),
                  end: endDate.toISOString(),
                  frequency: goals?.activity_sleeping?.frequency ?? "Daily",
                });
              }}
              isTimeRange
              isLoading={isGoalsLoading}
              isSetGoal={goals?.activity_sleeping ? false : true}
            />
          </View>

          <View style={styles.sectionGroup}>
            <Text style={styles.sectionTitle}>Health</Text>
            <Card
              label="Weight"
              value={
                goals?.health_weight?.target
                  ? goals.health_weight.target.toFixed(1)
                  : undefined
              }
              frequency="Target value"
              unit={goals?.health_weight?.unit}
              onPress={() =>
                handleNavigate("weight", undefined, {
                  target: goals?.health_weight?.target ?? 0,
                  unit: goals?.health_weight?.unit ?? "calories",
                })
              }
              isLoading={isGoalsLoading}
              isSetGoal={goals?.health_weight ? false : true}
            />
            <Card
              label="Body fat percentage"
              value={
                goals?.health_bodyFatPercentage?.target
                  ? goals.health_bodyFatPercentage.target.toFixed(1)
                  : undefined
              }
              unit={goals?.health_bodyFatPercentage?.unit}
              frequency="Target value"
              onPress={() =>
                handleNavigate("bodyFat", undefined, {
                  target: goals?.health_bodyFatPercentage?.target ?? 0,
                  unit: goals?.health_bodyFatPercentage?.unit ?? "%",
                })
              }
              isLoading={isGoalsLoading}
              isSetGoal={goals?.health_bodyFatPercentage ? false : true}
            />
          </View>

          <View style={styles.sectionGroup}>
            <Text style={styles.sectionTitle}>Nutrition</Text>
            <Card
              label="Food"
              value={goals?.nutrition_food?.value}
              frequency={goals?.nutrition_food?.frequency}
              unit={goals?.nutrition_food?.unit}
              onPress={() =>
                handleNavigate("food", {
                  value: goals?.nutrition_food?.value ?? 0,
                  unit: goals?.nutrition_food?.unit ?? "calories",
                  frequency: goals?.nutrition_food?.frequency ?? "Daily",
                })
              }
              isLoading={isGoalsLoading}
              isSetGoal={goals?.nutrition_food ? false : true}
            />
            <Card
              label="Energy burned"
              value={goals?.nutrition_energyBurned?.value}
              frequency={goals?.nutrition_energyBurned?.frequency}
              unit={goals?.nutrition_energyBurned?.unit}
              onPress={() =>
                handleNavigate("energyBurned", {
                  value: goals?.nutrition_energyBurned?.value ?? 0,
                  unit: goals?.nutrition_energyBurned?.unit ?? "calories",
                  frequency:
                    goals?.nutrition_energyBurned?.frequency ?? "Daily",
                })
              }
              isLoading={isGoalsLoading}
              isSetGoal={goals?.nutrition_energyBurned ? false : true}
            />
            <Card
              label="Water"
              value={
                goals?.nutrition_water?.value
                  ? goals.nutrition_water.value.toFixed(2)
                  : undefined
              }
              frequency={goals?.nutrition_water?.frequency}
              unit={goals?.nutrition_water?.unit}
              onPress={() =>
                handleNavigate("water", {
                  value: goals?.nutrition_water?.value ?? 0,
                  unit: goals?.nutrition_water?.unit ?? "liters",
                  frequency: goals?.nutrition_water?.frequency ?? "Daily",
                })
              }
              isLoading={isGoalsLoading}
              isSetGoal={goals?.nutrition_water ? false : true}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}

function Card({
  label,
  value,
  unit,
  frequency,
  onPress,
  isTimeRange = false,
  isLoading = false,
  isSetGoal = false,
}: any) {
  return (
    <TouchableOpacity
      disabled={isLoading}
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.cardLabel}>{label}</Text>
      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={styles.valueWithArrows}>
          <View style={styles.cardRight}>
            <Text
              style={[styles.cardValue]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {isSetGoal ? "Set goal" : value}
              <Text style={styles.cardUnit}>{unit}</Text>
            </Text>
            {frequency ? (
              <Text style={styles.cardFrequency}>{frequency}</Text>
            ) : null}
          </View>
          <View
            style={[styles.arrowsContainer, isTimeRange && { marginLeft: 10 }]}
          >
            {!isSetGoal ? (
              <>
                <MaterialIcons
                  name="keyboard-arrow-up"
                  size={20}
                  color="#000"
                />
                <MaterialIcons
                  name="keyboard-arrow-down"
                  size={20}
                  color="#000"
                />
              </>
            ) : null}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionGroup: {
    paddingVertical: 16,
  },
  sectionTitle: {
    ...fonts.titleMedium,
    marginBottom: 16,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#333",
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    ...fonts.bodyLarge,
    maxWidth: "60%",
  },
  valueWithArrows: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: 160,
  },
  cardRight: {
    alignItems: "flex-end",
    maxWidth: 150,
  },
  cardValue: {
    ...fonts.titleLarge,
    marginBottom: 2,
  },
  cardUnit: {
    fontSize: 16,
  },
  arrowsContainer: {
    flexDirection: "column",
    justifyContent: "space-around",
    alignItems: "center",
    height: 50,
  },
  cardFrequency: {
    ...fonts.bodySmall,
  },
});
