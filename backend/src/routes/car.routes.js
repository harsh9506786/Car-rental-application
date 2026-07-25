import express from "express";

import {
  getCars,
  getCarById,
  createCar,
  updateCar,
  deleteCar,
} from "../controllers/car.controller.js";

import protect from "../middleware/auth.middleware.js";
import adminOnly from "../middleware/admin.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();
// Public
router.get("/", getCars);
router.get("/:id", getCarById);

// Admin
router.post(
  "/",
  protect,
  adminOnly,
  upload.single("image"),
  createCar
);
router.put(
  "/:id",
  protect,
  adminOnly,
  upload.single("image"),
  updateCar
);
router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCar
);

export default router;