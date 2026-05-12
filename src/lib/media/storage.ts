import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export interface StoredMedia {
  fileName: string;
  mimeType: string;
  size: number;
  path: string;
  url: string;
  storageDriver: 'local';
}

const DEFAULT_UPLOAD_DIR = 'public/uploads';
const DEFAULT_PUBLIC_BASE_URL = '/uploads';

const allowedMimeTypes = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
]);

function getExtension(file: File) {
  const existing = path.extname(file.name).toLowerCase();
  if (existing) return existing;
  if (file.type === 'image/jpeg') return '.jpg';
  if (file.type === 'image/png') return '.png';
  if (file.type === 'image/webp') return '.webp';
  if (file.type === 'image/gif') return '.gif';
  if (file.type === 'video/mp4') return '.mp4';
  return '';
}

export async function storeLocalMedia(file: File, namespace = 'general'): Promise<StoredMedia> {
  if (!allowedMimeTypes.has(file.type)) {
    throw new Error('Unsupported media type');
  }

  const uploadRoot = process.env.MEDIA_UPLOAD_DIR || DEFAULT_UPLOAD_DIR;
  const publicBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL || DEFAULT_PUBLIC_BASE_URL;
  const safeNamespace = namespace.replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'general';
  const directory = path.join(process.cwd(), uploadRoot, safeNamespace);
  const fileName = `${randomUUID()}${getExtension(file)}`;
  const destination = path.join(directory, fileName);

  await mkdir(directory, { recursive: true });
  await writeFile(destination, Buffer.from(await file.arrayBuffer()));

  return {
    fileName,
    mimeType: file.type,
    size: file.size,
    path: path.join(uploadRoot, safeNamespace, fileName),
    url: `${publicBaseUrl.replace(/\/$/, '')}/${safeNamespace}/${fileName}`,
    storageDriver: 'local',
  };
}
