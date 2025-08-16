import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
const requiredEnvVars = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
};

// Check if all required environment variables are present
for (const [key, value] of Object.entries(requiredEnvVars)) {
  if (!value) {
    throw new Error(`Missing required environment variable: CLOUDINARY_${key.toUpperCase()}`);
  }
}

cloudinary.config({
  cloud_name: requiredEnvVars.cloud_name!,
  api_key: requiredEnvVars.api_key!,
  api_secret: requiredEnvVars.api_secret!,
});

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width: number;
  height: number;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  transformation?: any[];
  resource_type?: "image" | "raw" | "auto" | "video";
  format?: string;
  quality?: string | number;
  width?: number;
  height?: number;
  crop?: string;
  public_id?: string;
}

export const uploadToCloudinary = (
  buffer: Buffer, 
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: 'image',
        folder: 'bus_images',
        format: 'webp', // Convert to WebP for better compression
        quality: 'auto:good',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' }, // Limit max dimensions
          { quality: 'auto:good' },
          { format: 'webp' }
        ],
        ...options,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        } else {
          reject(new Error('Upload failed - no result returned'));
        }
      }
    ).end(buffer);
  });
};

export const deleteFromCloudinary = (publicId: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!publicId) {
      resolve({ result: 'ok' }); // Nothing to delete
      return;
    }

    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error('Cloudinary delete error:', error);
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

// Helper function to extract public ID from Cloudinary URL
export const getPublicIdFromUrl = (cloudinaryUrl: string): string | null => {
  try {
    // Cloudinary URL format: https://res.cloudinary.com/{cloud_name}/image/upload/v{version}/{public_id}.{format}
    const urlParts = cloudinaryUrl.split('/');
    const uploadIndex = urlParts.findIndex(part => part === 'upload');
    
    if (uploadIndex === -1 || uploadIndex + 2 >= urlParts.length) {
      return null;
    }

    // Get the part after version (v1234567890)
    const publicIdWithExtension = urlParts.slice(uploadIndex + 2).join('/');
    
    // Remove file extension
    const publicId = publicIdWithExtension.replace(/\.[^/.]+$/, '');
    
    return publicId;
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
    return null;
  }
};

// Upload multiple images (for future use)
export const uploadMultipleToCloudinary = async (
  buffers: Buffer[],
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult[]> => {
  const uploadPromises = buffers.map(buffer => uploadToCloudinary(buffer, options));
  return Promise.all(uploadPromises);
};

// Generate transformation URLs for different sizes
export interface ImageTransformation {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string | number;
  format?: string;
}

export const generateTransformationUrl = (
  publicId: string,
  transformation: ImageTransformation
): string => {
  return cloudinary.url(publicId, {
    ...transformation,
    secure: true,
  });
};

// Common transformations for bus images
export const BUS_IMAGE_TRANSFORMATIONS = {
  thumbnail: { width: 200, height: 150, crop: 'fill', quality: 'auto:good' },
  medium: { width: 600, height: 400, crop: 'limit', quality: 'auto:good' },
  large: { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' },
};