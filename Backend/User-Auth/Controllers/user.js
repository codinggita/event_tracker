import { User } from "../Models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// SignIn function
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body; // Destructure 'password' from the request

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password); // Corrected password comparison

    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }); // Expiry added for JWT

    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure it's sent over HTTPS in production
        sameSite: "Strict",
      })
      .json({
        success: true,
        message: `Welcome back, ${user.name}`,
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// SignUp function
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) {
      return res.status(404).json({
        success: false,
        message: "User Already Exists",
      });
    }

    if (!password || password.length < 6) {
      // Basic password validation
      return res.status(400).json({
        success: false,
        message: "Password should be at least 6 characters long",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // Corrected bcrypt.hash usage

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });  // Expiry added for JWT

    res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", // Ensure it's sent over HTTPS in production
        sameSite: "Strict",
      })
      .json({
        success: true,
        message: "Registered Successfully",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// LogOut function
export const logOut = async (req, res) => {
  try {
    res.status(200).cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in production
      sameSite: "Strict",
    }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong while logging out.",
    });
  }
};

// Get My Profile function
export const getMyProfile = async (req, res) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.status(404).json({
        success: false,
        message: "Login first",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifying JWT and handling errors

    const user = await User.findById(decoded._id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (err) {
    console.error(err);

    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token. Please log in again.",
      });
    }

    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please log in again.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching profile.",
    });
  }
};