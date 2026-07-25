import dotenv from "dotenv";
import dns from "dns";
import connectDB from "./config/db.js";
import app from "./app.js";


dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();


connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
