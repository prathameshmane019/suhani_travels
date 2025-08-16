"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BUS_IMAGE_TRANSFORMATIONS = exports.generateTransformationUrl = exports.uploadMultipleToCloudinary = exports.getPublicIdFromUrl = exports.deleteFromCloudinary = exports.uploadToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
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
cloudinary_1.v2.config({
    cloud_name: requiredEnvVars.cloud_name,
    api_key: requiredEnvVars.api_key,
    api_secret: requiredEnvVars.api_secret,
});
const uploadToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload_stream({
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
        }, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
            }
            else if (result) {
                resolve({
                    url: result.secure_url,
                    publicId: result.public_id,
                    width: result.width,
                    height: result.height,
                });
            }
            else {
                reject(new Error('Upload failed - no result returned'));
            }
        }).end(buffer);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const deleteFromCloudinary = (publicId) => {
    return new Promise((resolve, reject) => {
        if (!publicId) {
            resolve({ result: 'ok' }); // Nothing to delete
            return;
        }
        cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error('Cloudinary delete error:', error);
                reject(error);
            }
            else {
                resolve(result);
            }
        });
    });
};
exports.deleteFromCloudinary = deleteFromCloudinary;
// Helper function to extract public ID from Cloudinary URL
const getPublicIdFromUrl = (cloudinaryUrl) => {
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
    }
    catch (error) {
        console.error('Error extracting public ID from URL:', error);
        return null;
    }
};
exports.getPublicIdFromUrl = getPublicIdFromUrl;
// Upload multiple images (for future use)
const uploadMultipleToCloudinary = async (buffers, options = {}) => {
    const uploadPromises = buffers.map(buffer => (0, exports.uploadToCloudinary)(buffer, options));
    return Promise.all(uploadPromises);
};
exports.uploadMultipleToCloudinary = uploadMultipleToCloudinary;
const generateTransformationUrl = (publicId, transformation) => {
    return cloudinary_1.v2.url(publicId, {
        ...transformation,
        secure: true,
    });
};
exports.generateTransformationUrl = generateTransformationUrl;
// Common transformations for bus images
exports.BUS_IMAGE_TRANSFORMATIONS = {
    thumbnail: { width: 200, height: 150, crop: 'fill', quality: 'auto:good' },
    medium: { width: 600, height: 400, crop: 'limit', quality: 'auto:good' },
    large: { width: 1200, height: 800, crop: 'limit', quality: 'auto:good' },
};
//# sourceMappingURL=cloudinary.js.map