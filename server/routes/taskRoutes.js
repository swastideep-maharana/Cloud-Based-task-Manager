import express from "express";
import {
  createSubTask,
  createTask,
  dashboardStatistics,
  deleteRestoreTask,
  duplicateTask,
  getTask,
  getTasks,
  postTaskActivity,
  trashTask,
  updateTask,
} from "../controllers/taskController.js";
import { isAdminRoute, protectRoute } from "../middlewares/authMiddlewave.js";

const router = express.Router();

// Create Task - POST /api/task/create
router.post("/create", protectRoute, isAdminRoute, createTask);

// Duplicate Task - POST /api/task/duplicate/:id
router.post("/duplicate/:id", protectRoute, isAdminRoute, duplicateTask);

// Update Task - PUT /api/task/update/:id
// router.put("/update/:id", protectRoute, isAdminRoute, updateTask);
// Update Task - PUT /api/task/update/:id
router.put("/update/:id", protectRoute, isAdminRoute, updateTask);


// Create Subtask - PUT /api/task/create-subtask/:id
router.put("/create-subtask/:id", protectRoute, isAdminRoute, createSubTask);

// Post Task Activity - POST /api/task/activity/:id
router.post("/activity/:id", protectRoute, postTaskActivity);

// Fetch Dashboard Statistics - GET /api/task/dashboard
router.get("/dashboard", protectRoute, dashboardStatistics);

// Get All Tasks - GET /api/task/
router.get("/", protectRoute, getTasks);

// Get a Specific Task - GET /api/task/:id
router.get("/:id", protectRoute, getTask);

// Trash a Task - PUT /api/task/:id
router.put("/:id", protectRoute, isAdminRoute, trashTask);

// Delete or Restore Task - DELETE /api/task/delete-restore/:id?
router.delete(
  "/delete-restore/:id?",
  protectRoute,
  isAdminRoute,
  deleteRestoreTask
);

export default router;
