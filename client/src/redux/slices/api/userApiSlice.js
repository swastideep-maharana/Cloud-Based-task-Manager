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
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "POST",
        credentials: "include",
      }),
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
      query: (id) => ({
        url: `${USER_URL}/read-noti?isReadType=${data.type}&id=${data}/${id}`,
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

export const logoutUser = () => {
  return { type: logout };
};
