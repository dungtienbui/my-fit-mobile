import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type AuthResponseDto = {
  access_token: string;
};

type LoginRequestDto = {
  email: string;
  password: string;
};

type RegisterRequestDto = {
  email: string;
  password: string;
  name: string;
  gender?: string;
  age?: number;
  height?: number;
  weight?: number;
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://my-fit-webservice.onrender.com/",
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponseDto, LoginRequestDto>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation<AuthResponseDto, RegisterRequestDto>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
