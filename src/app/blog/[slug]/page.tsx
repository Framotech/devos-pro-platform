import { notFound } from 'next/navigation';
import PublicLayout from '@/components/shared/PublicLayout';
import connectDB from '@/lib/db';
import Post from '@/models/Post';

interface PostView {
  title: string;
  body: string;
  coverImage: string;
  category: string;
  tags: string[];
  readTime: number;
  createdAt: string;
}

async function getPost(slug: string): Promise<PostView | null> {
  await connectDB();
  const post = await Post.findOne({ slug, published: true }).lean();
  return post ? JSON.parse(JSON.stringify(post)) : null;
}

export default async function BlogArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  const date = new Date(post.createdAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <PublicLayout>
      <article style={{ padding: '4rem 2.5rem 6rem', maxWidth: '900px', margin: '0 auto' }}>
        <header style={{ marginBottom: '2rem' }}>
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.7rem',
              color: 'var(--green)',
              textTransform: 'uppercase',
              letterSpacing: '0.14em',
              marginBottom: '1rem',
            }}
          >
            {post.category} · {date} · {post.readTime} min read
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 6vw, 4.7rem)', lineHeight: 1, marginBottom: '1.25rem' }}>
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {post.tags.map(tag => (
                <span key={tag} style={tagStyle}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            style={{
              width: '100%',
              maxHeight: '460px',
              objectFit: 'cover',
              borderRadius: '16px',
              border: '1px solid var(--border)',
              marginBottom: '2rem',
            }}
          />
        )}

        <div
          style={{
            whiteSpace: 'pre-wrap',
            color: 'var(--text2)',
            lineHeight: 1.9,
            fontSize: '1.02rem',
          }}
        >
          {post.body || 'Article content is not available yet.'}
        </div>
      </article>
    </PublicLayout>
  );
}

const tagStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '0.62rem',
  padding: '4px 8px',
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  color: 'var(--text2)',
  textTransform: 'uppercase' as const,
};
