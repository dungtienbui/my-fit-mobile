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

const Weight = () => {
  const [setGoal, { data, isLoading, error }] = useUpdateGoalMutation();

  const {
    id = "",
    target = "50",
    unit = "kg",
  } = useLocalSearchParams<{
    id: string;
    target: string;
    unit: string;
  }>();

  if (id == "") {
    Toast.show({
      text1: "Ooh! Some wrong happend.",
      text2: "Please logout and login again!",
    });
  }

  const [valueState, setValueState] = useState(
    isNaN(parseFloat(target)) ? 2 : parseFloat(target)
  );

  const handleDecrease = () => {
    if (valueState >= 0.5) {
      setValueState(valueState - 0.5);
    }
  };

  const handleIncrease = () => {
    setValueState(valueState + 0.5);
  };

  const handleSave = async () => {
    const healthBodyFatPercentage = {
      target: valueState,
      unit: "kg",
    };

    await setGoal({
      id: id,
      data: {
        health_bodyFatPercentage: healthBodyFatPercentage,
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
        title="Weight"
        // style={{ marginTop: Platform.OS === "android" ? 40 : 0 }}
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
            <Text style={styles.number}>{valueState.toFixed(1)}</Text>
            <Text style={styles.unit}>{unit}</Text>
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

export default Weight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: Platform.OS === "android" ? 20 : 0,
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
