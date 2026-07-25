import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    images: [
      {
        type: String,
        required: true,
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    seats: {
      type: Number,
      required: true,
    },

    fuel: {
      type: String,
      required: true,
    },

    mileage: {
      type: String,
      required: true,
    },

    transmission: {
      type: String,
      required: true,
    },

    year: {
      type: Number,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    rating: {
      type: Number,
      default: 4.8,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    description: {
      type: String,
      required: true,
    },

    features: [
      {
        type: String,
      },
    ],

    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Car", carSchema);