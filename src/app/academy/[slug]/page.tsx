import { notFound } from 'next/navigation';
import PublicLayout from '@/components/shared/PublicLayout';
import VideoPlayer from '@/components/shared/VideoPlayer';
import connectDB from '@/lib/db';
import Course from '@/models/Course';

interface CourseView {
  title: string;
  thumbnail: string;
  bannerImage: string;
  price: number;
  link: string;
  instructor: string;
  category: string;
  introVideoUrl: string;
  enrollmentStatus: string;
  curriculum: string[];
  lessons: string[];
  techStack: string[];
  description: string;
  duration: string;
  level: string;
  tags: string[];
}

async function getCourse(slug: string): Promise<CourseView | null> {
  await connectDB();
  const course = await Course.findOne({ slug, published: true }).lean();
  return course ? JSON.parse(JSON.stringify(course)) : null;
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) notFound();

  const priceLabel = course.price === 0 ? 'Free' : `$${course.price}`;
  const enrollmentLabel =
    course.enrollmentStatus === 'waitlist'
      ? 'Join Waitlist'
      : course.enrollmentStatus === 'closed'
        ? 'Enrollment Closed'
        : 'Enroll Now';

  return (
    <PublicLayout>
      <section style={{ padding: '4rem 2.5rem 6rem', maxWidth: '1180px', margin: '0 auto' }}>
        <div
          style={{
            minHeight: '340px',
            display: 'flex',
            alignItems: 'flex-end',
            padding: '2rem',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            overflow: 'hidden',
            position: 'relative',
            background: 'var(--bg2)',
            marginBottom: '2rem',
          }}
        >
          {(course.bannerImage || course.thumbnail) && (
            <img
              src={course.bannerImage || course.thumbnail}
              alt={course.title}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: 0.35,
              }}
            />
          )}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(13,17,23,0.2), rgba(13,17,23,0.95))',
            }}
          />
          <div style={{ position: 'relative', maxWidth: '760px' }}>
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
              {course.category || 'Academy'} · {course.level || 'Beginner'}
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4.5rem)', lineHeight: 1, marginBottom: '1rem' }}>
              {course.title}
            </h1>
            <p style={{ color: 'var(--text2)', lineHeight: 1.75, fontSize: '1rem' }}>
              {course.description}
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '1.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {course.introVideoUrl && (
              <div style={{ border: '1px solid var(--border)', borderRadius: '14px', overflow: 'hidden' }}>
                <VideoPlayer title={`${course.title} preview`} sourceUrl={course.introVideoUrl} />
              </div>
            )}

            <Panel title="Curriculum">
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {(course.curriculum.length ? course.curriculum : ['Course overview', 'Project walkthrough']).map(
                  (item, index) => (
                    <div key={item} style={rowStyle}>
                      <span style={numberStyle}>{String(index + 1).padStart(2, '0')}</span>
                      <span>{item}</span>
                    </div>
                  ),
                )}
              </div>
            </Panel>

            <Panel title="Lessons">
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {(course.lessons.length ? course.lessons : ['Introduction', 'Setup', 'Implementation']).map(
                  (lesson, index) => (
                    <div key={lesson} style={rowStyle}>
                      <span style={numberStyle}>{String(index + 1).padStart(2, '0')}</span>
                      <span>{lesson}</span>
                    </div>
                  ),
                )}
              </div>
            </Panel>
          </div>

          <aside
            style={{
              height: 'fit-content',
              position: 'sticky',
              top: '88px',
              background: 'var(--bg2)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              padding: '1.25rem',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>{priceLabel}</div>
            <Meta label="Instructor" value={course.instructor || 'Framo'} />
            <Meta label="Duration" value={course.duration || 'Self-paced'} />
            <Meta label="Level" value={course.level || 'Beginner'} />
            <Meta label="Enrollment" value={course.enrollmentStatus || 'open'} />
            {course.link && course.enrollmentStatus !== 'closed' ? (
              <a href={course.link} target="_blank" rel="noreferrer" style={ctaStyle}>
                {enrollmentLabel}
              </a>
            ) : (
              <button disabled style={{ ...ctaStyle, opacity: 0.55, cursor: 'not-allowed' }}>
                {enrollmentLabel}
              </button>
            )}
            {course.techStack.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1.25rem' }}>
                {course.techStack.map(tag => (
                  <span key={tag} style={tagStyle}>
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </aside>
        </div>
      </section>
    </PublicLayout>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1.25rem' }}>
      <h2 style={{ fontSize: '1rem', marginBottom: '1rem' }}>{title}</h2>
      {children}
    </section>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', padding: '0.75rem 0', borderTop: '1px solid var(--border)' }}>
      <span style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: '0.68rem', textTransform: 'uppercase' }}>{label}</span>
      <span style={{ color: 'var(--text2)', textAlign: 'right' }}>{value}</span>
    </div>
  );
}

const rowStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.85rem',
  padding: '0.9rem',
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
};

const numberStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '0.68rem',
  color: 'var(--green)',
};

const ctaStyle = {
  display: 'block',
  width: '100%',
  marginTop: '1.25rem',
  padding: '0.85rem 1rem',
  background: 'var(--green)',
  color: '#000',
  border: 'none',
  borderRadius: '8px',
  textAlign: 'center' as const,
  textDecoration: 'none',
  fontWeight: 800,
  cursor: 'pointer',
};

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
