import mongoose from "mongoose";

interface iUser {
  email: string;
  password: string;
  verified: boolean;
  token: string;
}

interface iUserData extends iUser, mongoose.Document {}

const userModel = new mongoose.Schema<iUserData>(
  {
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model<iUserData>("users", userModel);
