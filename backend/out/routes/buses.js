"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bus_1 = require("../models/bus");
const auth_1 = require("../models/auth");
const multer_1 = require("../middleware/multer");
const cloudinary_1 = require("../utils/cloudinary");
const router = express_1.default.Router();
// Get all buses
router.get('/', async (req, res) => {
    try {
        const buses = await bus_1.BusModel.find();
        const busesWithThumbnails = buses.map(bus => ({
            ...bus.toObject(),
            ...(bus.imagePublicId ? {
                thumbnailUrl: (0, cloudinary_1.generateTransformationUrl)(bus.imagePublicId, cloudinary_1.BUS_IMAGE_TRANSFORMATIONS.thumbnail)
            } : {})
        }));
        console.log(busesWithThumbnails);
        res.json(busesWithThumbnails);
    }
    catch (error) {
        console.error('Error fetching buses:', error);
        res.status(500).json({ error: 'Failed to fetch buses' });
    }
});
// Get a single bus by ID
router.get('/:id', async (req, res) => {
    try {
        const bus = await bus_1.BusModel.findById(req.params.id);
        if (!bus)
            return res.status(404).json({ error: 'Bus not found' });
        res.json(bus);
    }
    catch (error) {
        console.error('Error fetching bus:', error);
        res.status(500).json({ error: 'Failed to fetch bus' });
    }
});
// Create a new bus and a corresponding agent user
router.post('/', multer_1.upload.single('image'), multer_1.handleMulterError, async (req, res) => {
    try {
        const { busModel, registrationNumber, type, seats, amenities, status, seatLayout, agentPassword } = req.body;
        console.log(req.body);
        if (!busModel || !agentPassword) {
            return res.status(400).json({
                error: 'busModel, registrationNumber, type, and agentPassword are required'
            });
        }
        let finalSeats = seats ? Number(seats) : 0;
        let finalSeatLayout = undefined;
        if (seatLayout) {
            try {
                finalSeatLayout = JSON.parse(seatLayout);
                if (finalSeatLayout && finalSeatLayout.totalSeats) {
                    finalSeats = finalSeatLayout.totalSeats;
                }
            }
            catch (e) {
                console.error("Failed to parse seatLayout JSON:", e);
                return res.status(400).json({ error: 'Invalid seatLayout format' });
            }
        }
        const amenitiesArray = Array.isArray(amenities)
            ? amenities
            : typeof amenities === 'string' && amenities.length
                ? amenities.split(',').map((a) => a.trim())
                : [];
        // Handle image upload to Cloudinary
        let imageUrl;
        let imagePublicId;
        if (req.file) {
            try {
                const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, {
                    folder: 'bus_images',
                    // Add bus registration number to filename for better organization
                    public_id: `bus_${registrationNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`
                });
                imageUrl = uploadResult.url;
                imagePublicId = uploadResult.publicId;
            }
            catch (uploadError) {
                console.error('Cloudinary upload failed:', uploadError);
                return res.status(500).json({ error: 'Failed to upload image' });
            }
        }
        const bus = new bus_1.BusModel({
            busModel,
            registrationNumber,
            type,
            seats: finalSeats,
            amenities: amenitiesArray,
            status,
            ...(imageUrl ? { image: imageUrl } : {}),
            ...(imagePublicId ? { imagePublicId } : {}),
            ...(finalSeatLayout ? { seatLayout: finalSeatLayout } : {}),
        });
        await bus.save();
        const auth = new auth_1.AuthModel({
            name: `Agent for ${registrationNumber}`,
            registrationNumber,
            password: agentPassword,
            role: 'agent',
            busId: bus._id,
        });
        await auth.save();
        res.status(201).json({ bus, auth });
    }
    catch (error) {
        console.error('Error creating bus:', error);
        res.status(500).json({ error: 'Failed to create bus' });
    }
});
// Update a bus
router.put('/:id', multer_1.upload.single('image'), multer_1.handleMulterError, async (req, res) => {
    try {
        const { busModel, registrationNumber, type, seats, amenities, status, seatLayout } = req.body;
        const update = { busModel, registrationNumber, type, status, updatedAt: new Date() };
        // Get the current bus to check for existing image
        const currentBus = await bus_1.BusModel.findById(req.params.id);
        if (!currentBus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        if (typeof seats !== 'undefined')
            update.seats = Number(seats);
        if (seatLayout) {
            try {
                const parsedSeatLayout = JSON.parse(seatLayout);
                update.seatLayout = parsedSeatLayout;
                if (parsedSeatLayout && parsedSeatLayout.totalSeats) {
                    update.seats = parsedSeatLayout.totalSeats;
                }
            }
            catch (e) {
                console.error("Failed to parse seatLayout JSON:", e);
                return res.status(400).json({ error: 'Invalid seatLayout format' });
            }
        }
        if (typeof amenities !== 'undefined') {
            update.amenities = Array.isArray(amenities)
                ? amenities
                : typeof amenities === 'string' && amenities.length
                    ? amenities.split(',').map((a) => a.trim())
                    : [];
        }
        // Handle image update
        if (req.file) {
            try {
                // Upload new image to Cloudinary
                const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(req.file.buffer, {
                    folder: 'bus_images',
                    public_id: `bus_${registrationNumber?.replace(/[^a-zA-Z0-9]/g, '_') || currentBus.registrationNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`
                });
                update.image = uploadResult.url;
                update.imagePublicId = uploadResult.publicId;
                // Delete old image from Cloudinary if it exists
                if (currentBus.imagePublicId) {
                    try {
                        await (0, cloudinary_1.deleteFromCloudinary)(currentBus.imagePublicId);
                        console.log(`Deleted old image: ${currentBus.imagePublicId}`);
                    }
                    catch (deleteError) {
                        console.error('Failed to delete old image from Cloudinary:', deleteError);
                        // Don't fail the update if old image deletion fails
                    }
                }
            }
            catch (uploadError) {
                console.error('Cloudinary upload failed:', uploadError);
                return res.status(500).json({ error: 'Failed to upload new image' });
            }
        }
        const bus = await bus_1.BusModel.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.json(bus);
    }
    catch (error) {
        console.error('Error updating bus:', error);
        res.status(500).json({ error: 'Failed to update bus' });
    }
});
// Delete a bus
router.delete('/:id', async (req, res) => {
    try {
        const bus = await bus_1.BusModel.findById(req.params.id);
        if (!bus)
            return res.status(404).json({ error: 'Bus not found' });
        // Delete image from Cloudinary if it exists
        if (bus.imagePublicId) {
            try {
                await (0, cloudinary_1.deleteFromCloudinary)(bus.imagePublicId);
                console.log(`Deleted image from Cloudinary: ${bus.imagePublicId}`);
            }
            catch (deleteError) {
                console.error('Failed to delete image from Cloudinary:', deleteError);
                // Continue with bus deletion even if image deletion fails
            }
        }
        // Delete the bus record
        await bus_1.BusModel.findByIdAndDelete(req.params.id);
        // Also delete the associated agent user
        await auth_1.AuthModel.findOneAndDelete({ busId: req.params.id });
        res.json({ message: 'Bus and associated data deleted successfully', bus });
    }
    catch (error) {
        console.error('Error deleting bus:', error);
        res.status(500).json({ error: 'Failed to delete bus' });
    }
});
// Remove image from a bus (without deleting the bus)
router.delete('/:id/image', async (req, res) => {
    try {
        const bus = await bus_1.BusModel.findById(req.params.id);
        if (!bus)
            return res.status(404).json({ error: 'Bus not found' });
        if (!bus.imagePublicId) {
            return res.status(400).json({ error: 'Bus has no image to delete' });
        }
        // Delete the image from Cloudinary
        try {
            await (0, cloudinary_1.deleteFromCloudinary)(bus.imagePublicId);
            console.log(`Deleted image from Cloudinary: ${bus.imagePublicId}`);
        }
        catch (deleteError) {
            console.error('Failed to delete image from Cloudinary:', deleteError);
            return res.status(500).json({ error: 'Failed to delete image from cloud storage' });
        }
        // Remove image references from database
        const updatedBus = await bus_1.BusModel.findByIdAndUpdate(req.params.id, {
            $unset: { image: 1, imagePublicId: 1 },
            updatedAt: new Date()
        }, { new: true });
        res.json({ message: 'Image deleted successfully', bus: updatedBus });
    }
    catch (error) {
        console.error('Error deleting bus image:', error);
        res.status(500).json({ error: 'Failed to delete bus image' });
    }
});
// Get image transformations for a bus
router.get('/:id/images', async (req, res) => {
    try {
        const bus = await bus_1.BusModel.findById(req.params.id);
        if (!bus)
            return res.status(404).json({ error: 'Bus not found' });
        if (!bus.imagePublicId) {
            return res.json({ message: 'No image found for this bus' });
        }
        const imageUrls = {
            original: bus.image,
            thumbnail: (0, cloudinary_1.generateTransformationUrl)(bus.imagePublicId, cloudinary_1.BUS_IMAGE_TRANSFORMATIONS.thumbnail),
            medium: (0, cloudinary_1.generateTransformationUrl)(bus.imagePublicId, cloudinary_1.BUS_IMAGE_TRANSFORMATIONS.medium),
            large: (0, cloudinary_1.generateTransformationUrl)(bus.imagePublicId, cloudinary_1.BUS_IMAGE_TRANSFORMATIONS.large),
        };
        res.json({ imageUrls });
    }
    catch (error) {
        console.error('Error fetching bus images:', error);
        res.status(500).json({ error: 'Failed to fetch bus images' });
    }
});
exports.default = router;
//# sourceMappingURL=buses.js.map