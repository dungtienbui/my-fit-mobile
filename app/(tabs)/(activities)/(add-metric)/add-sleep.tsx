import CustomButton from "@/components/button/CustomButton";
import IconButton from "@/components/button/IconButton";
import ScreenTitle from "@/components/screen/ScreenTitle";
import { useCreateHealthMetricMutation } from "@/store/services/apis/healthMetricsApi";
import { colors } from "@/theme/colors";
import { fonts } from "@/theme/fonts";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Feather";

const SleepTimeForm = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const [
    saveData,
    { data: savedData, isLoading: saveIsLoading, error: saveError },
  ] = useCreateHealthMetricMutation();

  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [targetField, setTargetField] = useState<
    "startDate" | "startTime" | "endDate" | "endTime"
  >();

  const handleOpenPicker = (
    pickerMode: "date" | "time",
    target: typeof targetField
  ) => {
    setMode(pickerMode);
    setTargetField(target);
    setShowPicker(true);
  };

  const handleChange = (_: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;
    setShowPicker(false);

    switch (targetField) {
      case "startDate":
        setStartDate(selectedDate);
        break;
      case "startTime":
        setStartTime(selectedDate);
        break;
      case "endDate":
        setEndDate(selectedDate);
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

  const combineDateAndTime = (date: Date, time: Date) => {
    console.log("date: ", date.toLocaleString("vi-VN"));
    console.log("time: ", time.toLocaleString("vi-VN"));

    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);

    console.log("combined: ", combined.toLocaleString("vi-VN"));
    console.log("combined: ", combined);

    const today = new Date();
    // today.setHours(0, 0, 0, 0);

    console.log("today: ", today.toLocaleString("vi-VN"));
    console.log("today: ", today);

    return combined;
  };

  function getHoursBetween(date1: Date, date2: Date): number {
    if (!(date1 instanceof Date) || !(date2 instanceof Date)) {
      return 0;
    }
    const diffMs = Math.abs(date2.getTime() - date1.getTime());
    const hours = diffMs / (1000 * 60);
    return hours;
  }

  const handleSave = async () => {
    const sleepStart = combineDateAndTime(startDate, startTime);
    const sleepEnd = combineDateAndTime(endDate, endTime);

    const sleepMinutes = getHoursBetween(sleepStart, sleepEnd);

    await saveData({
      metricType: "sleep",
      value: sleepMinutes,
      date: sleepStart,
    });
  };

  useEffect(() => {
    if (savedData) {
      Toast.show({
        text1: "Success",
        text2: "Your sleep time has saved successfully.",
        type: "success",
      });
      router.back();
    }
  }, [savedData]);

  useEffect(() => {
    if (saveError) {
      Toast.show({
        text1: "Ooh!",
        text2: "Some wrong happended. Please try again!",
        type: "error",
      });
    }
  }, [saveError]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenTitle
        title="Add Sleep"
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
        style={{ marginTop: Platform.OS === "android" ? 40 : 0 }}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View style={styles.container}>
          {/* Sleep Start Date */}
          <Text style={styles.label}>Sleep start date</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={formatDate(startDate)}
              editable={false}
            />
            <TouchableOpacity
              onPress={() => handleOpenPicker("date", "startDate")}
            >
              <Icon name="calendar" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Sleep Start Time */}
          <Text style={styles.label}>Sleep start time</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={formatTime(startTime)}
              editable={false}
            />
            <TouchableOpacity
              onPress={() => handleOpenPicker("time", "startTime")}
            >
              <Icon name="clock" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Sleep End Date */}
          <Text style={styles.label}>Sleep end date</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={formatDate(endDate)}
              editable={false}
            />
            <TouchableOpacity
              onPress={() => handleOpenPicker("date", "endDate")}
            >
              <Icon name="calendar" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Sleep End Time */}
          <Text style={styles.label}>Sleep end date</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={formatTime(endTime)}
              editable={false}
            />
            <TouchableOpacity
              onPress={() => handleOpenPicker("time", "endTime")}
            >
              <Icon name="clock" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        {/* DateTimePicker */}
        {showPicker && (
          <DateTimePicker
            value={
              targetField === "startDate"
                ? startDate
                : targetField === "startTime"
                ? startTime
                : targetField === "endDate"
                ? endDate
                : endTime
            }
            mode={mode}
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleChange}
          />
        )}

        {/* Submit Button */}
        <CustomButton
          title="Save"
          onPress={() => {
            handleSave();
          }}
          style={{ marginBottom: 20 }}
          leadingIcon={
            saveIsLoading ? <ActivityIndicator color="#fff" /> : undefined
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
    gap: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.tertiary3,
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  label: {
    ...fonts.labelLarge,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 8,
    color: "#000",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SleepTimeForm;
