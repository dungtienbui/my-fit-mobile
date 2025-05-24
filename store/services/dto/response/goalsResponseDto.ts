import {
  GoalValueDto,
  PercentageGoalDto,
  SleepingDto,
  WeightGoalDto,
} from "../request/goalsRequestDto";

export type GoalResponseDto = {
  _id: string;
  userId: string;
  activity_exerciseHours?: GoalValueDto;
  activity_steps?: GoalValueDto;
  activity_sleeping?: SleepingDto;
  health_weight?: WeightGoalDto;
  health_bodyFatPercentage?: PercentageGoalDto;
  nutrition_food?: GoalValueDto;
  nutrition_energyBurned?: GoalValueDto;
  nutrition_water?: GoalValueDto;
};
