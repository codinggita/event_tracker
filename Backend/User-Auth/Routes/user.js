import express from "express";
import { signIn, signUp } from "../Controllers/user.js";


const router = express.Router();

// Signup route
router.post("/signUp",signUp);
// Login route
router.post("/signIn",signIn);  



export default router