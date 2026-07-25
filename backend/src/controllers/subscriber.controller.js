import Subscriber from "../models/subscriber.model.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        type: "warning",
        title: "Email Required",
        message: "Please enter your email address.",
      });
    }

    const exists = await Subscriber.findOne({ email });

    if (exists) {
      return res.status(200).json({
        success: true,
        type: "info",
        title: "Already Subscribed",
        message: "This email is already subscribed to our newsletter.",
      });
    }

    await Subscriber.create({ email });

    return res.status(201).json({
      success: true,
      type: "success",
      title: "Subscribed Successfully",
      message: "Thank you for subscribing to our newsletter.",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      type: "error",
      title: "Server Error",
      message: "Something went wrong. Please try again later.",
    });
  }
};