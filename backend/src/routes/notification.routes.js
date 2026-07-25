import express from "express";
import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/admin.middleware.js";

import {
  getNotifications,
  markAsRead,
} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/", protect, adminOnly, getNotifications);

router.put("/:id/read", protect, adminOnly, markAsRead);

export default router;
