import ScreenTitle from "@/components/screen/ScreenTitle";
import { logout } from "@/store/features/auth/authSlice";
import { selectUserInfo } from "@/store/features/user/userSlice";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import {
  cancelAllScheduledNotification,
  loadNotificationStatus,
  removeNotificationId,
  saveNotificationStatus,
  scheduleDailyReminder,
  storeNotificationId,
} from "@/utils/notificationUtils";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";

export default function Index() {
  const dispatch = useDispatch();
  const userInfo = useSelector(selectUserInfo);

  const [isEnabled, setIsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const enabled = await loadNotificationStatus();
      console.log("loadNotificationStatus: ", enabled);
      setIsEnabled(enabled);
      setLoading(false);
    };
    init();
  }, []);

  const toggleSwitch = () => {
    const newValue = !isEnabled;
    setIsEnabled(newValue); // Cập nhật UI ngay
    setLoading(true);

    (async () => {
      try {
        await saveNotificationStatus(newValue);
      } catch (error) {
        console.error("saveNotificationStatus error: ", error);
      }
      
      try {
        await Promise.all([
          cancelAllScheduledNotification(),
          removeNotificationId("goalsDailyReminderNotification"),
          removeNotificationId("sleepGoalDailyReminderNotification"),
        ]);

        if (newValue) {
          const goalsId = await scheduleDailyReminder(
            11,
            29,
            "🎯 Check your goals for today",
            "Don't forget to review and complete your health goals!"
          );
          if (goalsId) {
            await storeNotificationId(
              "goalsDailyReminderNotification",
              goalsId
            );
          }

          Alert.alert(
            "Sleep Time Not Set",
            "Your bedtime has been reset. Please go to the Challenges section to set your sleep schedule."
          );
        }
      } catch (error) {
        console.error("Cancel Scheduled Notification Error: ", error);
      }
      setLoading(false);
    })();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="transparent"
      />
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
              <Text style={{ ...fonts.titleMedium }}>
                {userInfo.name ?? "N/A"}
              </Text>
              <View
                style={{ flexDirection: "row", gap: 3, alignItems: "center" }}
              >
                <Ionicons
                  name="location-outline"
                  size={15}
                  color={colors.tertiary1}
                />
                <Text style={{ ...fonts.bodyMedium, color: "#A3A3A3" }}>
                  {userInfo.address ?? "N/A"}
                </Text>
              </View>
              <Text style={{ ...fonts.bodyMedium, color: "#A3A3A3" }}>
                {userInfo.email ?? "N/A"}
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
                {loading && <ActivityIndicator />}
                <Switch
                  value={isEnabled}
                  onValueChange={toggleSwitch}
                  disabled={loading}
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
    marginTop: 10,
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
