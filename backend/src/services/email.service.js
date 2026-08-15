import nodemailer from "nodemailer";

// Gmail SMTP is free and works well for low-volume transactional emails
// like booking confirmations. For production scale, a dedicated service
// (Resend, SendGrid) would be better, but this is sufficient here.

const transporter =
  process.env.EMAIL_USER && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    : null;

const formatDate = (date) =>
  new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

export const sendBookingConfirmation = async ({
  to,
  userName,
  carName,
  pickupDate,
  returnDate,
  totalPrice,
  pickupLocation,
}) => {
  if (!transporter || !to) {
    console.log("[email] Skipping send — not configured or no recipient email.");
    return;
  }

  try {
    await transporter.sendMail({
      from: `"DriveGo" <${process.env.EMAIL_USER}>`,
      to,
      subject: "🚗 Your DriveGo booking is confirmed!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #f97316;">Booking Confirmed!</h2>
          <p>Hi ${userName},</p>
          <p>Your car has been booked successfully. Here are your details:</p>
          <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
            <tr><td style="padding: 8px 0; color: #666;">Car</td><td style="padding: 8px 0; font-weight: bold;">${carName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Pickup</td><td style="padding: 8px 0; font-weight: bold;">${formatDate(pickupDate)}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Return</td><td style="padding: 8px 0; font-weight: bold;">${formatDate(returnDate)}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Location</td><td style="padding: 8px 0; font-weight: bold;">${pickupLocation}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Total</td><td style="padding: 8px 0; font-weight: bold;">₹${totalPrice}</td></tr>
          </table>
          <p>You can manage this booking anytime from your DriveGo dashboard.</p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">— Team DriveGo</p>
        </div>
      `,
    });

    console.log(`[email] Booking confirmation sent to ${to}`);
  } catch (error) {
    // Never let an email failure break the booking flow
    console.log("[email] Failed to send:", error.message);
  }
};

export const sendBookingCancellation = async ({
  to,
  userName,
  carName,
  pickupDate,
}) => {
  if (!transporter || !to) return;

  try {
    await transporter.sendMail({
      from: `"DriveGo" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your DriveGo booking has been cancelled",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #ef4444;">Booking Cancelled</h2>
          <p>Hi ${userName},</p>
          <p>Your booking for <strong>${carName}</strong> (pickup: ${formatDate(pickupDate)}) has been cancelled.</p>
          <p>If this wasn't you, please contact support immediately.</p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">— Team DriveGo</p>
        </div>
      `,
    });

    console.log(`[email] Cancellation email sent to ${to}`);
  } catch (error) {
    console.log("[email] Failed to send:", error.message);
  }
};