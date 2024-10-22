import { apiSlice } from "../apiSlice";
import { logout } from "../authSlice";

const AUTH_URL = "/user";

// Auth API slice
export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            localStorage.setItem("token", data.token); // Store token
          }
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.token) {
            localStorage.setItem("token", data.token); // Store token
          }
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("token"); // Remove token on logout
          dispatch(logout()); // Dispatch logout action
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApiSlice;
