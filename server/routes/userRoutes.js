import express from "express";
import { userController } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);
router.get("/team", userController.getTeamList);
router.get("/notifications", userController.getNotificationsList);
router.put("/profile", userController.updateUserProfile);
router.put("/notification", userController.markNotificationRead);
router.put("/password", userController.changeUserPassword);
router.put("/activate/:id", userController.activateUserProfile); // Ensure the method is correctly referenced
router.delete("/delete/:id", userController.deleteUserProfile);

export default router;
