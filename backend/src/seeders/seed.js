import dotenv from "dotenv";

dotenv.config();

import connectDB from "../config/db.js";

import Car from "../models/Car.js";

import cars from "./cars.js";

const importData = async () => {
  try {

    await connectDB();

    await Car.deleteMany();

    await Car.insertMany(cars);

    console.log("Cars Inserted Successfully");

    process.exit();

  } catch (error) {

    console.log(error);

    process.exit(1);

  }
};

importData();