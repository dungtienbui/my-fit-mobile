export type GoalValueDto = {
  value: number;
  unit: string;
  frequency: string;
};

export type SleepingDto = {
  start: Date;
  end: Date;
  frequency: string;
};

export type WeightGoalDto = {
  target: number;
  unit: string;
};

export type PercentageGoalDto = {
  target: number;
  unit: string;
};

export type GoalRequestDto = {
  activity_exerciseHours?: GoalValueDto;
  activity_steps?: GoalValueDto;
  activity_sleeping?: SleepingDto;
  health_weight?: WeightGoalDto;
  health_bodyFatPercentage?: PercentageGoalDto;
  nutrition_food?: GoalValueDto;
  nutrition_energyBurned?: GoalValueDto;
  nutrition_water?: GoalValueDto;
};
