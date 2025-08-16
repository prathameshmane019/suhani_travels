"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const banner_1 = __importDefault(require("../models/banner"));
const cloudinary_1 = require("../utils/cloudinary");
const multer_1 = require("../utils/multer");
const router = express_1.default.Router();
// Get all active banners
router.get("/", async (req, res) => {
    try {
        const banners = await banner_1.default.find({
            isActive: true,
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() },
        });
        res.json(banners);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching banners" });
    }
});
// Get all banners (Admin only)
router.get("/all", async (req, res) => {
    try {
        const banners = await banner_1.default.find({});
        res.json(banners);
    }
    catch (error) {
        res.status(500).json({ message: "Error fetching all banners" });
    }
});
// Create a new banner (Admin only)
router.post("/", multer_1.upload.single('bannerImage'), async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: "Banner image is required" });
        }
        const imageBuffer = req.file.buffer;
        const result = await (0, cloudinary_1.uploadToCloudinary)(imageBuffer, {
            folder: "banners",
            public_id: `banner_${startDate.replace(/[^a-zA-Z0-9]/g, '_')}_${endDate}`
        });
        const newBanner = new banner_1.default({
            imageUrl: result.url,
            imagePublicId: result.publicId,
            startDate,
            endDate,
        });
        await newBanner.save();
        res.status(201).json(newBanner);
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating banner" });
    }
});
// Update a banner (Admin only)
router.put("/:id", multer_1.upload.single("bannerImage"), async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate, isActive } = req.body;
        const banner = await banner_1.default.findById(id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        if (req.file) {
            // New image uploaded, delete old one from Cloudinary
            if (banner.imagePublicId) {
                await (0, cloudinary_1.deleteFromCloudinary)(banner.imagePublicId);
            }
            const imageBuffer = req.file.buffer;
            const result = await (0, cloudinary_1.uploadToCloudinary)(imageBuffer, {
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating banner" });
    }
});
// Delete a banner (Admin only)
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const banner = await banner_1.default.findById(id);
        if (!banner) {
            return res.status(404).json({ message: "Banner not found" });
        }
        if (banner.imagePublicId) {
            await (0, cloudinary_1.deleteFromCloudinary)(banner.imagePublicId);
        }
        await banner.deleteOne();
        res.json({ message: "Banner deleted successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting banner" });
    }
});
exports.default = router;
//# sourceMappingURL=banners.js.map