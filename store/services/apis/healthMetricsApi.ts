import {
  HealthMetricRequestDto,
  UpdateHealthMetricRequestDto,
} from "../dto/request/healthMetricsRequestDto";
import { HealthMetricResponseDto } from "../dto/response/healthMetricsResponseDto";
import { baseApi } from "./baseApi";

const baseUrl = "/health-metrics";

export const healthMetricsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHealthMetrics: builder.query<HealthMetricResponseDto[], void>({
      query: () => baseUrl, // API để lấy thông tin người dùng
      providesTags: ["HealthMetrics"],
    }),

    createHealthMetric: builder.mutation<
      HealthMetricResponseDto,
      HealthMetricRequestDto
    >({
      query: (body) => ({
        url: baseUrl,
        method: "POST",
        body,
      }),
      invalidatesTags: ["HealthMetrics"],
    }),

    updateHealthMetric: builder.mutation<
      HealthMetricResponseDto,
      {
        id: string;
        data: UpdateHealthMetricRequestDto;
      }
    >({
      query: ({ id, data }) => ({
        url: `${baseUrl}/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: ["HealthMetrics"],
    }),

    deleteHealthMetric: builder.mutation<{ message: string }, { id: string }>({
      query: ({ id }) => ({
        url: `${baseUrl}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["HealthMetrics"],
    }),

    getHealthMetricsByDate: builder.query<
      HealthMetricResponseDto[],
      { date: Date }
    >({
      query: ({ date }) => ({
        url: `${baseUrl}/user/day`,
        params: {
          date: date.toISOString(),
        },
      }),
      providesTags: ["HealthMetrics"],
    }),

    getHealthMetricsByDateAndType: builder.query<
      HealthMetricResponseDto[],
      {
        date: Date;
        metricType:
          | "steps"
          | "calories"
          | "water"
          | "exercise"
          | "weight"
          | "height"
          | "sleep";
      }
    >({
      query: ({ date, metricType }) => ({
        url: `${baseUrl}/user/metric-type/day`,
        params: {
          date: date.toISOString(),
          metricType: metricType,
        },
      }),
      providesTags: ["HealthMetrics"],
    }),
    getHealthMetricsByDateRangeAndType: builder.query<
      HealthMetricResponseDto[],
      {
        start: Date;
        end: Date;
        metricType:
          | "steps"
          | "calories"
          | "water"
          | "exercise"
          | "weight"
          | "height"
          | "sleep";
      }
    >({
      query: ({ start, end, metricType }) => ({
        url: `${baseUrl}/user/metric-type/date-range`,
        params: {
          start: start.toISOString(),
          end: end.toISOString(),
          metricType: metricType,
        },
      }),
      providesTags: ["HealthMetrics"],
    }),
  }),
  overrideExisting: false, // Nếu đã có endpoint nào trùng thì không ghi đè
});

export const {
  useCreateHealthMetricMutation,
  useDeleteHealthMetricMutation,
  useUpdateHealthMetricMutation,
  useGetHealthMetricsQuery,
  useGetHealthMetricsByDateQuery,
  useGetHealthMetricsByDateAndTypeQuery,
  useGetHealthMetricsByDateRangeAndTypeQuery,
} = healthMetricsApi;
