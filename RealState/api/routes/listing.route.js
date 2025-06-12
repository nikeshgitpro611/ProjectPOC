import express from "express";
import { createTargetRule, deleteTargetRuleImage } from "../controllers/listing.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", createTargetRule);
router.delete("/delete/:id", verifyToken,deleteTargetRuleImage);

export default router;
