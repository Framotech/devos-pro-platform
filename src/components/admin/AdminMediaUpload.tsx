'use client';

import { useState } from 'react';

interface AdminMediaUploadProps {
  label?: string;
  namespace: string;
  accept?: string;
  onUploaded: (url: string, mimeType: string) => void;
}

export default function AdminMediaUpload({
  label = 'Upload media',
  namespace,
  accept = 'image/png,image/jpeg,image/webp,image/gif,video/mp4',
  onUploaded,
}: AdminMediaUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragging, setDragging] = useState(false);

  const uploadFile = (file: File) => {
    setUploading(true);
    setProgress(0);

    const data = new FormData();
    data.append('file', file);
    data.append('namespace', namespace);

    const request = new XMLHttpRequest();
    request.open('POST', '/api/media/upload');
    request.upload.onprogress = event => {
      if (event.lengthComputable) {
        setProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    request.onload = () => {
      setUploading(false);
      setDragging(false);
      if (request.status >= 200 && request.status < 300) {
        const media = JSON.parse(request.responseText) as { url: string; mimeType: string };
        onUploaded(media.url, media.mimeType);
        return;
      }
      alert('Upload failed');
    };
    request.onerror = () => {
      setUploading(false);
      setDragging(false);
      alert('Upload failed');
    };
    request.send(data);
  };

  return (
    <label
      onDragOver={event => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={event => {
        event.preventDefault();
        const file = event.dataTransfer.files?.[0];
        if (file) uploadFile(file);
      }}
      style={{
        display: 'block',
        padding: '0.85rem',
        background: dragging ? 'var(--green-dim)' : 'var(--bg3)',
        border: dragging ? '1px solid var(--border-green)' : '1px dashed var(--border)',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s',
      }}
    >
      <input
        type="file"
        accept={accept}
        style={{ display: 'none' }}
        onChange={event => {
          const file = event.target.files?.[0];
          if (file) uploadFile(file);
        }}
      />
      <span
        style={{
          display: 'block',
          fontFamily: 'var(--mono)',
          fontSize: '0.62rem',
          color: 'var(--text3)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          marginBottom: '0.35rem',
        }}
      >
        {label}
      </span>
      <span style={{ display: 'block', color: 'var(--text2)', fontSize: '0.82rem' }}>
        Drop a file here or choose from device.
      </span>
      {uploading && (
        <span style={{ display: 'block', marginTop: '0.65rem' }}>
          <span
            style={{
              display: 'block',
              height: '6px',
              background: 'var(--bg)',
              borderRadius: '999px',
              overflow: 'hidden',
            }}
          >
            <span
              style={{
                display: 'block',
                width: `${progress}%`,
                height: '100%',
                background: 'var(--green)',
                transition: 'width 0.2s',
              }}
            />
          </span>
          <span
            style={{
              display: 'block',
              marginTop: '6px',
              fontFamily: 'var(--mono)',
              fontSize: '0.62rem',
              color: 'var(--text3)',
            }}
          >
            Uploading {progress}%
          </span>
        </span>
      )}
    </label>
  );
}
