import { apiSlice } from "../apiSlice";

const TASKS_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${TASKS_URL}/dashboard`,
        method: "GET",
        credentials: "include", // should be 'credentials' not 'credential'
      }),
    }),
  }),
});

export const { useGetDashboardStatsQuery } = taskApiSlice;
