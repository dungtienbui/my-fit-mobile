import {
  GoalRequestDto,
  UpdateGoalRequestDto,
} from "../dto/request/goalsRequestDto";
import { GoalResponseDto } from "../dto/response/goalsResponseDto";
import { baseApi } from "./baseApi";

const baseUrl = "/goals";

export const goalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGoals: builder.query<GoalResponseDto[], void>({
      query: () => baseUrl,
      providesTags: ["Goals"],
    }),

    createGoal: builder.mutation<GoalResponseDto, GoalRequestDto>({
      query: (body) => ({
        url: baseUrl,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Goals"],
    }),

    updateGoal: builder.mutation<
      GoalResponseDto,
      {
        id: string;
        data: Partial<UpdateGoalRequestDto>;
      }
    >({
      query: ({ id, data }) => ({
        url: `${baseUrl}/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["Goals"],
    }),

    getGoalsByType: builder.query<
      GoalResponseDto[],
      {
        type:
          | "exerciseHours"
          | "steps"
          | "sleeping"
          | "weight"
          | "bodyFatPercentage"
          | "food"
          | "energyBurned"
          | "water";
      }
    >({
      query: ({ type }) => `${baseUrl}/${type}`,
      providesTags: ["Goals"],
    }),
  }),
  overrideExisting: false, // Nếu đã có endpoint nào trùng thì không ghi đè
});

export const {
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useGetGoalsQuery,
  useGetGoalsByTypeQuery,
} = goalApi;
