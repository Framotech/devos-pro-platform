'use client';

import { parseVideoSource } from '@/lib/video';

interface VideoPlayerProps {
  title: string;
  sourceUrl?: string;
  youtubeId?: string;
  thumbnailUrl?: string;
}

export default function VideoPlayer({
  title,
  sourceUrl = '',
  youtubeId = '',
  thumbnailUrl = '',
}: VideoPlayerProps) {
  const source = parseVideoSource(sourceUrl, youtubeId);

  if (source.type === 'youtube' || source.type === 'vimeo') {
    return (
      <iframe
        title={title}
        src={source.embedUrl}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        style={{
          width: '100%',
          aspectRatio: '16 / 9',
          border: '0',
          display: 'block',
          background: '#000',
        }}
      />
    );
  }

  if (source.type === 'mp4') {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        poster={thumbnailUrl || undefined}
        style={{ width: '100%', aspectRatio: '16 / 9', display: 'block', background: '#000' }}
      >
        <source src={source.playbackUrl} type="video/mp4" />
      </video>
    );
  }

  return (
    <div
      style={{
        width: '100%',
        aspectRatio: '16 / 9',
        display: 'grid',
        placeItems: 'center',
        background: 'var(--bg3)',
        color: 'var(--text2)',
        borderBottom: '1px solid var(--border)',
        padding: '1.5rem',
        textAlign: 'center',
      }}
    >
      Unsupported video source.
    </div>
  );
}
