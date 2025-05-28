import { MealType, NormalMetricType } from "../type/someDtoType";

interface MealDetails {
  mealType: MealType;
  foodName: string;
}

interface ExerciseDetails {
  activityName: string;
  duration: number;
  notes?: string;
}

interface BaseMetric {
  value: number;
  date: Date;
}

interface NormalHealthMetric extends BaseMetric {
  metricType: NormalMetricType;
}

interface CaloriesHealthMetric extends BaseMetric {
  metricType: "calories";
  mealDetails: MealDetails;
}

interface ExerciseHealthMetric extends BaseMetric {
  metricType: "exercise";
  exerciseDetails: ExerciseDetails;
}

export type HealthMetricRequestDto =
  | NormalHealthMetric
  | CaloriesHealthMetric
  | ExerciseHealthMetric;

export type UpdateHealthMetricRequestDto = {
  value?: number;
  date?: Date;
  mealDetails?: MealDetails;
  exerciseDetails?: ExerciseDetails;
};
