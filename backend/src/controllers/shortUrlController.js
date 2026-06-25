import { ShortURL } from "../models/shorturl.model.js";
import { URLAnalytics } from "../models/analytics.model.js";

// Generate a random short code
function generateShortCode() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let shortCode = "";
  for (let i = 0; i < 6; i++) {
    shortCode += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return shortCode;
}

// Create a new short URL
export const createShortURL = async (req, res) => {
  try {
    const { originalUrl, customUrl, expiresAt, title } = req.body;
    const userId = req.user?.id || null;

    // Validate original URL
    if (!originalUrl) {
      return res.status(400).json({ status: "BAD_REQUEST", message: "Original URL is required" });
    }

    // Use custom URL or generate one
    let shortCode = customUrl;
    if (!shortCode) {
      shortCode = generateShortCode();
      // Ensure generated code is unique
      while (await ShortURL.findOne({ shortCode })) {
        shortCode = generateShortCode();
      }
    } else {
      // Check if custom URL is already taken
      const existing = await ShortURL.findOne({ shortCode });
      if (existing) {
        return res.status(400).json({ status: "BAD_REQUEST", message: "Custom URL already taken" });
      }
    }

    // Create short URL record
    const shortURL = await ShortURL.create({
      originalUrl,
      shortCode,
      userId,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
      title: title || null,
    });

    return res.status(201).json({
      status: "SUCCESS",
      message: "Short URL created successfully",
      data: {
        originalUrl: shortURL.originalUrl,
        shortCode: shortURL.shortCode,
        shortURL: `${process.env.BASE_URL || "http://localhost:3000"}/s/${shortURL.shortCode}`,
        title: shortURL.title,
        expiresAt: shortURL.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error in createShortURL:", error.message);
    return res.status(500).json({ status: "INTERNAL_SERVER_ERROR", message: "Failed to create short URL", error: error.message });
  }
};

// Get short URL details
export const getShortURL = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const shortURL = await ShortURL.findOne({ shortCode, isActive: true });
    if (!shortURL) {
      return res.status(404).json({ status: "NOT_FOUND", message: "Short URL not found" });
    }

    // Check if expired
    if (shortURL.expiresAt && new Date() > shortURL.expiresAt) {
      return res.status(410).json({ status: "GONE", message: "Short URL has expired" });
    }

    return res.status(200).json({
      status: "SUCCESS",
      data: {
        originalUrl: shortURL.originalUrl,
        shortCode: shortURL.shortCode,
        title: shortURL.title,
        clickCount: shortURL.clickCount,
        expiresAt: shortURL.expiresAt,
        createdAt: shortURL.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in getShortURL:", error.message);
    return res.status(500).json({ status: "INTERNAL_SERVER_ERROR", message: "Failed to get short URL" });
  }
};

// Redirect to original URL
export const redirectShortURL = async (req, res) => {
  try {
    const { shortCode } = req.params;

    const shortURL = await ShortURL.findOneAndUpdate(
      { shortCode, isActive: true },
      { $inc: { clickCount: 1 } },
      { new: true }
    );

    if (!shortURL) {
      return res.status(404).json({ status: "NOT_FOUND", message: "Short URL not found" });
    }

    // Check if expired
    if (shortURL.expiresAt && new Date() > shortURL.expiresAt) {
      return res.status(410).json({ status: "GONE", message: "Short URL has expired" });
    }

    // Log analytics
    const analytics = new URLAnalytics({
      shortCode,
      ip: req.ip || req.connection.remoteAddress,
      userAgent: req.get("user-agent"),
      referrer: req.get("referrer"),
      device: {
        type: req.device?.type || "unknown",
      },
    });
    await analytics.save();

    // Redirect
    return res.redirect(shortURL.originalUrl);
  } catch (error) {
    console.error("Error in redirectShortURL:", error.message);
    return res.status(500).json({ status: "INTERNAL_SERVER_ERROR", message: "Failed to redirect" });
  }
};

// Delete short URL (user's own URLs only)
export const deleteShortURL = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const userId = req.user?.id;

    const shortURL = await ShortURL.findOne({ shortCode });
    if (!shortURL) {
      return res.status(404).json({ status: "NOT_FOUND", message: "Short URL not found" });
    }

    // Check ownership
    if (shortURL.userId.toString() !== userId) {
      return res.status(403).json({ status: "FORBIDDEN", message: "You don't have permission to delete this URL" });
    }

    await ShortURL.findByIdAndDelete(shortURL._id);

    return res.status(200).json({ status: "SUCCESS", message: "Short URL deleted successfully" });
  } catch (error) {
    console.error("Error in deleteShortURL:", error.message);
    return res.status(500).json({ status: "INTERNAL_SERVER_ERROR", message: "Failed to delete short URL" });
  }
};

// Update short URL (user's own URLs only)
export const updateShortURL = async (req, res) => {
  try {
    const { shortCode } = req.params;
    const { originalUrl, expiresAt, title } = req.body;
    const userId = req.user?.id;

    const shortURL = await ShortURL.findOne({ shortCode });
    if (!shortURL) {
      return res.status(404).json({ status: "NOT_FOUND", message: "Short URL not found" });
    }

    // Check ownership
    if (shortURL.userId.toString() !== userId) {
      return res.status(403).json({ status: "FORBIDDEN", message: "You don't have permission to update this URL" });
    }

    if (originalUrl !== undefined) {
      if (originalUrl.trim() === "") {
        return res.status(400).json({ status: "BAD_REQUEST", message: "Original URL cannot be empty" });
      }
      shortURL.originalUrl = originalUrl;
    }
    if (title !== undefined) {
      shortURL.title = title;
    }
    if (expiresAt !== undefined) {
      shortURL.expiresAt = expiresAt ? new Date(expiresAt) : null;
    }

    await shortURL.save();

    return res.status(200).json({
      status: "SUCCESS",
      message: "Short URL updated successfully",
      data: {
        originalUrl: shortURL.originalUrl,
        shortCode: shortURL.shortCode,
        title: shortURL.title,
        expiresAt: shortURL.expiresAt,
      },
    });
  } catch (error) {
    console.error("Error in updateShortURL:", error.message);
    return res.status(500).json({ status: "INTERNAL_SERVER_ERROR", message: "Failed to update short URL", error: error.message });
  }
};

