import ScreenTitle from "@/components/screen/ScreenTitle";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { shadow } from "@/theme/shadow";
import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { JSX, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type CollectionItemProps = {
  icon: JSX.Element;
  label: string;
  bgColor: string;
  route: Href;
};

const collectionData: CollectionItemProps[] = [
  {
    icon: <MaterialCommunityIcons name="run" size={45} color="#2ecc71" />,
    label: "Exercise",
    bgColor: "#eafaf1",
    route: "/(tabs)/(activities)/activities-detail/exercise",
  },
  {
    icon: <FontAwesome5 name="bed" size={30} color="#9b59b6" />,
    label: "Sleep",
    bgColor: "#f5ecfc",
    route: "/(tabs)/(activities)/activities-detail/sleep",
  },
  {
    icon: <Ionicons name="body" size={40} color="#3498db" />,
    label: "Body measurements",
    bgColor: "#eaf3fc",
    route: "/(tabs)/(activities)/activities-detail/body-measurement",
  },
  {
    icon: <Entypo name="bowl" size={40} color="#e67e22" />,
    label: "Nutrition",
    bgColor: "#fef2e7",
    route: "/(tabs)/(activities)/activities-detail/nutrition",
  },
];

const SCREEN_WIDTH = Dimensions.get("window").width;

const MENU_WIDTH = Math.round(SCREEN_WIDTH * 0.8);

export default function CollectionScreen() {
  const router = useRouter();

  const CollectionItem = ({
    icon,
    label,
    bgColor,
    route,
  }: CollectionItemProps) => {
    return (
      <TouchableOpacity
        style={[styles.card]}
        onPress={() => router.push(route)}
      >
        <View style={styles.cardContent}>
          <View style={[styles.iconWrapper, { backgroundColor: bgColor }]}>
            {icon}
          </View>
          <Text style={styles.label}>{label}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const [visible, setVisible] = useState(false);
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  const openMenu = () => {
    setVisible(true);
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH - MENU_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(translateX, {
      toValue: SCREEN_WIDTH,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setVisible(false);
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
      <ScreenTitle
        title="Collection"
        style={{ marginTop: Platform.OS === "android" ? 40 : 0 }}
      />
      <FlatList
        style={styles.container}
        data={collectionData}
        renderItem={({ item }) => (
          <CollectionItem
            icon={item.icon}
            label={item.label}
            bgColor={item.bgColor}
            route={item.route}
          />
        )}
      />
      <TouchableOpacity
        onPress={() => {
          openMenu();
        }}
        activeOpacity={0.75}
        style={{
          // borderWidth: 1,
          position: "absolute",
          bottom: 50,
          right: 30,
          borderRadius: 999,
          backgroundColor: "white",
          ...shadow.heavy,
        }}
      >
        <Ionicons name="add" size={70} color={colors.primary1} />
      </TouchableOpacity>
      {visible && (
        <>
          {/* Nền mờ */}
          <TouchableOpacity
            style={styles.overlay}
            activeOpacity={1}
            onPress={closeMenu}
          />

          {/* Menu trượt vào */}
          <Animated.View style={[styles.menu, { transform: [{ translateX }] }]}>
            <View style={styles.section}>
              <Text style={styles.sectionTile}>Live tracking</Text>
              <View style={styles.selectionContainer}>
                <TouchableOpacity onPress={closeMenu}>
                  <Text style={styles.textInSection}>Exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={closeMenu}>
                  <Text style={styles.textInSection}>Sleep</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.section}>
              <Text style={styles.sectionTile}>Add manual log</Text>
              <View style={styles.selectionContainer}>
                <TouchableOpacity
                  onPress={() => {
                    closeMenu();
                    router.push(
                      "/(tabs)/(activities)/(add-metric)/add-exercise"
                    );
                  }}
                >
                  <Text style={styles.textInSection}>Exercise</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    closeMenu();
                    router.push("/(tabs)/(activities)/(add-metric)/add-sleep");
                  }}
                >
                  <Text style={styles.textInSection}>Sleep</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    closeMenu();
                    router.push(
                      "/(tabs)/(activities)/(add-metric)/add-calories"
                    );
                  }}
                >
                  <Text style={styles.textInSection}>Calories</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    closeMenu();
                    router.push(
                      "/(tabs)/(activities)/(add-metric)/add-hydration"
                    );
                  }}
                >
                  <Text style={styles.textInSection}>Water</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    closeMenu();
                    router.push(
                      "/(tabs)/(activities)/(add-metric)/add-body-measurement"
                    );
                  }}
                >
                  <Text style={styles.textInSection}>Body measurements</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
  },
  card: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 15,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 2, height: 2 },
    shadowRadius: 3,
    elevation: 3,
  },
  cardContent: { flexDirection: "row", alignItems: "center", gap: 20 },
  iconWrapper: {
    padding: 10,
    borderRadius: 999,
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    ...fonts.titleMedium,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  menu: {
    position: "absolute",
    bottom: 45,
    right: 0,
    width: MENU_WIDTH + 20,
    height: 400,
    backgroundColor: "white",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: -2, height: 0 },
    elevation: 4,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    gap: 30,
    justifyContent: "center",
  },
  sectionTile: {
    color: colors.tertiary4,
    ...fonts.bodyMedium,
  },
  section: {
    gap: 15,
  },
  selectionContainer: {
    marginLeft: 15,
    gap: 20,
  },
  textInSection: {
    ...fonts.titleSmall,
  },
});
