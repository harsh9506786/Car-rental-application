import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined,
    },

    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },

    authProvider: {
      type: String,
      enum: ["email", "google"],
      default: "email",
    },

    avatar: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);