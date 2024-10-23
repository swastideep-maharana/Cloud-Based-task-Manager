import { apiSlice } from "../apiSlice";

// Function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Authorization token is missing."); // Debugging point
    return {};
  }
  return {
    Authorization: `Bearer ${token}`,
  };
};

const TASKS_URL = "/task";

// Access environment variables properly using import.meta.env
const API_BASE_URL =
  import.meta.env.VITE_APP_BASE_URL || window.location.origin;

// Task API slice
export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${TASKS_URL}/dashboard`,
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(),
      }),
      // Optional: Provide a way to handle potential errors or loading states in your UI
    }),

    getAllTask: builder.query({
      query: ({ strQuery, isTrashed, search }) => {
        const url = new URL(TASKS_URL, API_BASE_URL);
        url.searchParams.append("stage", strQuery);
        url.searchParams.append("isTrashed", isTrashed);
        if (search) url.searchParams.append("search", search);

        return {
          url: url.pathname + url.search,
          method: "GET",
          credentials: "include",
          headers: getAuthHeaders(),
        };
      },
    }),

    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
        headers: getAuthHeaders(),
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Task created successfully:", data);
        } catch (error) {
          console.error("Task creation failed:", error);
        }
      },
    }),

    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/duplicate/${id}`,
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(),
      }),
    }),

    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${TASKS_URL}/update/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
        headers: getAuthHeaders(),
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Task updated successfully:", data);
        } catch (error) {
          console.error("Task update failed:", error);
        }
      },
    }),

    trashTask: builder.mutation({
      query: ({ id }) => ({
        url: `${TASKS_URL}/trash/${id}`,
        method: "PUT",
        credentials: "include",
        headers: getAuthHeaders(),
      }),
    }),

    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/subtasks/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
        headers: getAuthHeaders(),
      }),
    }),

    getSigleTask: builder.query({
      query: (id) => ({
        url: `${TASKS_URL}/${id}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    postTaskActivity: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/activity/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
      }),
    }),
  }),
});

// Export hooks for usage in functional components
export const {
  useGetDashboardStatsQuery,
  useGetAllTaskQuery,
  useCreateTaskMutation,
  useDuplicateTaskMutation,
  useUpdateTaskMutation,
  useTrashTaskMutation,
  useCreateSubTaskMutation,
  useGetSigleTaskQuery,
  usePostTaskActivityMutation,
} = taskApiSlice;
