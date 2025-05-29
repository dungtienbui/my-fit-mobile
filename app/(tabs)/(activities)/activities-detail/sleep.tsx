export const unstable_settings = {
  headerShown: false,
};
import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useGetHealthMetricsQuery } from "@/store/services/apis/healthMetricsApi";
import { BarChart } from "react-native-chart-kit";
import { format, subDays, startOfWeek, endOfWeek, isSameWeek, isSameMonth } from "date-fns";
import { useRouter } from "expo-router";

// Helper
const getSleepEntries = (data: any[]) => data.filter((i) => i.metricType === "sleep");

const DAYS = ["S", "M", "T", "W", "T", "F", "S"];
const SCREEN_WIDTH = Dimensions.get("window").width - 40;

const SleepScreen = () => {
  const router = useRouter();
  const { data = [], isLoading } = useGetHealthMetricsQuery();
  const [tab, setTab] = useState<"week" | "month">("week");

  // --- Filter dữ liệu ---
  const sleepEntries = useMemo(() => getSleepEntries(data), [data]);
  const today = new Date();

  // Tuần hiện tại
  const weekStart = startOfWeek(today, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(today, { weekStartsOn: 0 });
  // Tháng hiện tại
  const month = today.getMonth();
  const year = today.getFullYear();

  // Group theo ngày (format yyyy-MM-dd)
  const sleepByDay: { [date: string]: any[] } = {};
  sleepEntries.forEach((item) => {
    const d = format(new Date(item.date), "yyyy-MM-dd");
    if (!sleepByDay[d]) sleepByDay[d] = [];
    sleepByDay[d].push(item);
  });

  // Lấy số giờ/ngày trong tuần
  const sleepHourByDay = DAYS.map((_, idx) => {
    // idx = 0: Sunday, 1: Monday...
    const d = format(subDays(weekEnd, 6 - idx), "yyyy-MM-dd");
    const entries = sleepByDay[d] || [];
    // Tổng giờ ngủ cho ngày đó
    const min = entries.reduce((sum, it) => sum + (Number(it.value) || 0), 0);
    // Đổi phút -> giờ, làm tròn 1 số lẻ
    return +(min / 60).toFixed(1);
  });

  // Lấy sleep logs cho tuần/tháng hiện tại
  const logs =
    tab === "week"
      ? sleepEntries.filter((it) => isSameWeek(new Date(it.date), today, { weekStartsOn: 0 }))
      : sleepEntries.filter((it) => {
          const d = new Date(it.date);
          return d.getMonth() === month && d.getFullYear() === year;
        });

  // Group theo ngày cho section list
  const groupedLogs: { [date: string]: any[] } = {};
  logs.forEach((item) => {
    const d = format(new Date(item.date), "yyyy-MM-dd");
    if (!groupedLogs[d]) groupedLogs[d] = [];
    groupedLogs[d].push(item);
  });
  // Sort ngày giảm dần (mới nhất lên trước)
  const sortedDates = Object.keys(groupedLogs).sort((a, b) => (a < b ? 1 : -1));

  // Format thời gian hiển thị
  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    let h = d.getHours();
    const m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  // Tính tổng số giờ, phút từ phút
  const minToHourMin = (min: number) => {
    const h = Math.floor(min / 60);
    const m = min % 60;
    return `${h}h${m > 0 ? m + "m" : ""}`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#2ecc71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sleep</Text>
        <TouchableOpacity
          style={styles.plusBtn}
          onPress={() => {
            router.push("/(tabs)/(activities)/(add-metric)/add-sleep");
          }}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, tab === "week" && styles.tabActive]}
          onPress={() => setTab("week")}
        >
          <Text style={tab === "week" ? styles.tabTextActive : styles.tabText}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, tab === "month" && styles.tabActive]}
          onPress={() => setTab("month")}
        >
          <Text style={tab === "month" ? styles.tabTextActive : styles.tabText}>Month</Text>
        </TouchableOpacity>
      </View>

      {/* Progress tuần - Chart */}
      <View style={{ paddingHorizontal: 12, marginTop: 8 }}>
        <BarChart
          data={{
            labels: DAYS,
            datasets: [{ data: sleepHourByDay }],
          }}
          width={SCREEN_WIDTH}
          height={170}
          fromZero
          yAxisSuffix="h"
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(52, 73, 94, ${opacity})`,
            style: { borderRadius: 16 },
            propsForBackgroundLines: { stroke: "#e3e3e3" },
          }}
          style={{ borderRadius: 12 }}
        />
      </View>

      {/* Logs by date */}
      <ScrollView style={styles.listWrapper}>
        {sortedDates.map((d, idx) => {
          // Section title: today, yesterday, else: Sun, Apr 4
          const dObj = new Date(d);
          let section = format(dObj, "EEE, MMM d");
          if (format(dObj, "yyyy-MM-dd") === format(today, "yyyy-MM-dd"))
            section = "Today";
          else if (
            format(dObj, "yyyy-MM-dd") ===
            format(subDays(today, 1), "yyyy-MM-dd")
          )
            section = "Yesterday";

          return (
            <View key={d + idx}>
              <Text style={styles.sectionTitle}>{section}</Text>
              {groupedLogs[d].map((item, i) => (
                <TouchableOpacity key={item._id + i} style={styles.activityCard}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                    <Text style={styles.activityName}>Sleep time</Text>
                    <Text style={styles.activityDesc}>
                      {minToHourMin(Number(item.value))}
                    </Text>
                  </View>
                  <Text style={styles.timeLabel}>
                    {formatTime(item.date)}
                    {" - "}
                    {formatTime(
                      item.exerciseDetails?.endDate
                        ? item.exerciseDetails.endDate
                        : new Date(new Date(item.date).getTime() + (Number(item.value) || 0) * 60000)
                    )}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SleepScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#222" },
  plusBtn: {
    backgroundColor: "#2ecc71",
    padding: 4,
    borderRadius: 7,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginRight: 16,
  },
  tabActive: {
    borderBottomColor: "#2ecc71",
  },
  tabText: {
    fontSize: 16,
    color: "#888",
    fontWeight: "600",
  },
  tabTextActive: {
    fontSize: 16,
    color: "#2ecc71",
    fontWeight: "bold",
  },
  listWrapper: { paddingHorizontal: 14, flex: 1, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 18, marginBottom: 4 },
  activityCard: {
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 12,
    backgroundColor: "#fff",
    marginBottom: 8,
    padding: 14,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  activityName: { fontSize: 17, fontWeight: "bold", color: "#222" },
  activityDesc: { fontSize: 15, color: "#27ae60", fontWeight: "bold" },
  timeLabel: { fontSize: 13, color: "#888" },
});
