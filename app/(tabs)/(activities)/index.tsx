import ScreenTitle from "@/components/screen/ScreenTitle";
import { fonts } from "@/theme/fonts";
import {
  Entypo,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import React, { JSX, useState } from "react";
import {
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

export default function CollectionScreen() {
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const router = useRouter();

  const navigateTo = (path: Href) => {
    closeMenu();
    router.push(path);
  };

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
});
