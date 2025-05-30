export const unstable_settings = {
  headerShown: false,
};

import React, { useMemo, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import { format, startOfWeek, addDays, isSameWeek, subWeeks } from "date-fns";
import { useRouter } from "expo-router";
import { useGetHealthMetricsQuery } from "@/store/services/apis/healthMetricsApi";

const SCREEN_WIDTH = Dimensions.get("window").width - 40;

function getLastTenWeeks() {
  // Trả về mảng bắt đầu của 10 tuần gần nhất (từ tuần hiện tại lùi lại)
  let arr = [];
  for (let i = 9; i >= 0; i--) {
    arr.push(startOfWeek(subWeeks(new Date(), i), { weekStartsOn: 0 }));
  }
  return arr;
}

export default function BodyMeasurementScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<"week" | "month">("week");
  const { data = [], isLoading } = useGetHealthMetricsQuery();

  // Lấy data metric (nếu API trả về array of object)
  const weightEntries = useMemo(
    () => data.filter((it) => it.metricType === "weight"),
    [data]
  );
  const heightEntries = useMemo(
    () => data.filter((it) => it.metricType === "height"),
    [data]
  );
  const neckEntries = useMemo(
    () => data.filter((it) => it.metricType === "neck"),
    [data]
  );
  const waistEntries = useMemo(
    () => data.filter((it) => it.metricType === "waist"),
    [data]
  );
  const hipEntries = useMemo(
    () => data.filter((it) => it.metricType === "hip"),
    [data]
  );

  // Dữ liệu chart: 10 tuần gần nhất
  const weeks = getLastTenWeeks();
  const chartLabels = weeks.map((_, i) => i.toString());
  const chartWeights = weeks.map((w) => {
    // Lấy entry weight thuộc tuần này (cùng tuần)
    const entry = weightEntries.find((it) => isSameWeek(new Date(it.date), w, { weekStartsOn: 0 }));
    return entry ? Number(entry.value) : 0;
  });

  // Thông tin tuần này (gần nhất)
  const latestHeight = heightEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const latestWeight = weightEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  // So sánh với tuần trước
  const prevWeek = subWeeks(new Date(), 1);
  const prevWeight = weightEntries.find((it) => isSameWeek(new Date(it.date), prevWeek, { weekStartsOn: 0 }));

  // Neck-waist-hip ratios tuần này (có thể phải lấy thêm field cho phù hợp)
  const latestNeck = neckEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const latestWaist = waistEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
  const latestHip = hipEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#2ecc71" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Body measurements</Text>
        <TouchableOpacity
          style={[styles.headerIcon, styles.headerRightIcon]}
          onPress={() => router.push("/(tabs)/(activities)/(add-metric)/add-body-measurement")}
        >
          <MaterialIcons name="add" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, tab === "week" && styles.tabActive]} onPress={() => setTab("week")}>
          <Text style={tab === "week" ? styles.tabTextActive : styles.tabText}>Week</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, tab === "month" && styles.tabActive]} onPress={() => setTab("month")}>
          <Text style={tab === "month" ? styles.tabTextActive : styles.tabText}>Month</Text>
        </TouchableOpacity>
      </View>

      {/* Chart title + arrows */}
      <View style={styles.chartNav}>
        <TouchableOpacity>
          <Ionicons name="chevron-back" size={28} color="#23C55E" />
        </TouchableOpacity>
        <Text style={styles.chartTitle}>Last ten week</Text>
        <TouchableOpacity>
          <Ionicons name="chevron-forward" size={28} color="#23C55E" />
        </TouchableOpacity>
      </View>

      {/* Chart */}
      <View style={{ paddingHorizontal: 0, marginTop: 4 }}>
        <LineChart
          data={{
            labels: chartLabels,
            datasets: [
              {
                data: chartWeights,
                color: (opacity = 1) => `rgba(39, 202, 74, ${opacity})`,
                strokeWidth: 2,
              },
            ],
          }}
          width={SCREEN_WIDTH}
          height={180}
          yAxisSuffix=""
          withVerticalLines={true}
          withDots={false}
          withShadow={true}
          withInnerLines={true}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(39,202,74,${opacity})`,
            labelColor: (opacity = 1) => `rgba(44,62,80,${opacity})`,
            style: { borderRadius: 16 },
            fillShadowGradient: "#23C55E",
            fillShadowGradientOpacity: 0.4,
            propsForDots: { r: "0" },
            propsForBackgroundLines: { stroke: "#e3e3e3" },
          }}
          bezier
          style={{ borderRadius: 12, marginLeft: -20 }}
        />
        <Text style={{ alignSelf: "center", color: "#444", marginTop: 8, fontSize: 14 }}>
          Your Weight Chart (kg/per week)
        </Text>
      </View>

      {/* Info */}
      <ScrollView style={styles.listWrapper}>
        <Text style={[styles.sectionTitle, { marginTop: 18 }]}>This week</Text>
        {/* Height */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Height</Text>
          <Text style={styles.infoValue}>{latestHeight ? `${latestHeight.value} cm` : "--"}</Text>
          <Text style={styles.infoNote}>Update only if needed</Text>
        </View>
        {/* Weight */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Weight</Text>
          <Text style={styles.infoValue}>{latestWeight ? `${latestWeight.value} kg` : "--"}</Text>
          <Text style={[styles.infoNote, { color: "#23C55E" }]}>
            {latestWeight && prevWeight ? `+${latestWeight.value - prevWeight.value} kg from last week` : ""}
          </Text>
        </View>
        {/* Neck - Waist - Hip */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Neck - Waist - Hip</Text>
          <Text style={styles.infoValue}>
            {latestNeck?.value ?? "--"}-{latestWaist?.value ?? "--"}-{latestHip?.value ?? "--"} cm
          </Text>
          <Text style={[styles.infoNote, { color: "#23C55E" }]}>
            Your ratios are on point
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 36 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    justifyContent: "space-between",
    marginBottom: 2,
    minHeight: 52,
  },
  headerIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: "#23C55E",
    justifyContent: "center",
    alignItems: "center",
  },
  headerRightIcon: {
    backgroundColor: "#23C55E",
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#222", flex: 1, textAlign: "center" },
  tabs: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    marginBottom: 4,
    marginTop: 10,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 26,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
    marginRight: 12,
  },
  tabActive: {
    borderBottomColor: "#23C55E",
  },
  tabText: {
    fontSize: 18,
    color: "#aaa",
    fontWeight: "600",
  },
  tabTextActive: {
    fontSize: 18,
    color: "#23C55E",
    fontWeight: "bold",
  },
  chartNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    marginTop: 12,
    marginBottom: 2,
  },
  chartTitle: {
    alignSelf: "center",
    color: "#23C55E",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 0,
  },
  listWrapper: { paddingHorizontal: 14, flex: 1, marginTop: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8, marginTop: 14 },
  infoCard: {
    borderWidth: 1,
    borderColor: "#e6e6e6",
    borderRadius: 14,
    backgroundColor: "#fff",
    marginBottom: 13,
    padding: 15,
    elevation: 1,
    shadowColor: "#bbb",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  infoTitle: { fontSize: 18, fontWeight: "bold", color: "#222" },
  infoValue: { fontSize: 17, fontWeight: "bold", color: "#222", marginVertical: 4 },
  infoNote: { fontSize: 14, color: "#e67e22" },
});