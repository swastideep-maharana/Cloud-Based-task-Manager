import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: { 
      type: String, 
      required: true, 
      trim: true // Ensures no extra whitespace 
    },
    date: { 
      type: Date, 
      default: Date.now // Use Date.now to capture creation time
    },
    priority: {
      type: String,
      default: "normal",
      enum: ["high", "medium", "normal", "low"],
    },
    stage: {
      type: String,
      default: "todo",
      enum: ["todo", "in progress", "completed"],
    },
    activities: [
      {
        type: {
          type: String,
          default: "assigned",
          enum: [
            "assigned",
            "started",
            "in progress",
            "bug",
            "completed",
            "commented",
          ],
        },
        activity: {
          type: String,
          required: true, // Make sure each activity has a description
        },
        date: { 
          type: Date, 
          default: Date.now // Captures the time the activity was added
        },
        by: { 
          type: Schema.Types.ObjectId, 
          ref: "User", 
          required: true // Required to track who performed the activity
        },
      },
    ],

    subTasks: [
      {
        title: { 
          type: String, 
          required: true // Ensure subTask has a title
        },
        date: { 
          type: Date, 
          default: Date.now // Captures when the subTask was added
        },
        tag: String,
      },
    ],
    assets: [String], // List of asset URLs or file paths
    team: [{ 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true // Ensure that tasks always have at least one team member
    }],
    isTrashed: { 
      type: Boolean, 
      default: false 
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
