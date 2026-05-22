'use client';

import { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { Upload } from 'lucide-react';

// Cloudinary's recommended minimum chunk size for chunked uploads
const CHUNK_SIZE = 6 * 1024 * 1024; // 6 MB

interface VideoUploaderProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  required?: boolean;
  error?: string;
  trimToFirstSeconds?: boolean;
}

export default function VideoUploader({
  value,
  onChange,
  label = 'Video',
  required,
  error,
  trimToFirstSeconds = true,
}: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
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
      setProgress(0);

      const sig = await fetch('/api/upload/signature').then((r) => r.json());
      const formFields: Record<string, string> = {
        api_key: sig.apiKey,
        timestamp: String(sig.timestamp),
        signature: sig.signature,
        folder: sig.folder,
      };

      const uploadId = crypto.randomUUID();
      const uploadUrl = `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`;
      let start = 0;
      let result: Record<string, unknown> = {};

      while (start < file.size) {
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunk = file.slice(start, end);
        const chunkStart = start;

        result = await new Promise<Record<string, unknown>>((resolve, reject) => {
          const fd = new FormData();
          fd.append('file', chunk);
          Object.entries(formFields).forEach(([k, v]) => fd.append(k, v));

          const xhr = new XMLHttpRequest();

          xhr.upload.onprogress = (ev) => {
            if (ev.lengthComputable) {
              setProgress(Math.round(((chunkStart + ev.loaded) / file.size) * 100));
            }
          };

          xhr.onload = () => {
            if (xhr.status === 200) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              reject(new Error(`Upload failed (${xhr.status})`));
            }
          };

          xhr.onerror = () => reject(new Error('Upload failed'));

          xhr.open('POST', uploadUrl);
          xhr.setRequestHeader('X-Unique-Upload-Id', uploadId);
          xhr.setRequestHeader('Content-Range', `bytes ${chunkStart}-${end - 1}/${file.size}`);
          xhr.send(fd);
        });

        start = end;
        setProgress(Math.round((start / file.size) * 100));
      }

      const rawUrl = result.secure_url as string;
      const url = trimToFirstSeconds ? rawUrl.replace('/upload/', '/upload/eo_7/') : rawUrl;
      setPreview(url);
      onChange(url);
      toast.success(trimToFirstSeconds ? 'Video uploaded — trimmed to first 7 seconds' : 'Video uploaded successfully');
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
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleFileSelect}
          disabled={isUploading}
          className="hidden"
        />
        <Upload size={28} className="mx-auto mb-3 text-white/50" />
        <p className="text-sm font-medium text-white/75">
          {isUploading ? `Uploading... ${progress}%` : 'Click to upload video'}
        </p>
        {isUploading ? (
          <div className="mt-3 w-full bg-white/10 rounded-full h-1.5">
            <div
              className="bg-teal-400 h-1.5 rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : (
          <p className="text-xs text-white/40 mt-2">
            MP4, WebM, or MOV up to 100MB
            {trimToFirstSeconds ? ' · auto-trimmed to first 7 s' : ''}
          </p>
        )}
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
