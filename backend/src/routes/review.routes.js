import express from "express";
import { createReview, getReviews } from "../controllers/review.controller.js";
import protect from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", getReviews); // public — homepage testimonials
router.post("/", protect, createReview);

export default router;