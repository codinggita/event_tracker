import express from "express";
import { createEvent, allEvents, yourEvents, editEvent, deleteEvent } from "../Controllers/Events.js";
import { checkAuth } from "../middleware/auth.js";  // ✅ Middleware Import

const router = express.Router();

router.post("/createEvent", checkAuth, createEvent); // ✅ Only Authenticated Users
router.get("/allEvents", allEvents); // ✅ Public Access
router.get("/yourEvents", checkAuth, yourEvents);
router.put("/:id", checkAuth, editEvent);
router.delete("/:id", checkAuth, deleteEvent);

export default router;
