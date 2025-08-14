"use client";

import { useState, useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onChange: (file: File | null) => void;
  value?: string;
  label: string;
  maxSize?: number; // in MB
  accept?: string;
  aspectRatio?: 'square' | 'video' | number;
  className?: string;
}

export const ImageUpload = ({
  onChange,
  value,
  label,
  maxSize = 10,
  accept = 'image/*',
  aspectRatio = 'video',
  className
}: ImageUploadProps) => {
  const [preview, setPreview] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string>();
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback((file: File) => {
    setError(undefined);

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return false;
    }

    if (file.size > maxSize * 1024 * 1024) {
      setError(`File size must be less than ${maxSize}MB`);
      return false;
    }

    return true;
  }, [maxSize]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  }, [onChange,validateFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onChange(file);
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(undefined);
    setError(undefined);
    onChange(null);
  };

  // Keep internal preview synced with external value (useful when editing)
  useEffect(() => {
    if (typeof value === 'string' && value.length > 0) {
      setPreview(value);
    } else if (!value) {
      setPreview(undefined);
    }
  }, [value]);

  const aspectRatioClass = 
    aspectRatio === 'square' ? 'aspect-square' :
    aspectRatio === 'video' ? 'aspect-video' :
    typeof aspectRatio === 'number' ? `aspect-[${aspectRatio}]` : 'aspect-video';

  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 text-center transition-all",
          isDragging ? "border-emerald-500 bg-emerald-50" : "border-slate-200 hover:border-emerald-500",
          error && "border-red-500 hover:border-red-600",
          "focus-within:outline-none focus-within:ring-2 focus-within:ring-emerald-500 focus-within:ring-offset-2"
        )}
      >
        {preview ? (
          <div className={cn("relative w-full overflow-hidden rounded-lg", aspectRatioClass)}>
            <Image
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
              className="absolute top-2 right-2 h-8 w-8 rounded-full"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-4 p-4">
            <Upload className="w-8 h-8 mx-auto text-slate-400" />
            <div>
              <Button
                type="button"
                variant="link"
                className="px-2 py-1 h-auto font-normal"
                onClick={() => inputRef.current?.click()}
              >
                Click to upload
              </Button>
              <span className="text-slate-500"> or drag and drop</span>
            </div>
            <p className="text-xs text-slate-500">
              {accept.replace('/*', '').toUpperCase()}, up to {maxSize}MB
            </p>
          </div>
        )}
        <input
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
          ref={inputRef}
        />
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  );
};
