import ScreenTitle from "@/components/screen/ScreenTitle";
import { logout } from "@/store/features/auth/authSlice";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch } from "react-redux";

export default function Index() {
  const dispatch = useDispatch();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenTitle
        title="Profile and Settings"
        style={{ marginTop: Platform.OS === "android" ? 40 : 0 }}
      />

      <ScrollView>
        <View style={styles.container}>
          <View style={styles.avatarContainer}>
            <Image
              style={styles.avatar}
              source={require("../../../assets/images/maleAvatar.png")}
              resizeMode="contain"
            />
            <View style={styles.avatarTextContainer}>
              <Text style={{ ...fonts.titleMedium }}>Dung Bui</Text>
              <View
                style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              >
                <Ionicons
                  name="location-outline"
                  size={15}
                  color={colors.tertiary1}
                />
                <Text style={{ ...fonts.bodyMedium, color: "#A3A3A3" }}>
                  Ho Chi Minh city, Vietnam
                </Text>
              </View>
              <Text style={{ ...fonts.bodyMedium, color: "#A3A3A3" }}>
                Email@gamil.com
              </Text>
            </View>
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={{ gap: 5 }}>
              <Pressable
                onPress={() => {
                  router.push("/(tabs)/(settings)/profile");
                }}
                style={({ pressed }) => [
                  styles.itemContainter,
                  pressed && {
                    backgroundColor: "#E5F2FF",
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: "#92A3FD",
                  },
                ]}
              >
                <Ionicons
                  name="pencil-outline"
                  size={25}
                  color={colors.tertiary4}
                />
                <Text style={styles.itemText}>Edit profile</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color={colors.tertiary4}
                />
              </Pressable>

              <View style={styles.itemContainter}>
                <Ionicons
                  name="body-outline"
                  size={25}
                  color={colors.tertiary4}
                />
                <Text style={styles.itemText}>Personal data</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color={colors.tertiary4}
                />
              </View>

              <View style={styles.itemContainter}>
                <Ionicons
                  name="watch-outline"
                  size={25}
                  color={colors.tertiary4}
                />
                <Text style={styles.itemText}>My devices</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color={colors.tertiary4}
                />
              </View>
            </View>
          </View>
          <View style={styles.divider}></View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Accounts</Text>
            <View style={{ gap: 5 }}>
              <View style={styles.itemContainter}>
                <Ionicons
                  name="notifications-outline"
                  size={25}
                  color={colors.tertiary4}
                />
                <Text style={styles.itemText}>Notification</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color={colors.tertiary4}
                />
              </View>

              <View style={styles.itemContainter}>
                <Ionicons
                  name="globe-outline"
                  size={25}
                  color={colors.tertiary4}
                />
                <Text style={styles.itemText}>Language</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color={colors.tertiary4}
                />
              </View>

              <View style={styles.itemContainter}>
                <Ionicons
                  name="build-outline"
                  size={25}
                  color={colors.tertiary4}
                />
                <Text style={styles.itemText}>Unit of Measurement</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color={colors.tertiary4}
                />
              </View>

              <View style={styles.itemContainter}>
                <Ionicons
                  name="lock-closed-outline"
                  size={25}
                  color={colors.tertiary4}
                />
                <Text style={styles.itemText}>Change password</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color={colors.tertiary4}
                />
              </View>

              <View style={styles.itemContainter}>
                <Ionicons
                  name="help-circle-outline"
                  size={25}
                  color={colors.tertiary4}
                />
                <Text style={styles.itemText}>Help</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color={colors.tertiary4}
                />
              </View>

              <Pressable
                onPress={() => {
                  dispatch(logout());
                }}
                style={({ pressed }) => [
                  styles.itemContainter,
                  pressed && {
                    backgroundColor: "#E5F2FF",
                    borderWidth: 1,
                    borderRadius: 10,
                    borderColor: "#92A3FD",
                  },
                ]}
              >
                <Ionicons
                  name="help-circle-outline"
                  size={25}
                  color={colors.tertiary4}
                />
                <Text style={styles.itemText}>Logout</Text>
                <Ionicons
                  name="chevron-forward-outline"
                  size={25}
                  color={colors.tertiary4}
                />
              </Pressable>
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
    paddingBottom: 20,
  },
  avatarContainer: {
    alignItems: "center",
    gap: 10,
  },
  avatarTextContainer: {
    alignItems: "center",
  },
  avatar: {
    width: 100,
    height: 100,
  },
  sectionContainer: {
    width: "100%",
  },
  sectionTitle: {
    ...fonts.titleMedium,
    marginBottom: 15,
  },
  itemContainter: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  itemText: {
    flexGrow: 1,
    marginLeft: 40,
    ...fonts.labelLarge,
  },
  divider: {
    width: "100%",
    borderTopWidth: 1,
    borderColor: "#8D8D8D",
  },
  wrapperCustom: {
    borderRadius: 8,
    padding: 6,
    borderWidth: 1,
  },
});
