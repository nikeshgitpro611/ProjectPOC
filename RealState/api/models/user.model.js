import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default:
        "https://gravatar.com/avatar/84e1f17f2ff0646da0c4257e165ff82f?s=400&d=robohash&r=x",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
