import CustomButton from "@/components/button/CustomButton";
import IconButton from "@/components/button/IconButton";
import CustomInput from "@/components/form/CustomInput";
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
  TouchableOpacity,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Feather"; // Dùng 'Feather' hoặc 'FontAwesome', v.v.

const AddExercise = () => {
  const [exerciseDate, setExerciseDate] = useState(new Date());
  const [exerciseTime, setExerciseTime] = useState(new Date());
  const [exerciseName, setExerciseName] = useState<
    "running" | "walking" | "cycling"
  >("running");
  const [exerciseNote, setExerciseNote] = useState("");
  const [distance, setDistance] = useState("0");
  const [exerciseHours, setExerciseHours] = useState(0);
  const [exerciseMinutes, setExerciseMinutes] = useState(0);

  const [
    saveExerciseData,
    { data: exerciseSaved, isLoading: exerciseIsLoading, error: exerciseError },
  ] = useCreateHealthMetricMutation();
  const [
    saveStepsData,
    { data: stepsSaved, isLoading: stepsIsLoading, error: stepsError },
  ] = useCreateHealthMetricMutation();

  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [targetField, setTargetField] = useState<
    "exerciseDate" | "exerciseTime"
  >("exerciseDate");

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
      case "exerciseDate":
        setExerciseDate(selectedDate);
        break;
      case "exerciseTime":
        setExerciseTime(selectedDate);
        break;
    }
  };

  const formatDate = (date: Date) => date.toLocaleDateString("vi-VN"); // hoặc Intl.DateTimeFormat nếu cần tùy chỉnh sâu hơn

  const formatTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  const combineDateAndTime = (date: Date, time: Date) => {
    const combined = new Date(date);
    combined.setHours(time.getHours());
    combined.setMinutes(time.getMinutes());
    combined.setSeconds(0);
    combined.setMilliseconds(0);
    return combined;
  };

  const isInteger = (value: string) => {
    return /^\d+$/.test(value);
  };

  const handleSave = async () => {
    const exerciseDateTime = combineDateAndTime(exerciseDate, exerciseTime);

    if (!isInteger(distance)) {
      Toast.show({
        text1: "Ohh! Distance is invalid.",
        text2: "Please enter valid distance!",
        type: "error",
      });
      return;
    }
    const distanceNumber = parseInt(distance, 10);

    if (!exerciseName) {
      Toast.show({
        text1: "Ohh!",
        text2: "Please enter exercise name!",
        type: "error",
      });
      return;
    }

    const durationMinutes = exerciseHours * 60 + exerciseMinutes;

    await saveExerciseData({
      metricType: "exercise",
      value: distanceNumber,
      date: exerciseDateTime,
      exerciseDetails: {
        activityName: exerciseName,
        duration: durationMinutes,
        notes: exerciseNote,
      },
    });

    if (exerciseName === "walking" || exerciseName === "running") {
      const stepsCount = estimateSteps(
        distanceNumber,
        durationMinutes,
        exerciseName
      );
      await saveStepsData({
        metricType: "steps",
        value: stepsCount,
        date: exerciseDateTime,
      });
    }
  };

  useEffect(() => {
    if (exerciseSaved) {
      Toast.show({
        text1: "Success",
        text2: "Your exercise has saved successfully.",
        type: "success",
      });

      router.back();
      console.warn("exerciseSaved: ", exerciseSaved);
    }
  }, [exerciseSaved]);

  useEffect(() => {
    if (stepsSaved) {
      Toast.show({
        text1: "Success",
        text2: "Your steps has calculated and saved successfully.",
        type: "success",
      });
      console.warn("stepsSaved: ", stepsSaved);
    }
  }, [stepsSaved]);

  useEffect(() => {
    if (exerciseError) {
      Toast.show({
        text1: "Ooh!",
        text2: "Some wrong happended when saving exercise. Please try again!",
        type: "error",
      });
      console.error("exerciseError: ", exerciseError);
    } else if (stepsError) {
      Toast.show({
        text1: "Ooh!",
        text2: "Some wrong happended when saving step. Please try again!",
        type: "error",
      });
      console.error("stepsError: ", stepsError);
    }
  }, [exerciseError, stepsError]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScreenTitle
        title="Add Calories"
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
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "49%", gap: 4 }}>
              <Text style={{ ...fonts.labelLarge, color: "black" }}>
                Activity type
              </Text>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.tertiary3,
                  paddingHorizontal: 12,
                  borderRadius: 4,
                  flexGrow: 1,
                  justifyContent: "center",
                }}
              >
                <Dropdown
                  onChange={(item) => {
                    setExerciseName(item.value);
                  }}
                  data={exerciseTypeOptions}
                  value={exerciseName}
                  labelField="label"
                  valueField="value"
                  maxHeight={300}
                  selectedTextStyle={{
                    fontFamily: "Roboto_300Medium",
                    fontSize: 18,
                    letterSpacing: 1,
                    color: "#333",
                  }}
                />
              </View>
            </View>
            <CustomInput
              value={distance}
              onChangeText={(text) => {
                if (!isInteger(text)) {
                  Toast.show({
                    text1: "Ohh!",
                    text2: "Distance is invalid. Please enter number!",
                    type: "error",
                  });
                }
                setDistance(text);
              }}
              placeholder="Distance..."
              label="Distance"
              width="49%"
              trailingIcon={<Text>m</Text>}
              keyboardType="numeric"
            />
          </View>
          <View style={{ gap: 4 }}>
            <Text style={{ ...fonts.labelLarge, color: "black" }}>
              Duration
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.tertiary3,
                  paddingHorizontal: 12,
                  borderRadius: 4,
                  width: "49%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: 42,
                }}
              >
                <Dropdown
                  onChange={(item) => {
                    setExerciseHours(item.value);
                  }}
                  data={exerciseHourOptions}
                  value={exerciseHours}
                  labelField="label"
                  valueField="value"
                  maxHeight={300}
                  selectedTextStyle={{
                    fontFamily: "Roboto_300Medium",
                    fontSize: 18,
                    letterSpacing: 1,
                    color: "#333",
                  }}
                  style={{ flexGrow: 1 }}
                />
                <Text>hours</Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: colors.tertiary3,
                  paddingHorizontal: 12,
                  borderRadius: 4,
                  width: "49%",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  height: 42,
                }}
              >
                <Dropdown
                  onChange={(item) => {
                    setExerciseMinutes(item.value);
                  }}
                  data={exerciseMinuteOptions}
                  value={exerciseMinutes}
                  labelField="label"
                  valueField="value"
                  maxHeight={300}
                  selectedTextStyle={{
                    fontFamily: "Roboto_300Medium",
                    fontSize: 18,
                    letterSpacing: 1,
                    color: "#333",
                  }}
                  style={{ flexGrow: 1 }}
                />
                <Text>minutes</Text>
              </View>
            </View>
          </View>
          <CustomInput
            label="Activity date"
            value={formatDate(exerciseDate)}
            onChangeText={() => {}}
            readonly={true}
            placeholder={"DD/MM/YYYY"}
            trailingIcon={
              <TouchableOpacity
                onPress={() => handleOpenPicker("date", "exerciseDate")}
              >
                <Icon name="calendar" size={20} color="#333" />
              </TouchableOpacity>
            }
            width="100%"
          />
          <CustomInput
            label="Activity time"
            value={formatTime(exerciseTime)}
            onChangeText={() => {}}
            readonly={true}
            placeholder={"HH:mm"}
            trailingIcon={
              <TouchableOpacity
                onPress={() => handleOpenPicker("time", "exerciseTime")}
              >
                <Icon name="clock" size={20} color="#333" />
              </TouchableOpacity>
            }
            width="100%"
          />

          {/* DateTimePicker */}
          {showPicker && (
            <DateTimePicker
              value={
                targetField === "exerciseDate" ? exerciseDate : exerciseTime
              }
              mode={mode}
              is24Hour={true}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleChange}
            />
          )}

          <CustomInput
            value={exerciseNote}
            onChangeText={(text) => {
              setExerciseNote(text);
            }}
            placeholder="Your note..."
            label="Note (optional)"
            width="100%"
          />
        </View>

        {/* Submit Button */}
        <CustomButton
          title="Save"
          onPress={() => {
            handleSave();
          }}
          style={{ marginBottom: 20, position: "absolute", bottom: 0 }}
          leadingIcon={
            exerciseIsLoading || stepsIsLoading ? (
              <ActivityIndicator color="#fff" />
            ) : undefined
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

function estimateSteps(
  distance: number, // in meters
  duration: number, // in minutes
  activityType: "running" | "walking" | "cycling"
): number {
  if (distance <= 0 || duration <= 0) return 0;

  let stepsPerKm: number;

  switch (activityType) {
    case "walking":
      stepsPerKm = 1282; // ~0.78m per step
      break;
    case "running":
      stepsPerKm = 1000; // ~1m per step
      break;
    case "cycling":
      return 0; // or a custom value if needed
    default:
      return 0;
  }

  const distanceKm = distance / 1000;
  const estimatedSteps = distanceKm * stepsPerKm;

  return Math.round(estimatedSteps);
}

const exerciseMinuteOptions = Array.from({ length: 12 }, (_, i) => {
  const value = i * 5;
  return { label: `${value}m`, value };
});

const exerciseHourOptions = [
  { label: "0h", value: 0 },
  { label: "1h", value: 1 },
  { label: "2h", value: 2 },
  { label: "3h", value: 3 },
  { label: "4h", value: 4 },
  { label: "5h", value: 5 },
];
const exerciseTypeOptions = [
  { label: "Running", value: "running" },
  { label: "Walking", value: "walking" },
  { label: "Cycling", value: "cycling" },
];

export default AddExercise;
