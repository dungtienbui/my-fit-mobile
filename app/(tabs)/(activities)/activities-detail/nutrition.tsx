export const unstable_settings = {
  headerShown: false,
};

import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons,MaterialIcons } from "@expo/vector-icons";
import { BarChart } from "react-native-chart-kit";
import { useRouter } from "expo-router";
import { Menu, Provider } from "react-native-paper";
const { width: SCREEN_WIDTH } = Dimensions.get("window");
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

const NutritionCard = ({ title, value, unit, diff, diffUnit }) => {

  const isPos = diff >= 0;
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={[styles.cardDiff, { color: isPos ? "#27ae60" : "#e74c3c" }]}>
          {isPos ? "+" : ""}
          {diff} {diffUnit} from yesterday
        </Text>
      </View>
      <Text style={styles.cardValue}>
        {value} <Text style={styles.cardUnit}>{unit}</Text>
      </Text>
    </View>
  );
};

export default function NutritionScreen() {
  const [period, setPeriod] = useState("Week");
  const [menuVisible, setMenuVisible] = useState(false);
  // Thay bằng data thực tế từ hook của bạn
  const weeklyCalories = [4000, 3000, 3200, 2800, 3500, 2900, 3100];
  const weeklyWater = [1500, 3300, 2700, 3100, 2300, 2400, 2800];
  const router = useRouter();
   const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);
  const onAddCalories = () => {
    closeMenu();
    router.push("/(tabs)/(activities)/(add-metric)/add-calories");
  };
  const onAddHydration = () => {
    closeMenu();
    // Xử lý logic khi chọn Add hydration
    router.push("/(tabs)/(activities)/(add-metric)/add-hydration");
  };
  return (
<Provider>
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
    <View style={styles.header}>
    <TouchableOpacity onPress={() => router.back()}>
          <MaterialIcons name="arrow-back-ios" size={24} color="#2ecc71" />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Nutrition</Text>
    <Menu
    visible={menuVisible}
    onDismiss={closeMenu}
    anchor={
    <TouchableOpacity style={styles.addBtn} onPress={openMenu}>
        <Ionicons name="add" size={28} color="#fff" />
    </TouchableOpacity>
    }
    contentStyle={{
    borderRadius: 8,
    backgroundColor: "#fff",
    elevation: 8,
    paddingVertical: 0,
    minWidth: 168,
    marginLeft: -24,
    marginTop: -54, // hoặc thử -60, -80... cho lên gần sát top
  }}
    anchorPosition="bottom"
>
    <Menu.Item
    onPress={onAddCalories}
    title="Add calories"
    titleStyle={{
        fontSize: 16,
        fontWeight: "400",
        color: "#222",
        textAlign: "left",
    }}
    style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 38,
    }}
    />
    <Menu.Item
    onPress={onAddHydration}
    title="Add hydration"
    titleStyle={{
        fontSize: 16,
        fontWeight: "400",
        color: "#222",
        textAlign: "left",
    }}
    style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        minHeight: 38,
    }}
    />
</Menu>
</View>


        {/* Tabs */}
        <View style={styles.tabs}>
          {["Week", "Month"].map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.tab, period === p && styles.tabActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.tabText, period === p && styles.tabTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Nav */}
        <View style={styles.chartNav}>
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={20} color="#2ecc71" />
          </TouchableOpacity>
          <Text style={styles.chartNavText}>
            {period === "Week" ? "This week" : "This month"}
          </Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={20} color="#2ecc71" />
          </TouchableOpacity>
        </View>

        {/* Double Chart (Calories + Water) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chartScroll}
        >
          <View style={{ alignItems: "center" }}>
            <BarChart
              data={{
                labels: DAYS,
                datasets: [{ data: weeklyCalories }],
              }}
              width={SCREEN_WIDTH - 36}
              height={170}
              fromZero
              withInnerLines
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(52,152,219,${opacity})`, // Xanh dương
                labelColor: () => "#555",
                propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: "#eee",
                },
              }}
              style={styles.chart}
              showBarTops={false}
              barPercentage={0.4}
            />
            <Text style={{ color: "#3498db", textAlign: "center", marginTop: 2 }}>
              Calorie (kcal)
            </Text>
          </View>

          {/* Khoảng cách giữa 2 chart */}
          <View style={{ width: 24 }} />

          <View style={{ alignItems: "center" }}>
            <BarChart
              data={{
                labels: DAYS,
                datasets: [{ data: weeklyWater }],
              }}
              width={SCREEN_WIDTH - 36}
              height={170}
              fromZero
              withInnerLines
              chartConfig={{
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(46,204,113,${opacity})`, // Xanh lá
                labelColor: () => "#555",
                propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: "#eee",
                },
              }}
              style={styles.chart}
              showBarTops={false}
              barPercentage={0.4}
            />
            <Text style={{ color: "#2ecc71", textAlign: "center", marginTop: 2 }}>
              Water Consumption (ml)
            </Text>
          </View>
        </ScrollView>

        {/* Custom Legend */}
        <View style={styles.customLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#3498db" }]} />
            <Text style={styles.legendLabel}>Calorie</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: "#2ecc71" }]} />
            <Text style={styles.legendLabel}>Water</Text>
          </View>
        </View>

        {/* Details */}
        <Text style={styles.section}>Today</Text>
        <NutritionCard
          title="Calorie Intake"
          value={2650}
          unit="kcal"
          diff={300}
          diffUnit="kcal"
        />
        <NutritionCard
          title="Water Intake"
          value={1750}
          unit="ml"
          diff={-250}
          diffUnit="ml"
        />

        <Text style={styles.section}>Yesterday</Text>
        <NutritionCard
          title="Calorie Intake"
          value={2600}
          unit="kcal"
          diff={-50}
          diffUnit="kcal"
        />
        <NutritionCard
          title="Water Intake"
          value={2000}
          unit="ml"
          diff={250}
          diffUnit="ml"
        />
      </ScrollView>
    </View>
</Provider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 36 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  headerTitle: {fontSize: 22, fontWeight: "bold", color: "#222"},
  addBtn: { backgroundColor: "#2ecc71",
    padding: 4,
    borderRadius: 7,
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",},

  tabs: {
    flexDirection: "row",
    marginTop: 12,
    marginHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tab: { flex: 1, alignItems: "center", paddingVertical: 8 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: "#2ecc71" },
  tabText: { color: "#888", fontSize: 16 },
  tabTextActive: { color: "#2ecc71", fontWeight: "600" },

  chartNav: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 8,
  },
  chartNavText: {
    marginHorizontal: 12,
    fontSize: 16,
    color: "#2ecc71",
    fontWeight: "500",
  },

  chartScroll: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingLeft: 18,
    paddingRight: 18,
    marginBottom: 8,
  },
  chart: { borderRadius: 8, marginBottom: 4 },

  customLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendColor: {
    width: 18,
    height: 8,
    borderRadius: 2,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 13,
    color: "#555"
  },

  section: {
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 18,
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },

  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fafafa",
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 18,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardTitle: { fontSize: 14, fontWeight: "500", color: "#333" },
  cardDiff: { fontSize: 12, marginTop: 4 },
  cardValue: { fontSize: 18, fontWeight: "600", color: "#111" },
  cardUnit: { fontSize: 14, fontWeight: "400" },
});
