import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getToken } from "../../utils/tokenUtils";

const customBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const token = await getToken(); // Lấy token trước
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: "https://my-fit-webservice.onrender.com",
    prepareHeaders: (headers) => {
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  return rawBaseQuery(args, api, extraOptions); // Gọi thực sự
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: customBaseQuery, // Dùng baseQuery async bọc ngoài
  endpoints: () => ({}),
  tagTypes: ["User", "HealthMetrics", "Goals"],
});
