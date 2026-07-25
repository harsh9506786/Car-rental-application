import Booking from "../models/Booking.js";
import Car from "../models/Car.js";
import Notification from "../models/Notification.js";

export const createBooking = async (req, res) => {
  try {
    const car = await Car.findById(req.body.carId);
    if (!car) {
      return res.status(404).json({
        success: false,
        type: "error",
        title: "Car Not Found",
        message: "The selected car does not exist.",
      });
    }
    const pickupDate = new Date(req.body.pickupDate);
    const returnDate = new Date(req.body.returnDate);

    if (returnDate < pickupDate) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Invalid Dates",
        message: "Return date cannot be before pickup date.",
      });
    }
    const totalDays = Math.max(
      1,
      Math.ceil((returnDate - pickupDate) / (1000 * 60 * 60 * 24)),
    );

    const totalPrice = totalDays * car.price;

    const existingBooking = await Booking.findOne({
      car: car._id,

      status: {
        $ne: "Cancelled",
      },

      pickupDate: {
        $lte: returnDate,
      },

      returnDate: {
        $gte: pickupDate,
      },
    });
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        type: "error",
        title: "Car Already Booked",
        message: "Please choose another car.",
      });
    }

    const booking = await Booking.create({
      user: req.user.id,

      car: car._id,

      pickupDate,
      returnDate,

      totalDays,
      totalPrice,

      pickupLocation: req.body.pickupLocation,

      phone: req.body.phone,

      notes: req.body.notes,
    });

    await Notification.create({
      title: "New Booking",
      message: `${req.user.name} booked ${car.name}`,
      type: "booking",
    });

    res.status(201).json({
      success: true,
      type: "success",
      title: "Booking Confirmed",
      message: "Your booking has been placed successfully.",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      type: "error",
      title: "Booking Failed",
      message: "Something went wrong. Please try again.",
    });
  }
};

export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user.id,
    })
      .populate("user", "name email")
      .populate("car", "name brand images price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = req.body.status;

    await booking.save();

    res.json({
      success: true,
      message: "Status updated",
      booking,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};