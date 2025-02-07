import express from "express";
import { signIn, signUp, logOut, getMyProfile} from "../Controllers/user.js";


const router = express.Router();

// Signup route
router.post("/signUp",signUp);
// Login route
router.post("/signIn",signIn);  

router.get("/logout",logOut);

router.get("/me",getMyProfile);


export default router