import express from "express";
import cors from "cors";
import carRoutes from "./routes/car.routes.js";
import authRoutes from "./routes/auth.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import subscriberRoutes from "./routes/subscriber.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://car-rental-application-gray.vercel.app",
      "http://13.203.78.132:3000",
      "http://drivego-app.duckdns.org",
    ],
    credentials: true,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "KarZone Backend Running 🚗",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/subscriber", subscriberRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/notifications", notificationRoutes);

export default app;
