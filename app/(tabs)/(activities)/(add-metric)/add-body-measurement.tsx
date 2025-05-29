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

const AddBodyMeasurement = () => {
  const mealTypeOptions = [
    { label: "Height", value: "height" },
    { label: "Weight", value: "weight" },
  ];

  const [measureDate, setMeasureDate] = useState(new Date());
  const [measureTime, setMeasureTime] = useState(new Date());
  const [measureValue, setMeasureValue] = useState("0");
  const [measureType, setMeasuerType] = useState<"height" | "weight">("height");

  const [
    saveData,
    { data: savedData, isLoading: saveIsLoading, error: saveError },
  ] = useCreateHealthMetricMutation();

  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [targetField, setTargetField] = useState<"measureDate" | "measureTime">(
    "measureDate"
  );

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
      case "measureDate":
        setMeasureDate(selectedDate);
        break;
      case "measureTime":
        setMeasureTime(selectedDate);
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
    const measureDateTime = combineDateAndTime(measureDate, measureTime);

    if (!isInteger(measureValue)) {
      Toast.show({
        text1: "Ohh! Measurement is invalid.",
        text2: "Please enter valid measurement!",
        type: "error",
      });
      return;
    }

    const measureCaloriesNumber = parseInt(measureValue, 10);

    await saveData({
      metricType: measureType,
      value: measureCaloriesNumber,
      date: measureDateTime,
    });
  };

  useEffect(() => {
    if (savedData) {
      Toast.show({
        text1: "Success",
        text2: "Your measurement has saved successfully.",
        type: "success",
      });
      router.back();
      console.warn("savedData: ", savedData);
    }
  }, [savedData]);

  useEffect(() => {
    if (saveError) {
      Toast.show({
        text1: "Ooh!",
        text2: "Some wrong happended. Please try again!",
        type: "error",
      });
      console.error("saveError: ", saveError);
    }
  }, [saveError]);

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
                Measurement type
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
                    setMeasuerType(item.value);
                  }}
                  data={mealTypeOptions}
                  value={measureType}
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
              value={measureValue}
              onChangeText={(text) => {
                if (!isInteger(text)) {
                  Toast.show({
                    text1: "Ohh!",
                    text2: "Measure value is invalid. Please enter number!",
                    type: "error",
                  });
                }
                setMeasureValue(text);
              }}
              placeholder="Meal's calories..."
              label="Calories intake"
              width="49%"
              trailingIcon={
                <Text>{measureType === "height" ? "cm" : "kg"}</Text>
              }
              keyboardType="numeric"
            />
          </View>
          <CustomInput
            label="Meal date"
            value={formatDate(measureDate)}
            onChangeText={() => {}}
            readonly={true}
            placeholder={"DD/MM/YYYY"}
            trailingIcon={
              <TouchableOpacity
                onPress={() => handleOpenPicker("date", "measureDate")}
              >
                <Icon name="calendar" size={20} color="#333" />
              </TouchableOpacity>
            }
            width="100%"
          />
          <CustomInput
            label="Meal time"
            value={formatTime(measureTime)}
            onChangeText={() => {}}
            readonly={true}
            placeholder={"HH:mm"}
            trailingIcon={
              <TouchableOpacity
                onPress={() => handleOpenPicker("time", "measureTime")}
              >
                <Icon name="clock" size={20} color="#333" />
              </TouchableOpacity>
            }
            width="100%"
          />
        </View>

        {/* DateTimePicker */}
        {showPicker && (
          <DateTimePicker
            value={targetField === "measureDate" ? measureDate : measureTime}
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

export default AddBodyMeasurement;
