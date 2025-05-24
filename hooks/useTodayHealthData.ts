import { useGetHealthMetricsByDateAndTypeQuery } from "@/store/services/apis/healthMetricsApi";
import { useEffect, useState } from "react";

export function useTodayData(date: Date = new Date()) {
  const {
    data: stepData,
    error: stepError,
    isLoading: stepIsLoading,
  } = useGetHealthMetricsByDateAndTypeQuery({
    date,
    metricType: "steps",
  });

  const {
    data: caloriesData,
    error: caloriesError,
    isLoading: caloriesIsLoading,
  } = useGetHealthMetricsByDateAndTypeQuery({
    date,
    metricType: "calories",
  });

  const {
    data: waterData,
    error: waterError,
    isLoading: waterIsLoading,
  } = useGetHealthMetricsByDateAndTypeQuery({
    date,
    metricType: "water",
  });

  const {
    data: sleepData,
    error: sleepError,
    isLoading: sleepIsLoading,
  } = useGetHealthMetricsByDateAndTypeQuery({
    date,
    metricType: "sleep",
  });

  const {
    data: exerciseData,
    error: exerciseError,
    isLoading: exerciseIsLoading,
  } = useGetHealthMetricsByDateAndTypeQuery({
    date,
    metricType: "exercise",
  });

  const [todayData, setTodayData] = useState({
    walking: 0,
    water: 0,
    calories: 0,
    sleep: 0,
    activityTime: 0,
  });

  useEffect(() => {
    if (stepData) {
      const walking = stepData.reduce((sum, r) => sum + r.value, 0);
      setTodayData((prev) => ({ ...prev, walking }));
    }
  }, [stepData]);

  useEffect(() => {
    if (caloriesData) {
      const calories = caloriesData.reduce((sum, r) => sum + r.value, 0);
      setTodayData((prev) => ({ ...prev, calories }));
    }
  }, [caloriesData]);

  useEffect(() => {
    if (waterData) {
      const water = waterData.reduce((sum, r) => sum + r.value, 0);
      setTodayData((prev) => ({ ...prev, water }));
    }
  }, [waterData]);

  useEffect(() => {
    if (sleepData) {
      const sleep = sleepData.reduce((sum, r) => sum + r.value, 0);
      setTodayData((prev) => ({ ...prev, sleep }));
    }
  }, [sleepData]);

  useEffect(() => {
    if (exerciseData) {
      const totalDuration =
        exerciseData.reduce(
          (sum, r) => sum + (r.exerciseDetails?.duration ?? 0),
          0
        ) ?? 0;
      // Giả sử muốn tính activityTime theo giờ
      const activityTime = totalDuration / 60;
      setTodayData((prev) => ({ ...prev, activityTime }));
    }
  }, [exerciseData]);

  return {
    todayData,
    isLoading:
      stepIsLoading ||
      caloriesIsLoading ||
      waterIsLoading ||
      sleepIsLoading ||
      exerciseIsLoading,
    error:
      stepError || caloriesError || waterError || sleepError || exerciseError,
  };
}
