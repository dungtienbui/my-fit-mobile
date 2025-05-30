import IconButton from "@/components/button/IconButton";
import TodayTargetCard from "@/components/card/TodayTargetCard";
import ScreenTitle from "@/components/screen/ScreenTitle";
import { selectTodayData } from "@/store/features/user/todayDataSlice";
import { selectUserInfo } from "@/store/features/user/userSlice";
import { useGetGoalsQuery } from "@/store/services/apis/goalsApi";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect } from "react";
import {
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";

export default function TodayTarget() {
  const userInfo = useSelector(selectUserInfo);

  const todayData = useSelector(selectTodayData);

  const {
    data: goals,
    error: goalsErorr,
    isLoading: goalsIsLoading,
  } = useGetGoalsQuery();

  useEffect(() => {
    if (userInfo._id === null) {
      Toast.show({
        type: "error",
        text1: "Can't load your info :((",
        text2: "Please logout and login again!",
      });
    }

    if (
      userInfo.weight === undefined ||
      userInfo.height === undefined ||
      userInfo.age === undefined
    ) {
      let missingFields = [];

      if (userInfo.weight === undefined) missingFields.push("weight");
      if (userInfo.height === undefined) missingFields.push("height");
      if (userInfo.age === undefined) missingFields.push("age");

      Toast.show({
        type: "info",
        text1: "Ooh!",
        text2: `Your missing: ${missingFields.join(
          ", "
        )}. Please update your info!`,
      });
    }
  }, [userInfo]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenTitle
        title="Today target"
        LeadingIconButton={
          <IconButton
            icon={<Ionicons name="arrow-back" size={15} color="#fff" />}
            onPress={() => {
              router.back();
            }}
          />
        }
        style={{ marginTop: Platform.OS === "android" ? 40 : 0 }}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.infoCard}>
            <Image
              style={styles.avatar}
              source={require("../../../assets/images/maleAvatar.png")}
              resizeMode="contain"
            />
            <View style={{ gap: 5 }}>
              <Text
                style={
                  userInfo.name
                    ? { ...fonts.titleLarge }
                    : { ...fonts.titleMedium }
                }
              >
                {userInfo.name ? userInfo.name : "N/A"}
              </Text>
              <View
                style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              >
                <Ionicons
                  name="location-outline"
                  size={15}
                  color={colors.tertiary1}
                />
                <Text style={{ ...fonts.bodySmall, color: "#A3A3A3" }}>
                  Ho Chi Minh city, Vietnam
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Body measurements</Text>
            <View style={styles.bodyMeasurementsSection}>
              <View style={styles.measurementContainer}>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text
                    style={
                      userInfo.weight
                        ? styles.measurementValue
                        : { ...fonts.titleMedium }
                    }
                  >
                    {userInfo.weight ? userInfo.weight : "N/A"}
                  </Text>
                  <Text style={styles.measurementUnit}>kg</Text>
                </View>
                <Text style={styles.measurementType}>Weight</Text>
              </View>

              <View style={styles.measurementContainer}>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text
                    style={
                      userInfo.height
                        ? styles.measurementValue
                        : { ...fonts.titleMedium }
                    }
                  >
                    {userInfo.height ? userInfo.height : "N/A"}
                  </Text>
                  <Text style={styles.measurementUnit}>cm</Text>
                </View>
                <Text style={styles.measurementType}>Height</Text>
              </View>

              <View style={styles.measurementContainer}>
                <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
                  <Text
                    style={
                      userInfo.age
                        ? styles.measurementValue
                        : { ...fonts.titleMedium }
                    }
                  >
                    {userInfo.age ? userInfo.age : "N/A"}
                  </Text>
                  <Text style={styles.measurementUnit}>yrs</Text>
                </View>
                <Text style={styles.measurementType}>Age</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Today Target</Text>
            <View style={styles.todayTargetSection}>
              <TodayTargetCard
                typeTarget="Walking"
                target={
                  goals?.activity_steps
                    ? goals?.activity_steps.value.toString()
                    : todayData.walking.toString()
                }
                todayValue={todayData.walking.toString()}
                unit="step"
                image={require("../../../assets/images/today-target/walking.png")}
                width="100%"
              />
              <TodayTargetCard
                typeTarget="Water"
                target={
                  goals?.nutrition_water
                    ? goals?.nutrition_water.value.toFixed(2)
                    : todayData.water.toFixed(2)
                }
                todayValue={todayData.water.toFixed(2)}
                unit="L"
                image={require("../../../assets/images/today-target/walking.png")}
                width="100%"
              />
              <TodayTargetCard
                typeTarget="Calories"
                target={
                  goals?.nutrition_energyBurned
                    ? goals?.nutrition_energyBurned.value.toString()
                    : todayData.calories.toString()
                }
                todayValue={todayData.walking.toString()}
                unit="Kcal"
                image={require("../../../assets/images/today-target/calories.png")}
                width="100%"
              />
              <TodayTargetCard
                typeTarget="Sleeping"
                target={
                  goals?.activity_sleeping
                    ? getSleepDuration(
                        new Date(goals?.activity_sleeping.start),
                        new Date(goals?.activity_sleeping.end)
                      )
                    : todayData.sleep.toFixed(2)
                }
                todayValue={formatMinutesToHoursMinutes(todayData.sleep)}
                unit=""
                image={require("../../../assets/images/today-target/sleeping.png")}
                width="100%"
              />

              <TodayTargetCard
                typeTarget="Activity time"
                target={
                  goals?.activity_exerciseHours
                    ? goals?.activity_exerciseHours.value.toFixed(2)
                    : todayData.activityTime.toFixed(2)
                }
                todayValue={todayData.activityTime.toFixed(2)}
                unit="h"
                image={require("../../../assets/images/today-target/activity.png")}
                width="100%"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  infoCard: {
    width: "100%",
    padding: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  avatar: {
    width: 50,
    height: 50,
  },

  section: {
    width: "100%",
  },
  sectionTitle: {
    ...fonts.titleMedium,
    marginBottom: 15,
  },
  bodyMeasurementsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 15,
  },

  measurementContainer: {},
  measurementValue: {
    ...fonts.headlineSmall,
    fontFamily: "Roboto_500Medium",
  },
  measurementUnit: {
    ...fonts.bodyMedium,
    color: "#A3A3A3",
  },
  measurementType: {
    ...fonts.labelLarge,
    color: "#525252",
  },

  todayTargetSection: {
    gap: 20,
    marginBottom: 20,
  },
});

function getSleepDuration(date1: Date, date2: Date): string {
  if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
    return "0 hours";
  }

  const h1 = date1.getHours();
  const m1 = date1.getMinutes();

  const h2 = date2.getHours();
  const m2 = date2.getMinutes();

  let totalMinutes = 0;

  if (h2 > h1 || (h2 === h1 && m2 >= m1)) {
    // same day or later in the day
    totalMinutes = (h2 - h1) * 60 + (m2 - m1);
  } else {
    // crosses midnight
    totalMinutes = (24 - h1) * 60 - m1 + h2 * 60 + m2;
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours !== 0 && minutes !== 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours !== 0) {
    return `${hours} hours`;
  } else if (minutes !== 0) {
    return `${minutes} minutes`;
  } else {
    return "0 hours";
  }
}

function formatMinutesToHoursMinutes(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours !== 0 && minutes !== 0) {
    return `${hours}h ${minutes}m`;
  } else if (hours !== 0) {
    return `${hours} hours`;
  } else if (minutes !== 0) {
    return `${minutes} minutes`;
  } else {
    return "0 hours";
  }
}

// const {
//   data: exerciseData,
//   error: exerciseError,
//   isLoading: exerciseIsLoading,
// } = useGetHealthMetricsByDateAndTypeQuery({
//   date: new Date(),
//   metricType: "exercise",
// });

// const {
//   data: weightData,
//   error: weightError,
//   isLoading: weightIsLoading,
// } = useGetHealthMetricsByDateAndTypeQuery({
//   date: new Date(),
//   metricType: "weight",
// });

// const {
//   data: heightData,
//   error: heightError,
//   isLoading: heightIsLoading,
// } = useGetHealthMetricsByDateAndTypeQuery({
//   date: new Date(),
//   metricType: "height",
// });

// const {
//   data: sleepData,
//   error: sleepError,
//   isLoading: sleepIsLoading,
// } = useGetHealthMetricsByDateAndTypeQuery({
//   date: new Date(),
//   metricType: "sleep",
// });
