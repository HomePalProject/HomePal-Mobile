import { createApi, BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { apiClient } from './client';
import { AxiosRequestConfig } from 'axios';

const axiosBaseQuery =
  (): BaseQueryFn<
    {
      url: string;
      method?: AxiosRequestConfig['method'];
      data?: AxiosRequestConfig['data'];
      params?: AxiosRequestConfig['params'];
      headers?: AxiosRequestConfig['headers'];
    },
    unknown,
    unknown
  > =>
  async ({ url, method = 'GET', data, params, headers }) => {
    try {
      const result = await apiClient({
        url,
        method,
        data,
        params,
        headers,
      });
      return { data: result.data };
    } catch (axiosError: any) {
      return {
        error: {
          status: axiosError.status || axiosError.response?.status || 'Error',
          data: axiosError.data || axiosError.response?.data || axiosError.message,
        },
      };
    }
  };

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery(),
  tagTypes: ['Overview'],
  endpoints: () => ({}),
});
