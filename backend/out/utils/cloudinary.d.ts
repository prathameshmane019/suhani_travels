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
export declare const uploadToCloudinary: (buffer: Buffer, options?: CloudinaryUploadOptions) => Promise<CloudinaryUploadResult>;
export declare const deleteFromCloudinary: (publicId: string) => Promise<any>;
export declare const getPublicIdFromUrl: (cloudinaryUrl: string) => string | null;
export declare const uploadMultipleToCloudinary: (buffers: Buffer[], options?: CloudinaryUploadOptions) => Promise<CloudinaryUploadResult[]>;
export interface ImageTransformation {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
}
export declare const generateTransformationUrl: (publicId: string, transformation: ImageTransformation) => string;
export declare const BUS_IMAGE_TRANSFORMATIONS: {
    thumbnail: {
        width: number;
        height: number;
        crop: string;
        quality: string;
    };
    medium: {
        width: number;
        height: number;
        crop: string;
        quality: string;
    };
    large: {
        width: number;
        height: number;
        crop: string;
        quality: string;
    };
};
//# sourceMappingURL=cloudinary.d.ts.map