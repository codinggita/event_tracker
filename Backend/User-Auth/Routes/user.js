import express from "express";
import { signIn, signUp, logOut, getMyProfile } from "../controllers/user.js";

const router = express.Router();

router.post("/signUp", signUp);  // Register User
router.post("/signIn", signIn);  // Login User
router.get("/logout", logOut);   // Logout User
router.get("/me", getMyProfile); // Get User Profile

export default router;
