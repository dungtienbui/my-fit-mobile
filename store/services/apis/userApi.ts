import { UserRequestDto } from "../dto/request/userRequestDto";
import { UserResponseDto } from "../dto/response/userResponseDto";
import { baseApi } from "./baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<UserResponseDto, void>({
      query: () => "/user/me", // API để lấy thông tin người dùng
      providesTags: ["User"],
    }),
    editUser: builder.mutation<UserResponseDto, Partial<UserRequestDto>>({
      query: (body) => ({
        url: "/user",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),
  }),
  overrideExisting: false, // Nếu đã có endpoint nào trùng thì không ghi đè
});

export const { useGetUserQuery, useEditUserMutation } = userApi;
