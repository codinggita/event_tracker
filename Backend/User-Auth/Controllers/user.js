import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// SignUp
export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(201).cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// SignIn
export const signIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(404).json({ message: "Invalid Email or Password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid Email or Password" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.status(200).cookie("token", token, { httpOnly: true }).json({
      success: true,
      message: "Login Successful",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get Profile
export const getMyProfile = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Login first" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded._id);

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// LogOut
export const logOut = async (req, res) => {
  try {
    res.status(200).cookie("token", "", { expires: new Date(Date.now()) }).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};
