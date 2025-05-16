import { logout } from "@/store/features/auth/authSlice";
import { deleteToken, getToken } from "@/store/utils/tokenUtils";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Base query có thêm token vào headers
const rawBaseQuery = fetchBaseQuery({
  baseUrl: "https://my-fit-webservice.onrender.com",
  prepareHeaders: async (headers) => {
    const token = await getToken();
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// Custom base query xử lý lỗi 401 (hết hạn)
const customBaseQuery: typeof rawBaseQuery = async (
  args,
  api,
  extraOptions
) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    console.log("Api query result: Unauthorized");
    deleteToken();
    api.dispatch(logout());
  }

  return result;
};

// Base API có thể dùng chung cho các slice
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery,
  endpoints: () => ({}),
  tagTypes: ["User", "HealthMetrics", "Goals"], // tùy bạn dùng gì
});

// test: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODFlMjkyODhhOWNhNzIzMmYzNTU0YTgiLCJlbWFpbCI6ImpvaG4zLmRvZUBleGFtcGxlLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzQ3MzcyNzAyLCJleHAiOjE3NDczNzYzMDJ9.X2cZ1Nx1GRyIQ2WK8wJxkpQ6E9bFgupbIZ09Pi29oaQ
