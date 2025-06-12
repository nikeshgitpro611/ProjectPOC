import express from "express";
import {
  deleteUser,
  usersController,
  getUserListings,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
const router = express.Router();

// router.get("/test",  userController);

router.get("/test", usersController);
router.delete("/delete/:id", verifyToken, deleteUser);
// router.get("/listingId/:id", verifyToken, getUserListings);
router.get("/listingId/:id", getUserListings);
// router.delete("/delete/:id", verifyUser, deleteUser);

export default router;
