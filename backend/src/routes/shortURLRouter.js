import { Router } from "express";
import { createShortURL, getShortURL, deleteShortURL, updateShortURL } from "../controllers/shortUrlController.js";
import { protect } from "../middlewares/authMiddleware.js";

const shortURLRouter = Router();

// Create short URL (protected)
shortURLRouter.post("/", protect, createShortURL);

// Get short URL details (public)
shortURLRouter.get("/:shortCode", getShortURL);

// Update short URL (protected)
shortURLRouter.patch("/:shortCode", protect, updateShortURL);

// Delete short URL (protected)
shortURLRouter.delete("/:shortCode", protect, deleteShortURL);

export default shortURLRouter;
