import Car from "../models/Car.js";
import redisClient from "../config/redis.js";

const CARS_CACHE_KEY = "cars:all";
const CACHE_TTL_SECONDS = 300; // 5 minutes

// Helper: clear the cars cache whenever the fleet changes
const invalidateCarsCache = async () => {
  if (redisClient.isOpen) {
    try {
      await redisClient.del(CARS_CACHE_KEY);
    } catch (error) {
      console.log("[redis] Failed to invalidate cache:", error.message);
    }
  }
};

// GET ALL CARS
export const getCars = async (req, res) => {
  try {
    // Try serving from cache first
    if (redisClient.isOpen) {
      const cached = await redisClient.get(CARS_CACHE_KEY);
      if (cached) {
        return res.status(200).json(JSON.parse(cached));
      }
    }

    const cars = await Car.find();

    const responseData = {
      success: true,
      count: cars.length,
      cars,
    };

    // Populate cache for next request (fire-and-forget, don't block response)
    if (redisClient.isOpen) {
      redisClient
        .setEx(CARS_CACHE_KEY, CACHE_TTL_SECONDS, JSON.stringify(responseData))
        .catch((err) =>
          console.log("[redis] Failed to set cache:", err.message),
        );
    }

    res.status(200).json(responseData);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET SINGLE CAR
export const getCarById = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    res.status(200).json({
      success: true,
      car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const createCar = async (req, res) => {
  try {
    const car = await Car.create({
      name: req.body.name,
      brand: req.body.brand,
      category: req.body.category,
      images: [req.file.path],
      price: req.body.price,
      seats: req.body.seats,
      fuel: req.body.fuel,
      mileage: req.body.mileage,
      transmission: req.body.transmission,
      year: req.body.year,
      color: req.body.color,
      description: req.body.description,
      features: JSON.parse(req.body.features),
      tags: JSON.parse(req.body.tags),
    });

    await invalidateCarsCache();

    res.status(201).json({
      success: true,
      car,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCar = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.images = [req.file.path];
    }

    if (updateData.features) {
      updateData.features = JSON.parse(updateData.features);
    }

    if (updateData.tags) {
      updateData.tags = JSON.parse(updateData.tags);
    }

    const car = await Car.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    await invalidateCarsCache();

    res.json({
      success: true,
      car,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

    await car.deleteOne();

    await invalidateCarsCache();

    res.json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};