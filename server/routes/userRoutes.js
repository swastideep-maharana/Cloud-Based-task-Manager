import express from "express";
import { userController } from "../controllers/userController.js";

const router = express.Router();

// User registration
router.post("/register", userController.registerUser);

// User login
router.post("/login", userController.loginUser);

// User logout
router.post("/logout", userController.logoutUser);

// Get team list
router.get("/team", userController.getTeamList);

// Get notifications list
router.get("/notifications", userController.getNotificationsList);

// Update user profile
router.put("/profile", userController.updateUserProfile);

// Mark notifications as read
router.put("/notifications/read", userController.markNotificationRead); // Changed to plural for consistency

// Change user password
router.put("/change-password", userController.changeUserPassword);

// Activate user profile by ID
router.put("/activate/:id", userController.activateUserProfile);

// Delete user profile by ID
router.delete("/delete/:id", userController.deleteUserProfile);

export default router;
