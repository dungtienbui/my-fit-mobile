import CustomButton from "@/components/button/CustomButton";
import IconButton from "@/components/button/IconButton";
import ScreenTitle from "@/components/screen/ScreenTitle";
import { useUpdateGoalMutation } from "@/store/services/apis/goalsApi";
import { fonts } from "@/theme/fonts";
import { Ionicons } from "@expo/vector-icons"; // Thêm thư viện icon
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const EnergyBurned = () => {
  const [setGoal, { data, isLoading, error }] = useUpdateGoalMutation();

  const {
    id = "",
    value = "2000",
    unit = "calories",
    frequency = "Daily",
  } = useLocalSearchParams<{
    id: string;
    value: string;
    unit: string;
    frequency: string;
  }>();

  if (id == "") {
    Toast.show({
      text1: "Ooh! Some wrong happend.",
      text2: "Please logout and login again!",
    });
  }

  const [valueState, setValueState] = useState(
    isNaN(parseInt(value)) ? 2 : parseInt(value)
  );

  const handleDecrease = () => {
    if (valueState >= 100) {
      setValueState(valueState - 100);
    }
  };

  const handleIncrease = () => {
    setValueState(valueState + 100);
  };

  const handleSave = async () => {
    const nutritionEnergyBurned = {
      value: valueState,
      unit: "calories",
      frequency: "Daily",
    };

    await setGoal({
      id: id,
      data: {
        nutrition_energyBurned: nutritionEnergyBurned,
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
        title="Energy burned"
        style={{ marginTop: Platform.OS === "android" ? 40 : 0 }}
        LeadingIconButton={
          <IconButton
            icon={<Ionicons name="arrow-back" size={15} color="#fff" />}
            onPress={() => {
              router.back();
            }}
          />
        }
      />

      <View style={styles.container}>
        {/* Số lượng */}
        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <Text style={styles.number}>{valueState}</Text>
            <Text style={styles.unit}>{unit}</Text>
            <Text style={styles.frequency}>{frequency}</Text>
          </View>

          {/* Nút - + */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.diffButton}
              onPress={handleDecrease}
            >
              <Text style={styles.diffText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.diffButton}
              onPress={handleIncrease}
            >
              <Text style={styles.diffText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

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

export default EnergyBurned;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
  },
  contentContainer: {
    marginTop: 80,
  },
  number: {
    ...fonts.displayLarge,
    fontWeight: "normal",
  },
  frequency: {
    ...fonts.bodyLarge,
    marginTop: 5,
  },
  unit: {
    ...fonts.titleLarge,
    marginTop: 5,
  },

  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  diffButton: {
    backgroundColor: "#E5E5E5", // màu nền nút
    borderRadius: 10,
    paddingVertical: 10, // thay đổi padding theo chiều cao
    paddingHorizontal: 70, // 150px = 75 * 2
    marginHorizontal: 8,
    borderColor: "#F5F5F5",
  },
  diffText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#4B5563",
  },
});
