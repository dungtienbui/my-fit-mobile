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
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Feather"; // Dùng 'Feather' hoặc 'FontAwesome', v.v.

const AddHydration = () => {
  const [isFocusInputText, setFocusInputText] = useState(false);
  const [waterDate, setWaterDate] = useState(new Date());
  const [waterTime, setWaterTime] = useState(new Date());
  const [waterIntake, setWaterIntake] = useState("0");

  const [
    saveData,
    { data: savedData, isLoading: saveIsLoading, error: saveError },
  ] = useCreateHealthMetricMutation();

  const [showPicker, setShowPicker] = useState(false);
  const [mode, setMode] = useState<"date" | "time">("date");
  const [targetField, setTargetField] = useState<"waterDate" | "waterTime">(
    "waterDate"
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
      case "waterDate":
        setWaterDate(selectedDate);
        break;
      case "waterTime":
        setWaterTime(selectedDate);
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

  const isValidInputValue = (value: string) => {
    if (value === "") {
      return true;
    }
    return /^\d+$/.test(value);
  };

  const handleSave = async () => {
    const waterDateTime = combineDateAndTime(waterDate, waterTime);

    if (!isValidInputValue(waterIntake) || waterIntake === "") {
      Toast.show({
        text1: "Ohh! Water intake is invalid.",
        text2: "Please enter valid calories!",
        type: "error",
      });
      return;
    }

    const waterIntakeNumber = parseInt(waterIntake, 10);

    await saveData({
      metricType: "water",
      value: waterIntakeNumber / 1000,
      date: waterDateTime,
    });
  };

  useEffect(() => {
    if (savedData) {
      Toast.show({
        text1: "Success",
        text2: "Your water intake has saved successfully.",
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <ScreenTitle
        title="Add hydration"
        LeadingIconButton={
          <IconButton
            icon={<Ionicons name="arrow-back" size={15} color="#fff" />}
            onPress={() => {
              router.back();
            }}
          />
        }
        TrailingIconButton={
          (showPicker && Platform.OS === "ios") || isFocusInputText ? (
            <Text
              style={{
                ...fonts.titleMedium,
                color: colors.primary2,
                marginRight: 10,
              }}
              onPress={() => {
                setShowPicker(false);
                setFocusInputText(false);
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
          alignItems: "center",
        }}
      >
        <View style={styles.container}>
          <CustomInput
            value={waterIntake}
            onChangeText={(text) => {
              if (!isValidInputValue(text)) {
                Toast.show({
                  text1: "Ohh!",
                  text2: "Water intake is invalid. Please enter number!",
                  type: "error",
                });
              }
              setWaterIntake(text);
            }}
            placeholder="Water intake..."
            label="Water intake"
            width="100%"
            trailingIcon={<Text>ml</Text>}
            keyboardType="decimal-pad"
            inputMode="decimal"
            onFocus={() => {
              setFocusInputText(true);
            }}
          />
          <CustomInput
            label="Drink date"
            value={formatDate(waterDate)}
            onChangeText={() => {}}
            readonly={true}
            placeholder={"DD/MM/YYYY"}
            trailingIcon={
              <TouchableOpacity
                onPress={() => handleOpenPicker("date", "waterDate")}
              >
                <Icon name="calendar" size={20} color="#333" />
              </TouchableOpacity>
            }
            width="100%"
          />
          <CustomInput
            label="Drink time"
            value={formatTime(waterTime)}
            onChangeText={() => {}}
            readonly={true}
            placeholder={"HH:mm"}
            trailingIcon={
              <TouchableOpacity
                onPress={() => handleOpenPicker("time", "waterTime")}
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
            textColor="black"
            themeVariant="light"
            value={targetField === "waterDate" ? waterDate : waterTime}
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
          style={{ marginTop: 50 }}
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

export default AddHydration;
