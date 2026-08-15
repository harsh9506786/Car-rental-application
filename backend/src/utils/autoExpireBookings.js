import Booking from "../models/Booking.js";

/**
 * Runs on every booking read so status always reflects reality
 * without needing a cron job / persistent server process.
 *
 * - Confirmed bookings whose return date has passed -> Completed
 *   (the rental period is over, so it moves into history)
 */
export const autoExpireBookings = async () => {
  const now = new Date();

  await Booking.updateMany(
    { status: "Confirmed", returnDate: { $lt: now } },
    { $set: { status: "Completed" } },
  );
};

export default autoExpireBookings;