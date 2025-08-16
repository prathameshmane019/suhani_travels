import express from 'express';
import { BusModel, IBusWithImageUrls } from '../models/bus';
import { AuthModel } from '../models/auth';
import upload from '../middleware/multer';
import { SeatLayout } from '../types';
import { 
  uploadToCloudinary, 
  deleteFromCloudinary, 
  BUS_IMAGE_TRANSFORMATIONS,
  generateTransformationUrl
} from '../utils/cloudinary';
import { handleMulterError } from '../utils/multer';

const router = express.Router();


// Get all buses
router.get('/', async (req: express.Request, res: express.Response) => {
  try {
    const buses = await BusModel.find();
     
    const busesWithThumbnails = buses.map(bus => ({
      ...bus.toObject(),
      ...(bus.imagePublicId ? {
        thumbnailUrl: generateTransformationUrl(bus.imagePublicId, BUS_IMAGE_TRANSFORMATIONS.thumbnail)
      } : {})
    }));
    console.log(busesWithThumbnails);
    res.json(busesWithThumbnails);
  } catch (error) {
    console.error('Error fetching buses:', error);
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
});

// Get a single bus by ID
router.get('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const bus = await BusModel.findById(req.params.id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
  
    res.json(bus);
  } catch (error) {
    console.error('Error fetching bus:', error);
    res.status(500).json({ error: 'Failed to fetch bus' });
  }
});

// Create a new bus and a corresponding agent user
router.post('/', upload.single('image'), handleMulterError, async (req: express.Request, res: express.Response) => {
  try {
    const { 
      busModel, 
      registrationNumber, 
      type, 
      seats, 
      amenities, 
      status, 
      seatLayout, 
      agentPassword 
    } = req.body as any;

    console.log(req.body);

    if (!busModel || !agentPassword) {
      return res.status(400).json({ 
        error: 'busModel, registrationNumber, type, and agentPassword are required' 
      });
    }

    let finalSeats = seats ? Number(seats) : 0;
    let finalSeatLayout: SeatLayout | undefined = undefined;

    if (seatLayout) {
      try {
        finalSeatLayout = JSON.parse(seatLayout);
        if (finalSeatLayout && finalSeatLayout.totalSeats) {
          finalSeats = finalSeatLayout.totalSeats;
        }
      } catch (e) {
        console.error("Failed to parse seatLayout JSON:", e);
        return res.status(400).json({ error: 'Invalid seatLayout format' });
      }
    }

    const amenitiesArray = Array.isArray(amenities)
      ? amenities
      : typeof amenities === 'string' && amenities.length
        ? amenities.split(',').map((a: string) => a.trim())
        : [];

    // Handle image upload to Cloudinary
    let imageUrl: string | undefined;
    let imagePublicId: string | undefined;

    if (req.file) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: 'bus_images',
          // Add bus registration number to filename for better organization
          public_id: `bus_${registrationNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`
        });
        
        imageUrl = uploadResult.url;
        imagePublicId = uploadResult.publicId;
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        return res.status(500).json({ error: 'Failed to upload image' });
      }
    }

    const bus = new BusModel({
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

    const auth = new AuthModel({
      name: `Agent for ${registrationNumber}`,
      registrationNumber,
      password: agentPassword,
      role: 'agent',
      busId: bus._id,
    });

    await auth.save();

    res.status(201).json({ bus, auth });
  } catch (error) {
    console.error('Error creating bus:', error);
    res.status(500).json({ error: 'Failed to create bus' });
  }
});

// Update a bus
router.put('/:id', upload.single('image'), handleMulterError, async (req: express.Request, res: express.Response) => {
  try {
    const { 
      busModel, 
      registrationNumber, 
      type, 
      seats, 
      amenities, 
      status, 
      seatLayout 
    } = req.body as any;
    
    const update: any = { busModel, registrationNumber, type, status, updatedAt: new Date() };

    // Get the current bus to check for existing image
    const currentBus = await BusModel.findById(req.params.id);
    if (!currentBus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    if (typeof seats !== 'undefined') update.seats = Number(seats);

    if (seatLayout) {
      try {
        const parsedSeatLayout: SeatLayout = JSON.parse(seatLayout);
        update.seatLayout = parsedSeatLayout;
        if (parsedSeatLayout && parsedSeatLayout.totalSeats) {
          update.seats = parsedSeatLayout.totalSeats;
        }
      } catch (e) {
        console.error("Failed to parse seatLayout JSON:", e);
        return res.status(400).json({ error: 'Invalid seatLayout format' });
      }
    }

    if (typeof amenities !== 'undefined') {
      update.amenities = Array.isArray(amenities)
        ? amenities
        : typeof amenities === 'string' && amenities.length
          ? amenities.split(',').map((a: string) => a.trim())
          : [];
    }

    // Handle image update
    if (req.file) {
      try {
        // Upload new image to Cloudinary
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: 'bus_images',
          public_id: `bus_${registrationNumber?.replace(/[^a-zA-Z0-9]/g, '_') || currentBus.registrationNumber.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`
        });
        
        update.image = uploadResult.url;
        update.imagePublicId = uploadResult.publicId;
        
        // Delete old image from Cloudinary if it exists
        if (currentBus.imagePublicId) {
          try {
            await deleteFromCloudinary(currentBus.imagePublicId);
            console.log(`Deleted old image: ${currentBus.imagePublicId}`);
          } catch (deleteError) {
            console.error('Failed to delete old image from Cloudinary:', deleteError);
            // Don't fail the update if old image deletion fails
          }
        }
      } catch (uploadError) {
        console.error('Cloudinary upload failed:', uploadError);
        return res.status(500).json({ error: 'Failed to upload new image' });
      }
    }

    const bus = await BusModel.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    res.json(bus);
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).json({ error: 'Failed to update bus' });
  }
});

// Delete a bus
router.delete('/:id', async (req: express.Request, res: express.Response) => {
  try {
    const bus = await BusModel.findById(req.params.id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    // Delete image from Cloudinary if it exists
    if (bus.imagePublicId) {
      try {
        await deleteFromCloudinary(bus.imagePublicId);
        console.log(`Deleted image from Cloudinary: ${bus.imagePublicId}`);
      } catch (deleteError) {
        console.error('Failed to delete image from Cloudinary:', deleteError);
        // Continue with bus deletion even if image deletion fails
      }
    }

    // Delete the bus record
    await BusModel.findByIdAndDelete(req.params.id);
    
    // Also delete the associated agent user
    await AuthModel.findOneAndDelete({ busId: req.params.id });

    res.json({ message: 'Bus and associated data deleted successfully', bus });
  } catch (error) {
    console.error('Error deleting bus:', error);
    res.status(500).json({ error: 'Failed to delete bus' });
  }
});

// Remove image from a bus (without deleting the bus)
router.delete('/:id/image', async (req: express.Request, res: express.Response) => {
  try {
    const bus = await BusModel.findById(req.params.id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });

    if (!bus.imagePublicId) {
      return res.status(400).json({ error: 'Bus has no image to delete' });
    }

    // Delete the image from Cloudinary
    try {
      await deleteFromCloudinary(bus.imagePublicId);
      console.log(`Deleted image from Cloudinary: ${bus.imagePublicId}`);
    } catch (deleteError) {
      console.error('Failed to delete image from Cloudinary:', deleteError);
      return res.status(500).json({ error: 'Failed to delete image from cloud storage' });
    }

    // Remove image references from database
    const updatedBus = await BusModel.findByIdAndUpdate(
      req.params.id, 
      { 
        $unset: { image: 1, imagePublicId: 1 }, 
        updatedAt: new Date() 
      }, 
      { new: true }
    );

    res.json({ message: 'Image deleted successfully', bus: updatedBus });
  } catch (error) {
    console.error('Error deleting bus image:', error);
    res.status(500).json({ error: 'Failed to delete bus image' });
  }
});

// Get image transformations for a bus
router.get('/:id/images', async (req: express.Request, res: express.Response) => {
  try {
    const bus = await BusModel.findById(req.params.id);
    if (!bus) return res.status(404).json({ error: 'Bus not found' });
    
    if (!bus.imagePublicId) {
      return res.json({ message: 'No image found for this bus' });
    }

    const imageUrls = {
      original: bus.image,
      thumbnail: generateTransformationUrl(bus.imagePublicId, BUS_IMAGE_TRANSFORMATIONS.thumbnail),
      medium: generateTransformationUrl(bus.imagePublicId, BUS_IMAGE_TRANSFORMATIONS.medium),
      large: generateTransformationUrl(bus.imagePublicId, BUS_IMAGE_TRANSFORMATIONS.large),
    };

    res.json({ imageUrls });
  } catch (error) {
    console.error('Error fetching bus images:', error);
    res.status(500).json({ error: 'Failed to fetch bus images' });
  }
});

export default router;