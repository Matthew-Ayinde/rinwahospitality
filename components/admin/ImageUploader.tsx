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
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      toast.error('Only PNG, JPG, and WebP images are supported');
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error('Image must be smaller than 20MB');
      return;
    }

    try {
      setIsUploading(true);
      setProgress(0);

      const sig = await fetch('/api/upload/signature').then((r) => r.json());

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', sig.apiKey);
      formData.append('timestamp', String(sig.timestamp));
      formData.append('signature', sig.signature);
      formData.append('folder', sig.folder);

      const url = await new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setProgress(Math.round((ev.loaded / ev.total) * 100));
        };

        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.responseText).secure_url);
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Upload failed'));

        xhr.open('POST', `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`);
        xhr.send(formData);
      });

      setPreview(url);
      onChange(url);
      toast.success('Image uploaded successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setProgress(0);
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
        onClick={() => !isUploading && fileInputRef.current?.click()}
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
          {isUploading ? `Uploading... ${progress}%` : 'Click to upload image'}
        </p>
        {isUploading ? (
          <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-teal-400 h-1.5 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : (
          <p className="text-xs text-white/40 mt-2">PNG, JPG, or WebP up to 20MB</p>
        )}
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
