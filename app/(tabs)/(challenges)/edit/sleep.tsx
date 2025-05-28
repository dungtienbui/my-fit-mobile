import CustomButton from "@/components/button/CustomButton";
import IconButton from "@/components/button/IconButton";
import ScreenTitle from "@/components/screen/ScreenTitle";
import { useUpdateGoalMutation } from "@/store/services/apis/goalsApi";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

function safeParseDate(
  input?: string,
  fallback: string = "2025-01-01T00:00:00.000Z"
): Date {
  const date = new Date(input ?? fallback);
  if (isNaN(date.getTime())) {
    console.warn(`Ngày không hợp lệ: "${input}", dùng mặc định: "${fallback}"`);
    return new Date(fallback);
  }
  return date;
}

const Sleep = () => {
  const [setGoal, { data, isLoading, error }] = useUpdateGoalMutation();

  const {
    id = "",
    start = "2025-01-01T00:00:00.000Z",
    end = "2025-01-01T08:00:00.000Z",
    frequency = "Daily",
  } = useLocalSearchParams<{
    id: string;
    start: string;
    end: string;
    frequency: string;
  }>();

  const [startTime, setStartTime] = useState(safeParseDate(start));
  const [endTime, setEndTime] = useState(safeParseDate(end));

  const [showPicker, setShowPicker] = useState(false);
  const [targetField, setTargetField] = useState<"startTime" | "endTime">();

  const handleOpenPicker = (target: typeof targetField) => {
    setTargetField(target);
    setShowPicker(true);
  };

  const handleChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;
    setShowPicker(false);

    switch (targetField) {
      case "startTime":
        setStartTime(selectedDate);
        break;
      case "endTime":
        setEndTime(selectedDate);
        break;
    }
  };

  const formatDate = (date: Date) => date.toLocaleDateString("vi-VN");

  const formatTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  const handleSave = async () => {
    console.log("startTime: ", startTime);
    console.log("endTime: ", endTime);

    await setGoal({
      id: id,
      data: {
        activity_sleeping: {
          start: startTime,
          end: endTime,
          frequency: "Daily",
        },
      },
    });
  };

  useEffect(() => {
    if (data) {
      Toast.show({
        text1: "Success",
        text2: "Your goal has saved successfully.",
        type: "success",
      });
      console.log("data: ", data);
      router.back();
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      Toast.show({
        text1: "Ooh!",
        text2: "Some wrong happended. Please try again!",
        type: "error",
      });
      console.error("error: ", error);
    }
  }, [error]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenTitle
        title="Sleep time"
        style={{ marginTop: Platform.OS === "android" ? 40 : 0 }}
        LeadingIconButton={
          <IconButton
            icon={<Ionicons name="arrow-back" size={15} color="#fff" />}
            onPress={() => {
              router.back();
            }}
          />
        }
        TrailingIconButton={
          showPicker ? (
            <Text
              style={{
                ...fonts.titleMedium,
                color: colors.primary2,
                marginRight: 10,
              }}
              onPress={() => {
                setShowPicker(false);
                Keyboard.dismiss();
              }}
            >
              Cancel
            </Text>
          ) : undefined
        }
      />

      <View style={styles.container}>
        {/* Số lượng */}
        <View style={styles.contentContainer}>
          {/* Sleep Start Time */}

          <View style={styles.content}>
            <Text style={styles.title}>Bed time</Text>
            <TouchableOpacity
              onPress={() => handleOpenPicker("startTime")}
              style={styles.pickTimeContainer}
            >
              <TextInput
                style={styles.timeValue}
                value={formatTime(startTime)}
                editable={false}
              />
              <Ionicons name="time-outline" size={30} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Wake up time</Text>
            <TouchableOpacity
              onPress={() => handleOpenPicker("endTime")}
              style={styles.pickTimeContainer}
            >
              <TextInput
                style={styles.timeValue}
                value={formatTime(endTime)}
                editable={false}
              />
              <Ionicons name="time-outline" size={30} />
            </TouchableOpacity>
          </View>
        </View>

        {/* DateTimePicker */}
        {showPicker && (
          <DateTimePicker
            value={targetField === "startTime" ? startTime : endTime}
            mode="time"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleChange}
          />
        )}

        <CustomButton
          title={"Save"}
          onPress={() => {
            handleSave();
          }}
          leadingIcon={isLoading && <ActivityIndicator color="#fff" />}
        />
      </View>
    </SafeAreaView>
  );
};

export default Sleep;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  contentContainer: {
    marginTop: 50,
    width: "80%",
    gap: 40,
  },
  content: {
    // borderWidth: 1,
    width: "100%",
    gap: 10,
  },
  title: {
    ...fonts.headlineMedium,
  },
  pickTimeContainer: {
    borderWidth: 1,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  timeValue: {
    ...fonts.headlineSmall,
    lineHeight: 28,
  },
  itemContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
