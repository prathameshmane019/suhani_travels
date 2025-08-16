import express from "express";
import Banner from "../models/banner"; 
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary";  
import fs from 'fs/promises';
import { upload } from "../utils/multer";
const router = express.Router();

// Get all active banners
router.get("/", async (req, res) => {
  try {
    const banners = await Banner.find({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() },
    });
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching banners" });
  }
});

// Get all banners (Admin only)
router.get("/all", async (req, res) => {
  try {
    const banners = await Banner.find({});
    res.json(banners);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all banners" });
  }
});

// Create a new banner (Admin only)
router.post(
  "/", 
   upload.single('bannerImage'),
  async (req, res) => {
    try {
      const { startDate, endDate } = req.body;
      if (!req.file) {
        return res.status(400).json({ message: "Banner image is required" });
      }

      const imageBuffer = req.file.buffer;

      const result = await uploadToCloudinary(imageBuffer, {
        folder: "banners",
        public_id: `banner_${startDate.replace(/[^a-zA-Z0-9]/g, '_')}_${endDate}`
      });

      const newBanner = new Banner({
        imageUrl: result.url,
        imagePublicId: result.publicId,
        startDate,
        endDate,
      });

      await newBanner.save();
      res.status(201).json(newBanner);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error creating banner" });
    }
  }
);

// Update a banner (Admin only)
router.put(
  "/:id", 
  upload.single("bannerImage"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { startDate, endDate, isActive } = req.body;

      const banner = await Banner.findById(id);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      if (req.file) {
        // New image uploaded, delete old one from Cloudinary
        if (banner.imagePublicId) {
          await deleteFromCloudinary(banner.imagePublicId);
        }

        const imageBuffer = req.file.buffer;
        const result = await uploadToCloudinary(imageBuffer, {
          folder: "banners",
          public_id: `banner_${startDate.replace(/[^a-zA-Z0-9]/g, '_')}_${endDate}`,
        });
        banner.imageUrl = result.url;
        banner.imagePublicId = result.publicId;

        }

      banner.startDate = startDate || banner.startDate;
      banner.endDate = endDate || banner.endDate;
      banner.isActive = typeof isActive === 'boolean' ? isActive : banner.isActive;

      await banner.save();
      res.json(banner);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error updating banner" });
    }
  }
);

// Delete a banner (Admin only)
router.delete(
  "/:id", 
  async (req, res) => {
    try {
      const { id } = req.params;

      const banner = await Banner.findById(id);
      if (!banner) {
        return res.status(404).json({ message: "Banner not found" });
      }

      if (banner.imagePublicId) {
        await deleteFromCloudinary(banner.imagePublicId);
      }

      await banner.deleteOne();
      res.json({ message: "Banner deleted successfully" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error deleting banner" });
    }
  }
);

export default router;