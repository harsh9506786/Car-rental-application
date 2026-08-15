import Car from "../models/Car.js";
import Booking from "../models/Booking.js";

export const getPublicStats = async (req, res) => {
  try {
    const totalCars = await Car.countDocuments();

    const totalBookings = await Booking.countDocuments({
      status: { $in: ["Confirmed", "Completed"] },
    });

    const distinctLocations = await Booking.distinct("pickupLocation", {
      status: { $in: ["Confirmed", "Completed"] },
    });

    res.json({
      success: true,
      stats: {
        totalCars,
        totalBookings,
        totalLocations: distinctLocations.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};