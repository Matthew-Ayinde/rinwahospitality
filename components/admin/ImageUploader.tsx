'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
}

export default function ImageUploader({ value, onChange, label = 'Image', required, error }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      toast.error('Only PNG, JPG, and WebP images are supported');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await res.json();
      setPreview(data.url);
      onChange(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-white/90">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div
        className="relative border-2 border-dashed border-white/20 rounded-lg p-8 text-center cursor-pointer hover:border-teal-400/50 transition"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
        <Upload size={28} className="mx-auto mb-3 text-white/50" />
        <p className="text-sm font-medium text-white/75">
          {isUploading ? 'Uploading...' : 'Click to upload image'}
        </p>
        <p className="text-xs text-white/40 mt-2">PNG, JPG, or WebP up to 5MB</p>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {preview && (
        <div className="mt-4">
          <p className="text-xs text-white/60 mb-2">Preview</p>
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded-lg border border-white/10"
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23333" width="400" height="300"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="16" fill="%23999" text-anchor="middle" dy=".3em"%3EImage not found%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
      )}
    </div>
  );
}
