'use client';

import { useState } from 'react';
import { Button } from './button';
import Image from 'next/image';

interface ImageUploadProps {
  label?: string;
  onChange: (file: File | null) => void;
  value?: string;
}

export function ImageUpload({ label, onChange, value }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center justify-center w-full">
        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          {preview ? (
            <div className="relative w-full h-full">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-contain p-2"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={handleRemove}
              >
                Remove
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
              </svg>
              <p className="mb-2 text-sm text-gray-500">{label || 'Click to upload or drag and drop'}</p>
              <p className="text-xs text-gray-500">PNG, JPG or GIF (MAX. 800x400px)</p>
            </div>
          )}
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}
