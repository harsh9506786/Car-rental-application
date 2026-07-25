import Car from "../models/Car.js";

// GET ALL CARS
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find();

    res.status(200).json({
      success: true,
      count: cars.length,
      cars,
    });
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

    const car = await Car.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found",
      });
    }

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