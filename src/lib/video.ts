export type VideoSourceType = 'youtube' | 'vimeo' | 'mp4' | 'external' | 'unknown';

export interface ParsedVideoSource {
  type: VideoSourceType;
  originalUrl: string;
  embedUrl: string;
  playbackUrl: string;
  providerId: string;
  thumbnailUrl: string;
}

const YOUTUBE_ID_PATTERN = /^[a-zA-Z0-9_-]{11}$/;

function parseUrl(value: string) {
  try {
    return new URL(value);
  } catch {
    return null;
  }
}

function parseYouTubeId(value: string, url: URL | null) {
  if (YOUTUBE_ID_PATTERN.test(value)) return value;
  if (!url) return '';

  const host = url.hostname.replace(/^www\./, '');
  if (host === 'youtu.be') return url.pathname.split('/').filter(Boolean)[0] || '';
  if (host.endsWith('youtube.com')) {
    if (url.pathname.startsWith('/embed/')) return url.pathname.split('/')[2] || '';
    if (url.pathname.startsWith('/shorts/')) return url.pathname.split('/')[2] || '';
    return url.searchParams.get('v') || '';
  }

  return '';
}

function parseVimeoId(url: URL | null) {
  if (!url) return '';
  const host = url.hostname.replace(/^www\./, '');
  if (!host.endsWith('vimeo.com')) return '';
  return url.pathname.split('/').filter(Boolean).find(segment => /^\d+$/.test(segment)) || '';
}

export function parseVideoSource(source: string, fallbackYoutubeId = ''): ParsedVideoSource {
  const raw = source.trim() || fallbackYoutubeId.trim();
  const url = parseUrl(raw);
  const youtubeId = parseYouTubeId(raw, url);

  if (youtubeId) {
    return {
      type: 'youtube',
      originalUrl: raw,
      embedUrl: `https://www.youtube.com/embed/${youtubeId}`,
      playbackUrl: `https://www.youtube.com/watch?v=${youtubeId}`,
      providerId: youtubeId,
      thumbnailUrl: `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`,
    };
  }

  const vimeoId = parseVimeoId(url);
  if (vimeoId) {
    return {
      type: 'vimeo',
      originalUrl: raw,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}`,
      playbackUrl: raw,
      providerId: vimeoId,
      thumbnailUrl: '',
    };
  }

  const lower = raw.toLowerCase();
  const isMp4 = lower.endsWith('.mp4') || lower.includes('.mp4?') || lower.startsWith('/uploads/');

  if (isMp4) {
    return {
      type: 'mp4',
      originalUrl: raw,
      embedUrl: '',
      playbackUrl: raw,
      providerId: '',
      thumbnailUrl: '',
    };
  }

  return {
    type: url ? 'external' : 'unknown',
    originalUrl: raw,
    embedUrl: '',
    playbackUrl: raw,
    providerId: '',
    thumbnailUrl: '',
  };
}

export function resolveVideoThumbnail(
  source: string,
  fallbackYoutubeId = '',
  explicitThumbnail = '',
) {
  if (explicitThumbnail) return explicitThumbnail;
  return parseVideoSource(source, fallbackYoutubeId).thumbnailUrl;
}
