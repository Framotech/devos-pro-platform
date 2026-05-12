import { createHash } from 'node:crypto';

export interface StoredMedia {
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  storageDriver: 'cloudinary';
}

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
]);

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName) {
    throw new Error('Cloud media storage is not configured.');
  }

  return { cloudName, apiKey, apiSecret, uploadPreset };
}

function getResourceType(file: File) {
  return file.type.startsWith('video/') ? 'video' : 'image';
}

function sanitizeNamespace(namespace: string) {
  return namespace.replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'general';
}

function signCloudinaryPayload(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return createHash('sha1').update(`${payload}${apiSecret}`).digest('hex');
}

export async function storeCloudMedia(file: File, namespace = 'general'): Promise<StoredMedia> {
  if (!allowedMimeTypes.has(file.type)) {
    throw new Error('Unsupported media type');
  }

  const { cloudName, apiKey, apiSecret, uploadPreset } = getCloudinaryConfig();
  const resourceType = getResourceType(file);
  const folder = `devos-pro-platform/${sanitizeNamespace(namespace)}`;
  const formData = new FormData();

  formData.set('file', file);
  formData.set('folder', folder);

  if (uploadPreset) {
    formData.set('upload_preset', uploadPreset);
  } else if (apiKey && apiSecret) {
    const timestamp = Math.floor(Date.now() / 1000);
    formData.set('api_key', apiKey);
    formData.set('timestamp', String(timestamp));
    formData.set('signature', signCloudinaryPayload({ folder, timestamp }, apiSecret));
  } else {
    throw new Error('Cloud media storage is missing upload credentials.');
  }

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    { method: 'POST', body: formData },
  );

  if (!response.ok) {
    throw new Error('Cloud media upload failed.');
  }

  const uploaded = (await response.json()) as {
    secure_url: string;
    public_id: string;
    original_filename?: string;
    format?: string;
  };

  return {
    fileName: uploaded.original_filename || file.name,
    mimeType: file.type,
    size: file.size,
    path: uploaded.public_id,
    url: uploaded.secure_url,
    storageDriver: 'cloudinary',
  };
}
