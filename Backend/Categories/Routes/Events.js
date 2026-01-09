import express from "express";
import { createEvent,
    allEvents,
    yourEvents,
    editEvent,
    deleteEvent,
    eventDetailPage,
    searchEvents,
    categoryEvents,
    createOrder,
    verifyPayment,
    getUserTickets,
    addOrUpdateReview,
    getEventReviews,

} from "../Controllers/Events.js";
import {
    registerForEvent,
    getRegisteredUsers,
} from "../Controllers/RegistrationController.js";
import {
    listTicketForResale,
    getResaleTickets,
    approveResaleTicket,
    purchaseResaleTicket,
    getTicketDetails,
} from "../Controllers/Events.js"; 
import { checkAuth } from "../Middleware/auth.js"; 

const router = express.Router();

// Existing Routes
router.post("/createEvent", checkAuth, createEvent); // ✅ Only Authenticated Users
router.get("/allEvents", allEvents); // ✅ Public Access
router.get("/yourEvents", checkAuth, yourEvents);
router.put("/editEvent/:id", checkAuth, editEvent);
router.delete("/deleteEvent/:id", checkAuth, deleteEvent);
router.get("/eventDetail/:id", eventDetailPage);
router.get("/events/:eventId/reviews", getEventReviews);
router.post("/events/:eventId/reviews", checkAuth, addOrUpdateReview);
router.post("/registerEvent", checkAuth, registerForEvent);
router.get("/registeredUsers/:eventId", getRegisteredUsers);
router.get("/searchEvents", searchEvents); // ✅ Search API
router.get("/category/:category", categoryEvents);
router.post("/payments/create-order", createOrder);
router.post("/payments/verify", verifyPayment);
router.get("/user/tickets/:userId", checkAuth, getUserTickets);

// New Resale Routes
router.post("/tickets/:ticketId/resell", checkAuth, listTicketForResale); // User lists ticket for resale
router.get("/tickets/resale", getResaleTickets); // Fetch all approved resale tickets
router.post("/tickets/:ticketId/approve", checkAuth, approveResaleTicket); // Host approves/rejects resale
router.post("/tickets/:ticketId/purchase-resale", checkAuth, purchaseResaleTicket); // User purchases resale ticket
router.get("/tickets/:ticketId", checkAuth, getTicketDetails );
export default router;
