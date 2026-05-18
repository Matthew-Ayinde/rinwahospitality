'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

interface VideoUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
}

export default function VideoUploader({ value, onChange, label = 'Video', required, error }: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['video/mp4', 'video/webm', 'video/quicktime'].includes(file.type)) {
      toast.error('Only MP4, WebM, and MOV videos are supported');
      return;
    }

    if (file.size > 100 * 1024 * 1024) {
      toast.error('Video must be smaller than 100MB');
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('resourceType', 'video');

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
      toast.success('Video uploaded successfully');
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
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
        <Upload size={28} className="mx-auto mb-3 text-white/50" />
        <p className="text-sm font-medium text-white/75">
          {isUploading ? 'Uploading...' : 'Click to upload video'}
        </p>
        <p className="text-xs text-white/40 mt-2">MP4, WebM, or MOV up to 100MB</p>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      {preview && (
        <div className="mt-4">
          <p className="text-xs text-white/60 mb-2">Preview</p>
          <video
            src={preview}
            controls
            className="w-full h-40 rounded-lg border border-white/10 bg-black"
            onError={(e) => {
              console.error('Video preview error:', e);
            }}
          />
        </div>
      )}
    </div>
  );
}
