import bcrypt from "bcryptjs";

import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import admin from "../config/firebaseAdmin.js";

// Signup
export const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
      name,
      email,
      password: hashedPassword,
      authProvider: "email",
    };

    // Only set phone if provided, otherwise leave the field unset so it
    // doesn't collide with the unique+sparse index on phone
    if (phone) {
      userData.phone = phone;
    }

    const user = await User.create(userData);

    res.status(201).json({
      success: true,
      message: "Account created successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Google Sign-In (Firebase). Frontend authenticates with Google via
// Firebase's signInWithPopup, then sends us the resulting Firebase ID
// token. We verify it server-side and find-or-create a user against the
// verified email, then issue our own JWT - same pattern as phone login.
export const googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Missing Firebase ID token",
      });
    }

    let decoded;

    try {
      decoded = await admin.auth().verifyIdToken(idToken);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Google session. Please try again.",
      });
    }

    const {
      email,
      name,
      picture,
      uid: firebaseUid,
    } = decoded;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "No email found on this Google account.",
      });
    }

    let user = await User.findOne({
      $or: [{ firebaseUid }, { email }],
    });

    if (!user) {
      user = await User.create({
        name: name || email.split("@")[0],
        email,
        avatar: picture || "",
        firebaseUid,
        authProvider: "google",
      });
    } else if (!user.firebaseUid) {
      // Existing email/password account is now also linked to Google
      user.firebaseUid = firebaseUid;
      if (!user.avatar && picture) user.avatar = picture;
      await user.save();
    }

    res.json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};