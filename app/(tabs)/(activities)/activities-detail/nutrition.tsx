import IconButton from "@/components/button/IconButton";
import RecordCard from "@/components/card/RecordCard";
import ScreenTitle from "@/components/screen/ScreenTitle";
import { useGetHealthMetricsByDateRangeAndTypeQuery } from "@/store/services/apis/healthMetricsApi";
import { HealthMetricResponseDto } from "@/store/services/dto/response/healthMetricsResponseDto";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/shadow";
import { Ionicons } from "@expo/vector-icons";
import {
  endOfWeek,
  format,
  isToday,
  isYesterday,
  parseISO,
  startOfWeek,
} from "date-fns";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  SafeAreaView,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";

type SectionData = {
  title: string;
  data: HealthMetricResponseDto[];
};

const BodyMeasurementScreen = () => {
  const [typeMeasurement, setTypeMeasurement] = useState<"calories" | "water">(
    "calories"
  );

  const { weekStart, weekEnd } = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    return { weekStart, weekEnd };
  }, []);

  const [dataCaloriesRender, setCaloriesDataDataRender] = useState<
    SectionData[]
  >([]);
  const [dataWaterRender, setWaterDataRender] = useState<SectionData[]>([]);

  const {
    data: caloriesData,
    isLoading: caloriesLoading,
    error: caloriesError,
  } = useGetHealthMetricsByDateRangeAndTypeQuery({
    metricType: "calories",
    start: weekStart,
    end: weekEnd,
  });

  const {
    data: waterData,
    isLoading: waterLoading,
    error: waterError,
  } = useGetHealthMetricsByDateRangeAndTypeQuery({
    metricType: "water",
    start: weekStart,
    end: weekEnd,
  });

  const formatSectionTitle = (dateStr: string): string => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEE, MM/dd/yyyy"); // Example: "Fri, 05/30/2025"
  };

  const groupByDate = (items: HealthMetricResponseDto[]): SectionData[] => {
    const grouped: Record<string, HealthMetricResponseDto[]> = {};

    items.forEach((item) => {
      const title = formatSectionTitle(item.date);
      if (!grouped[title]) grouped[title] = [];
      grouped[title].push(item);
    });

    // Convert to array and sort sections by date descending
    return Object.entries(grouped)
      .map(([title, data]) => ({ title, data }))
      .sort((a, b) => {
        const dateA = parseISO(a.data[0].date);
        const dateB = parseISO(b.data[0].date);
        return dateB.getTime() - dateA.getTime();
      });
  };

  useEffect(() => {
    if (caloriesData) {
      console.log("caloriesData: ", caloriesData);
      const groupedData = groupByDate(caloriesData);
      // console.log("groupedData: ", JSON.stringify(groupedData));
      setCaloriesDataDataRender(groupedData);
    }

    if (waterData) {
      console.log("waterData: ", waterData);
      const groupedData = groupByDate(waterData);
      // console.log("groupedData: ", JSON.stringify(groupedData));
      setWaterDataRender(groupedData);
    }
  }, [caloriesData, waterData]);

  useEffect(() => {
    if (caloriesError) {
      console.error("Calories error: ", caloriesError);
    }

    if (waterError) {
      console.error("Water error: ", waterError);
    }
  }, [caloriesError, waterError]);

  const measureTypeOptions = [
    { label: "Calories intake", value: "calories" },
    { label: "Water intake", value: "water" },
  ];
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <ScreenTitle
        title="Nutrition intake"
        LeadingIconButton={
          <IconButton
            icon={<Ionicons name="arrow-back" size={15} color="#fff" />}
            onPress={() => {
              router.back();
            }}
          />
        }
        TrailingIconButton={
          <Dropdown
            onChange={(item) => {
              console.log("item: ", item.value);
              if (item.value === "calories") {
                router.push("/(tabs)/(activities)/(add-metric)/add-calories");
                setTypeMeasurement("calories");
              } else if (item.value === "water") {
                router.push("/(tabs)/(activities)/(add-metric)/add-hydration");
                setTypeMeasurement("water");
              }
            }}
            data={measureTypeOptions}
            labelField="label"
            valueField="value"
            maxHeight={300}
            containerStyle={{
              width: 200,
              marginLeft: -160,
              marginTop: -5,
              ...shadow.heavy,
            }}
            renderRightIcon={() => (
              <View
                style={{
                  padding: 12,
                  borderRadius: 4,
                  backgroundColor: colors.primary1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name="add" size={15} color="#fff" />
              </View>
            )}
          />
        }
        style={{ marginTop: Platform.OS === "android" ? 40 : 0 }}
      />

      {/* Progress tuần */}
      <View style={styles.progressWrapper}>
        <View style={styles.weekNav}>
          <Ionicons name="chevron-back" size={30} color={colors.primary1} />
          {(typeMeasurement === "calories" && caloriesLoading) ||
          (typeMeasurement === "water" && waterLoading) ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.thisWeek}>This week</Text>
          )}
          <Ionicons name="chevron-forward" size={30} color={colors.primary1} />
        </View>
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => {
              setTypeMeasurement("calories");
            }}
            style={[
              styles.tabItemContainer,
              typeMeasurement === "calories" && styles.tabItemContainerSelected,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                typeMeasurement === "calories" && styles.tabTextSelected,
              ]}
            >
              Calories
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setTypeMeasurement("water");
            }}
            style={[
              styles.tabItemContainer,
              typeMeasurement === "water" && styles.tabItemContainerSelected,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                typeMeasurement === "water" && styles.tabTextSelected,
              ]}
            >
              Water
            </Text>
          </Pressable>
        </View>
        {/* <View style={styles.progressBox}>
          <Text style={styles.progressText}>
            <Text style={styles.checkedDayNumber}>
              {dateChecked.reduce((acc, curr) => acc + (curr ? 1 : 0), 0)}
            </Text>{" "}
            of <Text style={styles.checkedDayNumber}>5</Text> exercise days to
            goal
          </Text>
          <View style={styles.daysRow}>
            {DaysOfWeek.map((dayName, idx) => (
              <View key={idx} style={{ alignItems: "center", gap: 5 }}>
                <View
                  style={[
                    styles.dayCircle,
                    dateChecked[idx]
                      ? { backgroundColor: colors.primary1 }
                      : { backgroundColor: colors.secondary1 },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayLabel,
                      dateChecked[idx] ? { color: "#fff" } : { color: "#000" },
                    ]}
                  >
                    {dayName}
                  </Text>
                  {dateChecked[idx] && (
                    <Ionicons name="checkmark" size={16} color="#fff" />
                  )}
                </View>
                {idx === TodayDayNumber ? (
                  <Ionicons
                    name="thumbs-up"
                    size={10}
                    color={colors.secondary2}
                  />
                ) : undefined}
              </View>
            ))}
          </View>
        </View> */}
      </View>

      {/* data tuần */}
      <SectionList
        contentContainerStyle={{
          paddingLeft: 15,
          paddingRight: 20,
          paddingBottom: 20,
        }}
        sections={
          typeMeasurement === "calories"
            ? dataCaloriesRender
            : typeMeasurement === "water"
            ? dataWaterRender
            : []
        }
        keyExtractor={(item, index) => item.date + index}
        renderItem={({ item }) => (
          <RecordCard
            value={
              typeMeasurement === "calories"
                ? `+${item.value.toString()} cal`
                : typeMeasurement === "water"
                ? `${item.value.toFixed(2)} L`
                : "N/A"
            }
            datetime={
              typeMeasurement === "calories"
                ? `${item.mealDetails?.mealType ?? "Food"} - ${format(
                    new Date(item.date),
                    "HH:mm"
                  )}`
                : typeMeasurement === "water"
                ? `${format(new Date(item.date), "HH:mm")}`
                : "N/A"
            }
            recordType={
              typeMeasurement === "calories"
                ? item.mealDetails?.foodName ?? "N/A"
                : typeMeasurement === "water"
                ? "Drink"
                : "N/A"
            }
            width="100%"
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        ListEmptyComponent={
          <View style={{ marginTop: 25 }}>
            <Text
              style={{
                ...fonts.titleMedium,
                textAlign: "center",
                color: colors.tertiary3,
              }}
            >
              No record data
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

{
  /* <RecordCard
  value={`${item.value ? `${item.value} km` : "0 km"} - ${
    item.exerciseDetails?.duration ?? 0
  } min`}
  datetime={format(new Date(item.date), "h:mm a")}
  recordType={capitalize(item.exerciseDetails?.activityName ?? "Exercise")}
  width="100%"
/>; */
}

export default BodyMeasurementScreen;

const styles = StyleSheet.create({
  progressWrapper: {
    padding: 10,
    alignItems: "center",
  },
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
    width: "80%",
  },
  thisWeek: {
    ...fonts.titleMedium,
    color: colors.secondary2,
  },
  progressBox: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    gap: 10,
  },
  progressText: {
    ...fonts.bodyMedium,
  },
  checkedDayNumber: {
    ...fonts.displaySmall,
  },
  daysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dayCircle: {
    width: 35,
    height: 60,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  dayLabel: {
    ...fonts.titleSmall,
  },
  sectionHeader: {
    ...fonts.titleMedium,
    paddingLeft: 10,
    marginTop: 10,
  },
  tabContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  tabItemContainer: {
    flexGrow: 1,
    paddingVertical: 8,
  },
  tabText: {
    ...fonts.titleSmall,
    textAlign: "center",
  },
  tabItemContainerSelected: {
    borderBottomWidth: 2,
    borderBottomColor: colors.secondary2,
  },
  tabTextSelected: {
    color: colors.secondary2,
  },
});
