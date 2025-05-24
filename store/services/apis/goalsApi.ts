import { GoalRequestDto } from "../dto/request/goalsRequestDto";
import { GoalResponseDto } from "../dto/response/goalsResponseDto";
import { baseApi } from "./baseApi";

const baseUrl = "/goals";

export const goalApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGoals: builder.query<GoalResponseDto[], void>({
      query: () => baseUrl + "/me",
      providesTags: ["Goals"],
    }),

    createGoal: builder.mutation<GoalResponseDto, GoalRequestDto>({
      query: (data) => ({
        url: baseUrl,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Goals"],
    }),

    updateGoal: builder.mutation<
      GoalResponseDto,
      {
        id: string;
        data: GoalRequestDto;
      }
    >({
      query: ({ id, data }) => ({
        url: `${baseUrl}/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Goals"],
    }),
  }),
  overrideExisting: false, // Nếu đã có endpoint nào trùng thì không ghi đè
});

export const {
  useCreateGoalMutation,
  useUpdateGoalMutation,
  useGetGoalsQuery,
} = goalApi;
