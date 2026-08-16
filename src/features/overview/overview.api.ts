import { baseApi } from '@/src/services/api/baseApi';
import { ApiResponse } from '@/src/types/api';
import { HouseholdOverviewReportDto } from './types';

export const overviewApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getHouseholdOverview: builder.query<ApiResponse<HouseholdOverviewReportDto>, void>({
      query: () => ({
        url: '/api/reports/household-overview',
        method: 'GET',
      }),
      providesTags: ['Overview'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetHouseholdOverviewQuery } = overviewApi;
