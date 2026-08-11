import express from "express";

import { signup, login, getProfile, googleLogin } from "../controllers/auth.controller.js";

import protect from "../middleware/auth.middleware.js";

const router = express.Router();



router.post("/signup", signup);

router.post("/login", login);

router.post("/google-login", googleLogin);

router.get("/profile", protect, getProfile);

export default router;