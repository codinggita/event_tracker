import { User } from "../Models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signIn = async (req, res) => {
  const { email, password } = req.body;  // Destructure 'password' from the request

let user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Invalid Email or Password",
    });
  }

  const isMatch = await bcrypt.compare(password, user.password);  // Corrected password comparison

  if (!isMatch) {
    return res.status(404).json({
      success: false,
      message: "Invalid Email or Password",
    });
  }

  const token = jwt.sign({ _id: user._id },"fesgacsdv");  // Corrected JWT secret

  res
    .status(200)
    .cookie("token", token, {
      httpOnly: true,
    })
    .json({
      success: true,
      message: `Welcome back, ${user.name}`,
    });
};

export const signUp = async (req, res) => {
  const { name, email, password } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    return res.status(404).json({
      success: false,
      message: "User Already Exists",
    });
  }

  if (!password || password.length < 6) {  // Basic password validation
    return res.status(400).json({ success: false, message: "Password should be at least 6 characters long" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);  // Corrected bcrypt.hash usage

  user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = jwt.sign({ _id: user._id }, "fesgacsdv");  // Ensure that JWT_SECRET is loaded correctly

  res
    .status(201)
    .cookie("token", token, {
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Registered Successfully",
    });
};
