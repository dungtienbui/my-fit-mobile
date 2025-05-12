type GoalType =
  | "exerciseHours"
  | "steps"
  | "sleeping"
  | "weight"
  | "bodyFatPercentage"
  | "food"
  | "energyBurned"
  | "water";

export type GoalRequestDto = {
  type: GoalType;
  target: number;
  startDate: Date;
  endDate: Date;
};

export type UpdateGoalRequestDto = {
  target: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
};
