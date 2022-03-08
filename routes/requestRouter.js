import express from "express";
import { createRequest, checkRequest, getUserRequests, answerRequest } from "../controllers/requestController.js";
import { loggedIn } from "../middleware/loggedIn.js";

const router = express.Router()

router.post("/createRequest", loggedIn, createRequest)
router.post("/checkRequest", loggedIn, checkRequest)
router.get("/userRequests", loggedIn, getUserRequests)
router.post("/answer", loggedIn, answerRequest)

export default router