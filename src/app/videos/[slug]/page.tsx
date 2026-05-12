import { notFound } from 'next/navigation';
import PublicLayout from '@/components/shared/PublicLayout';
import VideoPlayer from '@/components/shared/VideoPlayer';
import connectDB from '@/lib/db';
import Video from '@/models/Video';
import { resolveVideoThumbnail } from '@/lib/video';

interface VideoView {
  _id: string;
  title: string;
  youtubeId: string;
  sourceUrl: string;
  thumbnailUrl: string;
  category: string;
  description: string;
  duration: string;
  views: number;
}

async function getVideo(slug: string): Promise<VideoView | null> {
  await connectDB();
  const id = slug.split('-').pop();
  const query = id?.match(/^[a-f\d]{24}$/i) ? { _id: id, published: true } : { published: true };
  const video = await Video.findOne(query).lean();
  return video ? JSON.parse(JSON.stringify(video)) : null;
}

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const video = await getVideo(slug);

  if (!video) notFound();

  const thumbnail = resolveVideoThumbnail(video.sourceUrl, video.youtubeId, video.thumbnailUrl);

  return (
    <PublicLayout>
      <section
        className="section-pad"
        style={{ padding: '4rem 2.5rem 6rem', maxWidth: 1120, margin: '0 auto' }}
      >
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 16,
            overflow: 'hidden',
            background: 'var(--bg2)',
            marginBottom: '1.5rem',
          }}
        >
          <VideoPlayer
            title={video.title}
            sourceUrl={video.sourceUrl}
            youtubeId={video.youtubeId}
            thumbnailUrl={thumbnail}
          />
        </div>
        <div className="detail-grid">
          <section>
            <div className="section-eyebrow">
              <span />
              {video.category || 'Video'} · {video.duration || 'Watch'}
            </div>
            <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', lineHeight: 1, marginBottom: '1rem' }}>
              {video.title}
            </h1>
            <p style={{ color: 'var(--text2)', lineHeight: 1.8 }}>
              {video.description || 'A focused technical video from the Framo content library.'}
            </p>
          </section>
          <aside>
            <h2>Video Details</h2>
            <div>
              <span>{video.category || 'Tutorial'}</span>
              <span>{video.duration || 'On demand'}</span>
              <span>{video.views || 0} views</span>
            </div>
          </aside>
        </div>
      </section>
    </PublicLayout>
  );
}
