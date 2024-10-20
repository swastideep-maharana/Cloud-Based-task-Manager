import mongoose, { Schema } from "mongoose";

const noticeSchema = new Schema(
  {
    team: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true, // Added required validation for team
      },
    ],
    text: {
      type: String,
      required: true, // Making text required
      trim: true, // Removes excess whitespace from text
    },
    task: {
      type: Schema.Types.ObjectId,
      ref: "Task",
      required: true, // Ensuring task is required
    },
    notiType: {
      type: String,
      default: "alert",
      enum: ["alert", "message"], // Restricting values to 'alert' or 'message'
    },
    isRead: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

const Notice = mongoose.model("Notice", noticeSchema);

export default Notice;
