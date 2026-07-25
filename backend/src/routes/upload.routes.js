import express from "express";

import upload from "../middleware/upload.middleware.js";
import { uploadImage } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/", upload.single("image"), uploadImage);

export default router;