import { createSlice } from "@reduxjs/toolkit";

// Function to retrieve userInfo from localStorage
const getUserInfo = () => {
  const userInfo = localStorage.getItem("userInfo");
  return userInfo ? JSON.parse(userInfo) : null;
};

const initialState = {
  user: getUserInfo(),
  isSideBarOpen: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.user = null;
      localStorage.removeItem("userInfo");
    },
    setOpenSidebar: (state, action) => {
      state.isSideBarOpen = action.payload;
    },
  },
});

// Export actions for use in components
export const { setCredentials, logout, setOpenSidebar } = authSlice.actions;

// Export the reducer as the default export
export default authSlice.reducer;
