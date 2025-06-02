import IconButton from "@/components/button/IconButton";
import RecordCard from "@/components/card/RecordCard";
import ScreenTitle from "@/components/screen/ScreenTitle";
import { useGetHealthMetricsByDateRangeAndTypeQuery } from "@/store/services/apis/healthMetricsApi";
import { HealthMetricResponseDto } from "@/store/services/dto/response/healthMetricsResponseDto";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
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

type SectionData = {
  title: string;
  data: HealthMetricResponseDto[];
};

const BodyMeasurementScreen = () => {
  const [typeMeasurement, setTypeMeasurement] = useState<"height" | "weight">(
    "height"
  );

  const { weekStart, weekEnd } = useMemo(() => {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
    return { weekStart, weekEnd };
  }, []);

  const [dataHeightRender, setHeightDataRender] = useState<SectionData[]>([]);
  const [dataWeightRender, setWeightDataRender] = useState<SectionData[]>([]);

  const {
    data: heightData,
    isLoading: heightLoading,
    error: heightError,
  } = useGetHealthMetricsByDateRangeAndTypeQuery({
    metricType: "height",
    start: weekStart,
    end: weekEnd,
  });

  const {
    data: weightData,
    isLoading: weightLoading,
    error: weightError,
  } = useGetHealthMetricsByDateRangeAndTypeQuery({
    metricType: "weight",
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
    if (heightData) {
      console.log("heightData: ", heightData);
      const groupedData = groupByDate(heightData);
      // console.log("groupedData: ", JSON.stringify(groupedData));
      setHeightDataRender(groupedData);
    }

    if (weightData) {
      console.log("weightData: ", weightData);
      const groupedData = groupByDate(weightData);
      // console.log("groupedData: ", JSON.stringify(groupedData));
      setWeightDataRender(groupedData);
    }
  }, [heightData, weightData]);

  useEffect(() => {
    if (heightError) {
      console.error("Height error: ", heightError);
    }

    if (weightError) {
      console.error("Weight error: ", heightError);
    }
  }, [heightError, weightError]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <ScreenTitle
        title="Body measurements"
        LeadingIconButton={
          <IconButton
            icon={<Ionicons name="arrow-back" size={15} color="#fff" />}
            onPress={() => {
              router.back();
            }}
          />
        }
        TrailingIconButton={
          <IconButton
            icon={<Ionicons name="add" size={15} color="#fff" />}
            onPress={() => {
              router.push(
                "/(tabs)/(activities)/(add-metric)/add-body-measurement"
              );
            }}
          />
        }
        style={{ marginTop: Platform.OS === "android" ? 40 : 0 }}
      />

      {/* Progress tuần */}
      <View style={styles.progressWrapper}>
        <View style={styles.weekNav}>
          <Ionicons name="chevron-back" size={30} color={colors.primary1} />
          {(typeMeasurement === "height" && heightLoading) ||
          (typeMeasurement === "weight" && weightLoading) ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.thisWeek}>This week</Text>
          )}
          <Ionicons name="chevron-forward" size={30} color={colors.primary1} />
        </View>
        <View style={styles.tabContainer}>
          <Pressable
            onPress={() => {
              setTypeMeasurement("height");
            }}
            style={[
              styles.tabItemContainer,
              typeMeasurement === "height" && styles.tabItemContainerSelected,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                typeMeasurement === "height" && styles.tabTextSelected,
              ]}
            >
              Height
            </Text>
          </Pressable>
          <Pressable
            onPress={() => {
              setTypeMeasurement("weight");
            }}
            style={[
              styles.tabItemContainer,
              typeMeasurement === "weight" && styles.tabItemContainerSelected,
            ]}
          >
            <Text
              style={[
                styles.tabText,
                typeMeasurement === "weight" && styles.tabTextSelected,
              ]}
            >
              Weight
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
          typeMeasurement === "height"
            ? dataHeightRender
            : typeMeasurement === "weight"
            ? dataWeightRender
            : []
        }
        keyExtractor={(item, index) => item.date + index}
        renderItem={({ item }) => (
          <RecordCard
            value={
              typeMeasurement === "height"
                ? `${item.value.toString()} cm`
                : typeMeasurement === "weight"
                ? `${item.value.toFixed(2)} kg`
                : "N/A"
            }
            datetime={` ${format(new Date(item.date), "HH:mm - dd/mm/yyyy")}`}
            recordType={typeMeasurement}
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
