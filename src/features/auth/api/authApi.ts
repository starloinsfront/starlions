// src/services/registration.api.ts
import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {RegisterRequest, RegisterResponse} from "@/features/auth/api/authApi.types";


export const registrationApi = createApi({
  reducerPath: 'registrationApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/api/v1/auth/registration',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: userData,
      }),
 
      transformResponse: (response: any, meta) => {
        // При статусе 204 тело пустое, но это успех
        if (meta?.response?.status === 204) {
          return {success: true};
        }
        return response;
      },
    }),
  }),
});

// Экспортируем хук
export const {useRegisterMutation} = registrationApi;
