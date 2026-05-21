import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  fileBuffer: Buffer,
  folder: string,
  fileName: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `rinwa/${folder}`,
        resource_type: 'auto',
        public_id: fileName,
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error('Upload failed'));
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}

function extractPublicId(url: string): string | null {
  const match = url.match(/\/(?:image|video|raw)\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]+)?$/);
  return match ? match[1] : null;
}

function detectResourceType(url: string): 'image' | 'video' | 'raw' {
  if (url.includes('/video/upload/')) return 'video';
  if (url.includes('/raw/upload/')) return 'raw';
  return 'image';
}

export async function deleteCloudinaryAssets(urls: (string | undefined | null)[]): Promise<void> {
  const valid = urls.filter((u): u is string => !!u && u.includes('cloudinary.com'));
  await Promise.all(
    valid.map(async (url) => {
      const publicId = extractPublicId(url);
      if (!publicId) return;
      try {
        await cloudinary.uploader.destroy(publicId, { resource_type: detectResourceType(url) });
      } catch (err) {
        console.error(`Cloudinary delete failed for ${publicId}:`, err);
      }
    })
  );
}

export function getOptimizedUrl(
  publicId: string,
  width?: number,
  height?: number,
  format: string = 'auto'
): string {
  return cloudinary.url(publicId, {
    width,
    height,
    crop: 'fill',
    quality: 'auto',
    format,
  });
}

export function generateSignedUrl(publicId: string, expiresIn: number = 3600): string {
  return cloudinary.url(publicId, {
    sign_url: true,
    type: 'authenticated',
    resource_type: 'image',
  });
}
