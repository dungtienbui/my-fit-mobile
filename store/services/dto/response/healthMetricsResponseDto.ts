type MealType = "breakfast" | "lunch" | "dinner" | "snack" | "other";

type MetricType =
  | "steps"
  | "calories"
  | "water"
  | "exercise"
  | "weight"
  | "height"
  | "sleep";

interface MealDetails {
  mealType: MealType;
  foodName: string;
}

interface ExerciseDetails {
  activityName: string;
  duration: number;
  notes?: string;
}

export type HealthMetricResponseDto = {
  _id: string;

  userId: string; // ID của người dùng

  metricType: MetricType; // Loại chỉ số sức khỏe (steps, calories, water, etc.)

  value: number; // Giá trị của chỉ số

  date: Date; // Ngày ghi nhận chỉ số

  mealDetails?: MealDetails;

  exerciseDetails?: ExerciseDetails;
};
