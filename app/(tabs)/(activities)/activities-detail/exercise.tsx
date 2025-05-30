export const unstable_settings = {
  headerShown: false,
};

import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useGetHealthMetricsQuery } from "@/store/services/apis/healthMetricsApi";
import { format, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay, isWithinInterval } from "date-fns";
import { useRouter } from "expo-router";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const ExerciseScreen = () => {
  const router = useRouter();
  const { data = [], isLoading } = useGetHealthMetricsQuery();
  const [activeTab, setActiveTab] = useState<'week' | 'month'>('week');

  // Lọc các entry là exercise
  const exerciseEntries = useMemo(
    () => data.filter((item) => item.metricType === "exercise"),
    [data]
  );

  // Tính toán khoảng week và month
  const weekRange = {
    start: startOfWeek(new Date(), { weekStartsOn: 0 }),
    end: endOfWeek(new Date(), { weekStartsOn: 0 }),
  };
  const monthRange = {
    start: startOfMonth(new Date()),
    end: endOfMonth(new Date()),
  };

  // Filter các entry theo week hoặc month
  const filteredEntries = useMemo(() => {
    if (activeTab === "week") {
      return exerciseEntries.filter(item => {
        const d = new Date(item.date);
        return isWithinInterval(d, weekRange);
      });
    } else {
      return exerciseEntries.filter(item => {
        const d = new Date(item.date);
        return isWithinInterval(d, monthRange);
      });
    }
  }, [exerciseEntries, activeTab, weekRange, monthRange]);

  // Group theo ngày (yyyy-MM-dd)
  const activityByDate = useMemo(() => {
    const map: { [date: string]: any[] } = {};
    filteredEntries.forEach((item) => {
      const date = format(new Date(item.date), "yyyy-MM-dd");
      if (!map[date]) map[date] = [];
      map[date].push(item);
    });
    // Sắp xếp ngày giảm dần
    return Object.entries(map)
      .sort((a, b) => (a[0] < b[0] ? 1 : -1))
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});
  }, [filteredEntries]);

  // Đếm số ngày có tập luyện (cho progress week)
  const daysChecked = useMemo(() => {
    const checked: number[] = [];
    filteredEntries.forEach((item) => {
      const d = new Date(item.date);
      const dayIdx = d.getDay();
      if (!checked.includes(dayIdx)) checked.push(dayIdx);
    });
    return checked;
  }, [filteredEntries]);

  // Format section title (today, yesterday, hoặc tên thứ/ngày)
  const today = format(new Date(), "yyyy-MM-dd");
  const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
  const getSectionTitle = (date: string) => {
    if (date === today) return "Today";
    if (date === yesterday) return "Yesterday";
    // Format: Sun, Apr 4
    return format(new Date(date), "EEE, MMM d");
  };

  // Sắp xếp các ngày giảm dần
  const sortedDates = Object.keys(activityByDate);

  // Event khi click vào từng activity
//   const handleActivityPress = (item) => {
//     Alert.alert("Edit Activity", `Activity: ${capitalize(item.exerciseDetails?.activityName || "")}`);
//   };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#2ecc71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Exercise Detail</Text>
        <TouchableOpacity style={styles.plusBtn} onPress={() => router.push("/(tabs)/(activities)/(add-metric)/add-exercise")}>
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "week" && styles.tabActive]}
          onPress={() => setActiveTab("week")}
        >
          <Text style={activeTab === "week" ? styles.tabTextActive : styles.tabText}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "month" && styles.tabActive]}
          onPress={() => setActiveTab("month")}
        >
          <Text style={activeTab === "month" ? styles.tabTextActive : styles.tabText}>Month</Text>
        </TouchableOpacity>
      </View>

      {/* Progress tuần */}
      <View style={styles.progressWrapper}>
        <View style={styles.weekNav}>
          {/* Có thể thêm sự kiện chuyển tuần/tháng ở đây */}
          <Ionicons name="chevron-back" size={22} color="#2ecc71" />
          <Text style={styles.thisWeek}>{activeTab === "week" ? "This week" : "This month"}</Text>
          <Ionicons name="chevron-forward" size={22} color="#2ecc71" />
        </View>
        <View style={styles.progressBox}>
          <Text style={styles.progressText}>
            <Text style={styles.bold}>{daysChecked.length}</Text> of <Text style={styles.bold}>5</Text> exercise days to goal
          </Text>
          <View style={styles.daysRow}>
            {DAYS.map((d, idx) => (
              <View
                key={idx}
                style={[
                  styles.dayCircle,
                  daysChecked.includes(idx)
                    ? { backgroundColor: "#38CE38" }
                    : { backgroundColor: "#C3DDFF", opacity: 0.6 },
                ]}
              >
                <Text
                  style={[
                    styles.dayLabel,
                    daysChecked.includes(idx)
                      ? { color: "#fff" }
                      : { color: "#222" },
                  ]}
                >
                  {d}
                </Text>
                {daysChecked.includes(idx) && (
                  <Ionicons name="checkmark" size={16} color="#fff" />
                )}
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Activities - ALL days */}
      <ScrollView style={styles.listWrapper}>
        {sortedDates.map((date) => (
          <View key={date}>
            <Text style={styles.sectionTitle}>{getSectionTitle(date)}</Text>
            {activityByDate[date].map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.activityCard}
                onPress={() => handleActivityPress(item)}
                activeOpacity={0.75}
              >
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={styles.activityName}>{capitalize(item.exerciseDetails?.activityName || "")}</Text>
                    <Text style={styles.timeLabel}>{format(new Date(item.date), "h:mm a")}</Text>
                  </View>
                  <Text style={styles.activityDesc}>
                    {item.value ? `${item.value} km` : ""}
                    {item.exerciseDetails?.duration
                      ? ` - ${item.exerciseDetails.duration} min`
                      : ""}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default ExerciseScreen;

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
  progressWrapper: { paddingHorizontal: 16, marginBottom: 10 },
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  thisWeek: { fontWeight: "bold", fontSize: 15, color: "#2ecc71" },
  progressBox: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 9,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 4,
  },
  progressText: { fontSize: 15, marginBottom: 5, color: "#222" },
  bold: { fontWeight: "bold", fontSize: 25, color: "#2ecc71" },
  daysRow: { flexDirection: "row", justifyContent: "space-between" },
  dayCircle: {
    width: 34,
    height: 58,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
    flexDirection: "column",
  },
  dayLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  listWrapper: { paddingHorizontal: 14, flex: 1 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginTop: 12, marginBottom: 4 },
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
  activityDesc: { fontSize: 14, color: "#555", marginBottom: 4, alignSelf: "flex-end" },
  timeLabel: { fontSize: 13, color: "#888" },
});
