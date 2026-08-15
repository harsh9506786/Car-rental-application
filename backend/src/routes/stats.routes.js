import express from "express";
import { getPublicStats } from "../controllers/stats.controller.js";

const router = express.Router();

router.get("/", getPublicStats); // public — no login needed

export default router;