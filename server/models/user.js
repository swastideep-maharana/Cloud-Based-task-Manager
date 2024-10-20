import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";

// Email validation function
const emailValidator = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic regex for email validation
  return regex.test(email);
};

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // Ensure no leading/trailing whitespace
    title: { type: String, required: true, trim: true },
    role: { type: String, required: true, default: "user" }, // Default role if applicable
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: emailValidator,
        message: "Invalid email format",
      },
    },
    password: { type: String, required: true, minlength: 6 }, // Minimum password length
    isAdmin: { type: Boolean, required: true, default: false },
    tasks: [{ type: Schema.Types.ObjectId, ref: "Task" }],
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
