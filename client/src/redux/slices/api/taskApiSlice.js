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
const API_BASE_URL = import.meta.env.VITE_APP_BASE_URL || window.location.origin;

// Task API slice
export const taskApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query({
      query: () => ({
        url: `${TASKS_URL}/dashboard`,
        method: "GET",
        credentials: "include",
        headers: getAuthHeaders(), // Add authorization headers
      }),
    }),

    getAllTask: builder.query({
      query: ({ strQuery, isTrashed, search }) => {
        const url = new URL(TASKS_URL, API_BASE_URL); // Use the base URL
        url.searchParams.append("stage", strQuery);
        url.searchParams.append("isTrashed", isTrashed);
        if (search) url.searchParams.append("search", search); // Only append if search is defined

        return {
          url: url.pathname + url.search, // Return the complete URL
          method: "GET",
          credentials: "include",
          headers: getAuthHeaders(), // Add authorization headers
        };
      },
    }),

    createTask: builder.mutation({
      query: (data) => ({
        url: `${TASKS_URL}/create`,
        method: "POST",
        body: data,
        credentials: "include",
        headers: getAuthHeaders(), // Add authorization headers
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Task created successfully:", data); // Debugging point
          // Handle successful task creation (e.g., dispatch an action)
        } catch (error) {
          console.error("Task creation failed:", error); // Debugging point
          // Optionally handle error (e.g., show a notification)
        }
      },
    }),

    duplicateTask: builder.mutation({
      query: (id) => ({
        url: `${TASKS_URL}/duplicate/${id}`,
        method: "POST",
        credentials: "include",
        headers: getAuthHeaders(), // Add authorization headers
      }),
    }),

    updateTask: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${TASKS_URL}/up/${id}`,
        method: "PUT",
        body: data,
        credentials: "include",
        headers: getAuthHeaders(), // Add authorization headers
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Task updated successfully:", data); // Debugging point
          // Handle successful task update (e.g., dispatch an action)
        } catch (error) {
          console.error("Task update failed:", error); // Debugging point
          // Optionally handle error (e.g., show a notification)
        }
      },
    }),

    trashTask: builder.mutation({
      query: ({ id }) => ({
        url: `${TASKS_URL}/trash/${id}`,
        method: "PUT",
        credentials: "include",
        headers: getAuthHeaders(), // Add authorization headers
      }),
    }),

    createSubTask: builder.mutation({
      query: ({ data, id }) => ({
        url: `${TASKS_URL}/create-subtask/${id}`,
        method: "POST",
        body: data,
        credentials: "include",
        headers: getAuthHeaders(), // Add authorization headers
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
} = taskApiSlice;
