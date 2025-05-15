import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
export const usersController = (req, res) => {
  res.send("user Pass Route");
};

export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    console.log("hashedPassword", hashedPassword);

    // Create and save new user
    const newUser = new User({ username, email, password: hashedPassword });
    console.log("newUser", newUser);

    await newUser.save();

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error creating user:", error.message.split(":"));
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const userDetails = await User.findOne({ email });
    if(!userDetails) return next(errorHandler(404, "User not found"));

    const isPasswordCorrect = await bcrypt.compare(password, userDetails.password);
    if (!isPasswordCorrect) return next(errorHandler(400, "Wrong credentials"));

    const token = jwt.sign({ id : userDetails._id}, process.env.JWT_SECRET);
    const {password : passwordRemoved, ...userDetailsAll} = userDetails._doc;

    res.cookie("Access-Token", token, {
      httpOnly: true,
    }).status(200).json(userDetailsAll);

  } catch (error) {
    next(error);
  }
};
