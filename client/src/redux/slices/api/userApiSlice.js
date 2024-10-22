import { apiSlice } from "../apiSlice";
import { logout } from "../authSlice";

const AUTH_URL = "/user";
const USER_URL = "/user";

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
          // Handle login failure if needed (e.g., show error message)
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
            localStorage.setItem("token", data.token); // Store token on successful registration
          }
        } catch (error) {
          console.error("Registration failed:", error);
          // Handle registration failure if needed
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
          dispatch(logout()); // Dispatch logout action to clear auth state
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
  }),
});

// User API slice
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTeamList: builder.query({
      query: () => ({
        url: `${USER_URL}/team`,
        method: "GET",
        credentials: "include",
      }),
    }),
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/profile`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `${USER_URL}/${id}`,
        method: "DELETE",
        credentials: "include",
      }),
    }),
    userAction: builder.mutation({
      query: ({ isActive, _id }) => ({
        url: `${USER_URL}/action/${_id}`,
        method: "PUT",
        body: { isActive },
        credentials: "include",
      }),
    }),
    getNotification: builder.query({
      query: () => ({
        url: `${USER_URL}/notification`,
        method: "GET",
        credentials: "include",
      }),
    }),
    markNotiAsRead: builder.mutation({
      query: ({ id, type }) => ({
        url: `${USER_URL}/read-noti?id=${id}&isReadType=${type}`, // Fixed query URL
        method: "PUT",
        credentials: "include",
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `${USER_URL}/change-password`,
        method: "PUT",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

// Export hooks from both slices
export const { useLoginMutation, useRegisterMutation, useLogoutMutation } =
  authApiSlice;

export const {
  useGetTeamListQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useUserActionMutation,
  useGetNotificationQuery,
  useMarkNotiAsReadMutation,
  useChangePasswordMutation,
} = userApiSlice;

// Optional: action to clear user state on logout
export const logoutUser = () => {
  return { type: logout }; // If you have a specific action for logout, use it here
};
