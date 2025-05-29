import CustomButton from "@/components/button/CustomButton";
import IconButton from "@/components/button/IconButton";
import CustomInput from "@/components/form/CustomInput";
import ScreenTitle from "@/components/screen/ScreenTitle";
import { useCreateHealthMetricMutation } from "@/store/services/apis/healthMetricsApi";
import { MealType } from "@/store/services/dto/type/someDtoType";
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

const AddCalories = () => {
  const mealTypeOptions = [
    { label: "Breakfast", value: "breakfast" },
    { label: "Lunch", value: "lunch" },
    { label: "Dinner", value: "dinner" },
    { label: "Snack", value: "snack" },
    { label: "Other", value: "other" },
  ];

  const [mealDate, setMealDate] = useState(new Date());
  const [mealTime, setMealTime] = useState(new Date());
  const [mealName, setMealName] = useState("");
  const [mealCalories, setMealCalories] = useState("0");
  const [mealType, setMealType] = useState<MealType>("breakfast");

  const [
    saveData,
    { data: savedData, isLoading: saveIsLoading, error: saveError },
  ] = useCreateHealthMetricMutation();

  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [targetField, setTargetField] = useState<"mealDate" | "mealTime">(
    "mealDate"
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
      case "mealDate":
        setMealDate(selectedDate);
        break;
      case "mealTime":
        setMealTime(selectedDate);
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
    const mealDateTime = combineDateAndTime(mealDate, mealTime);

    if (!isInteger(mealCalories)) {
      Toast.show({
        text1: "Ohh! Calories is invalid.",
        text2: "Please enter valid calories!",
        type: "error",
      });
      return;
    }

    const mealCaloriesNumber = parseInt(mealCalories, 10);

    if (!mealName) {
      Toast.show({
        text1: "Ohh!",
        text2: "Please enter meal name!",
        type: "error",
      });
      return;
    }

    await saveData({
      metricType: "calories",
      value: mealCaloriesNumber,
      date: mealDateTime,
      mealDetails: {
        mealType: mealType,
        foodName: mealName,
      },
    });
  };

  useEffect(() => {
    if (savedData) {
      Toast.show({
        text1: "Success",
        text2: "Your calories has saved successfully.",
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
          <CustomInput
            value={mealName}
            onChangeText={(text) => {
              setMealName(text);
            }}
            placeholder="Meal name..."
            label="Meal name"
            width="100%"
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View style={{ width: "49%", gap: 4 }}>
              <Text style={{ ...fonts.labelLarge, color: "black" }}>
                Meal type
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
                    setMealType(item.value);
                  }}
                  data={mealTypeOptions}
                  value={mealType}
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
              value={mealCalories}
              onChangeText={(text) => {
                if (!isInteger(text)) {
                  Toast.show({
                    text1: "Ohh!",
                    text2: "Calories is invalid. Please enter number!",
                    type: "error",
                  });
                }
                setMealCalories(text);
              }}
              placeholder="Meal's calories..."
              label="Calories intake"
              width="49%"
              trailingIcon={<Text>Calo</Text>}
              keyboardType="numeric"
            />
          </View>
          <CustomInput
            label="Meal date"
            value={formatDate(mealDate)}
            onChangeText={() => {}}
            readonly={true}
            placeholder={"DD/MM/YYYY"}
            trailingIcon={
              <TouchableOpacity
                onPress={() => handleOpenPicker("date", "mealDate")}
              >
                <Icon name="calendar" size={20} color="#333" />
              </TouchableOpacity>
            }
            width="100%"
          />
          <CustomInput
            label="Meal time"
            value={formatTime(mealTime)}
            onChangeText={() => {}}
            readonly={true}
            placeholder={"HH:mm"}
            trailingIcon={
              <TouchableOpacity
                onPress={() => handleOpenPicker("time", "mealTime")}
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
            value={targetField === "mealDate" ? mealDate : mealTime}
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

export default AddCalories;
