import User from "../models/user.js";
import { createJWT } from "../utils/index.js";
import Notice from "../models/notification.js";
import bcrypt from "bcryptjs";

export const userController = {
  registerUser: async (req, res) => {
    try {
      const { name, email, password, isAdmin, role, title } = req.body;
      const userExist = await User.findOne({ email });

      if (userExist) {
        return res.status(400).json({
          status: false,
          message: "User already exists",
        });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        isAdmin,
        role,
        title,
      });

      // Optionally create JWT for newly registered users
      createJWT(res, user._id);

      user.password = undefined; // Remove password from response
      return res.status(201).json({
        status: true,
        message: "User registered successfully",
        user,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },

  loginUser: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res
          .status(401)
          .json({ status: false, message: "Invalid email or password." });
      }

      if (!user.isActive) {
        return res.status(403).json({
          status: false,
          message:
            "User account has been deactivated, contact the administrator",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (isMatch) {
        createJWT(res, user._id);
        user.password = undefined; // Remove password from response
        return res.status(200).json(user);
      } else {
        return res
          .status(401)
          .json({ status: false, message: "Invalid email or password" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },

  logoutUser: async (req, res) => {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        expires: new Date(0),
      });

      return res
        .status(200)
        .json({ status: true, message: "Logout successful" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },

  getTeamList: async (req, res) => {
    try {
      const users = await User.find().select("name title role email isActive");
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },

  getNotificationsList: async (req, res) => {
    try {
      const { userId } = req.user;
      const notice = await Notice.find({
        team: userId,
        isRead: { $nin: [userId] },
      }).populate("task", "title");

      return res.status(200).json(notice);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },

  updateUserProfile: async (req, res) => {
    try {
      const { userId, isAdmin } = req.user;
      const { _id, name, title, role } = req.body;

      const id = isAdmin && userId === _id ? userId : _id || userId;

      const user = await User.findById(id);

      if (user) {
        user.name = name || user.name;
        user.title = title || user.title;
        user.role = role || user.role;

        const updatedUser = await user.save();
        updatedUser.password = undefined; // Remove password from response

        return res.status(200).json({
          status: true,
          message: "Profile updated successfully.",
          user: updatedUser,
        });
      } else {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },

  markNotificationRead: async (req, res) => {
    try {
      const { userId } = req.user;
      const { isReadType, id } = req.query;

      if (isReadType === "all") {
        await Notice.updateMany(
          { team: userId, isRead: { $nin: [userId] } },
          { $addToSet: { isRead: userId } } // Use $addToSet to prevent duplicates
        );
      } else {
        const notification = await Notice.findOneAndUpdate(
          { _id: id, isRead: { $nin: [userId] } },
          { $addToSet: { isRead: userId } }, // Use $addToSet to prevent duplicates
          { new: true }
        );

        if (!notification) {
          return res
            .status(404)
            .json({
              status: false,
              message: "Notification not found or already read.",
            });
        }
      }

      return res
        .status(200)
        .json({ status: true, message: "Notifications marked as read." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },

  changeUserPassword: async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);

      if (user) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hashedPassword;
        await user.save();
        user.password = undefined; // Remove password from response

        return res.status(200).json({
          status: true,
          message: "Password changed successfully.",
        });
      } else {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },

  activateUserProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await User.findById(id);

      if (user) {
        user.isActive = req.body.isActive;
        await user.save();

        return res.status(200).json({
          status: true,
          message: `User account has been ${
            user.isActive ? "activated" : "disabled"
          }`,
        });
      } else {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },

  deleteUserProfile: async (req, res) => {
    try {
      const { id } = req.params;
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res
          .status(404)
          .json({ status: false, message: "User not found" });
      }
      return res
        .status(204)
        .json({ status: true, message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: "Server error" });
    }
  },
};
