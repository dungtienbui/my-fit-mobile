type GoalType =
  | "exerciseHours"
  | "steps"
  | "sleeping"
  | "weight"
  | "bodyFatPercentage"
  | "food"
  | "energyBurned"
  | "water";

export type GoalResponseDto = {
  _id: string;
  userId: string;
  type: GoalType;
  target: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};
