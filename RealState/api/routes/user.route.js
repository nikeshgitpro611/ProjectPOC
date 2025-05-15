import express from "express";
import { usersController } from "../controllers/user.controller.js";
const router = express.Router();

// router.get("/test",  userController);

router.get("/test", usersController);

export default router;
