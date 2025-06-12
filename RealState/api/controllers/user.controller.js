import bcrypt from "bcrypt";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import Listing from "../models/listing.modal.js";
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
    if (!userDetails) return next(errorHandler(404, "User not found"));

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userDetails.password
    );
    if (!isPasswordCorrect) return next(errorHandler(400, "Wrong credentials"));

    const token = jwt.sign({ id: userDetails._id }, process.env.JWT_SECRET);
    const { password: passwordRemoved, ...userDetailsAll } = userDetails._doc;

    res
      .cookie("Access-Token", token, {
        httpOnly: true,
      })
      .status(200)
      .json(userDetailsAll);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      const { password: pass, ...userDetails } = user._doc;

      res
        .cookie("Access-Token", token, { httpOnly: true })
        .status(200)
        .json(userDetails);
    } else {
      const createPassword = Math.random().toString(36).slice(-8);

      const hashedPassword = bcrypt.hashSync(createPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...userDetails } = newUser._doc;
      res
        .cookie("Access-Token", token, { httpOnly: true })
        .status(200)
        .json(userDetails);
    }
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(403, "You can only delete your account"));

  try {
    await User.findByIdAndDelete(req.params._id);
    res.clearCookie("access_token");
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("Access-Token");
    res.status(200).json({ message: "User signed out successfully" });
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  console.log( req);;
  // res.status(200).send("user Pass Route");
  
  if ( req.params.id) {
    console.log("req.params.id", req.params.id);
    
    try {
      // const user = await User.findById(req.params.id);
      const listing = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  }else{
    return next(errorHandler(403, "You can only get your listings"));
  }
};
