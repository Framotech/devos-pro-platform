'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';

interface Project {
  _id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  techStack: string[];
  status: string;
}

interface Course {
  _id: string;
  title: string;
  slug: string;
  thumbnail: string;
  bannerImage: string;
  description: string;
  level: string;
  duration: string;
  price: number;
  techStack: string[];
}

interface Video {
  _id: string;
  title: string;
  youtubeId: string;
  sourceType: string;
  sourceUrl: string;
  thumbnailUrl: string;
  category: string;
  duration: string;
  description: string;
}

const statusColors: Record<string, string> = {
  running: 'var(--green)',
  exited: 'var(--text3)',
  paused: '#F0B429',
};

const levelColors: Record<string, string> = {
  Beginner: 'var(--green)',
  Intermediate: 'var(--blue)',
  Advanced: '#F0B429',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function projectHref(project: Project) {
  return `/projects/${project.slug || project._id}`;
}

function courseHref(course: Course) {
  return `/courses/${course.slug || course._id}`;
}

function videoSlug(video: Video) {
  const titleSlug = slugify(video.title || 'video');
  return `${titleSlug}-${video._id}`;
}

function videoThumbnail(video: Video) {
  if (video.thumbnailUrl) return video.thumbnailUrl;
  if (video.youtubeId) return `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
  return '';
}

function SkeletonCard() {
  return (
    <div className="premium-card">
      <div
        style={{
          aspectRatio: '16 / 10',
          background: 'var(--bg3)',
          animation: 'pulse 1.5s infinite',
        }}
      />
      <div style={{ padding: '1.15rem' }}>
        <div
          style={{
            height: 16,
            width: '62%',
            background: 'var(--bg3)',
            borderRadius: 4,
            marginBottom: 10,
          }}
        />
        <div style={{ height: 12, background: 'var(--bg3)', borderRadius: 4, marginBottom: 8 }} />
        <div style={{ height: 12, width: '78%', background: 'var(--bg3)', borderRadius: 4 }} />
      </div>
    </div>
  );
}

export default function HomeFeatured() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [loadingAcademy, setLoadingAcademy] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/api/projects/published')
      .then((r) => r.json())
      .then((d) => {
        setProjects(Array.isArray(d) ? d.slice(0, 3) : []);
        setLoadingProjects(false);
      })
      .catch(() => setLoadingProjects(false));

    Promise.all([
      fetch('/api/courses').then((r) => r.json()),
      fetch('/api/videos').then((r) => r.json()),
    ])
      .then(([c, v]) => {
        setCourses(Array.isArray(c) ? c.filter((x: Course) => x).slice(0, 3) : []);
        setVideos(Array.isArray(v) ? v.filter((x: Video) => x).slice(0, 3) : []);
        setLoadingAcademy(false);
      })
      .catch(() => setLoadingAcademy(false));
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.querySelectorAll('.scroll-fade').forEach((el, i) => {
              setTimeout(() => el.classList.add('visible'), i * 90);
            });
          }
        });
      },
      { threshold: 0.05 },
    );

    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, [projects, courses, videos]);

  const academyItems = useMemo(
    () => [
      ...courses.map((course) => ({ type: 'course' as const, course })),
      ...videos.map((video) => ({ type: 'video' as const, video })),
    ],
    [courses, videos],
  );

  return (
    <div ref={sectionRef} style={{ borderTop: '1px solid var(--border)' }}>
      <section
        className="section-pad"
        style={{ padding: '5rem 2.5rem', maxWidth: '1200px', margin: '0 auto' }}
      >
        <SectionHeader
          eyebrow="Deployed Containers"
          title="Featured"
          accent="Projects"
          href="/projects"
        />

        <div className="premium-card-grid premium-card-grid--three">
          {loadingProjects ? (
            [1, 2, 3].map((i) => <SkeletonCard key={i} />)
          ) : projects.length === 0 ? (
            <EmptyState label="No projects published yet." />
          ) : (
            projects.map((project) => (
              <Link
                key={project._id}
                href={projectHref(project)}
                prefetch
                className="premium-card scroll-fade"
              >
                <div className="premium-card__media">
                  {project.image ? (
                    <img src={project.image} alt={project.name} loading="lazy" />
                  ) : (
                    <div className="premium-card__placeholder">FR</div>
                  )}
                  <div className="premium-card__shade" />
                  <span
                    className="premium-card__badge"
                    style={{ color: statusColors[project.status] || 'var(--green)' }}
                  >
                    <span style={{ background: statusColors[project.status] || 'var(--green)' }} />
                    {project.status || 'running'}
                  </span>
                </div>
                <div className="premium-card__body">
                  <h3>{project.name}</h3>
                  <p>{project.description}</p>
                  <div className="premium-card__meta">
                    {(project.techStack || []).slice(0, 3).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </section>

      <section
        className="section-pad"
        style={{
          padding: '5rem 2.5rem',
          background: 'var(--bg2)',
          borderTop: '1px solid var(--border)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <SectionHeader eyebrow="Learning Hub" title="Videos +" accent="Courses" href="/academy" />

          <div className="premium-card-grid premium-card-grid--three">
            {loadingAcademy ? (
              [1, 2, 3].map((i) => <SkeletonCard key={i} />)
            ) : academyItems.length === 0 ? (
              <EmptyState label="No videos or courses published yet." />
            ) : (
              academyItems.map((item) => {
                if (item.type === 'course') {
                  const image = item.course.bannerImage || item.course.thumbnail;
                  return (
                    <Link
                      key={`course-${item.course._id}`}
                      href={courseHref(item.course)}
                      prefetch
                      className="premium-card scroll-fade"
                    >
                      <div className="premium-card__media">
                        {image ? (
                          <img src={image} alt={item.course.title} loading="lazy" />
                        ) : (
                          <div className="premium-card__placeholder">CV</div>
                        )}
                        <div className="premium-card__shade" />
                        <span
                          className="premium-card__badge"
                          style={{ color: levelColors[item.course.level] || 'var(--green)' }}
                        >
                          {item.course.level || 'Course'}
                        </span>
                      </div>
                      <div className="premium-card__body">
                        <h3>{item.course.title}</h3>
                        <p>{item.course.description}</p>
                        <div className="premium-card__meta">
                          <span>{item.course.duration || 'Self-paced'}</span>
                          <span>{item.course.price === 0 ? 'Free' : `$${item.course.price}`}</span>
                        </div>
                      </div>
                    </Link>
                  );
                }

                const image = videoThumbnail(item.video);
                return (
                  <Link
                    key={`video-${item.video._id}`}
                    href={`/videos/${videoSlug(item.video)}`}
                    prefetch
                    className="premium-card scroll-fade"
                  >
                    <div className="premium-card__media">
                      {image ? (
                        <img src={image} alt={item.video.title} loading="lazy" />
                      ) : (
                        <div className="premium-card__placeholder">PLAY</div>
                      )}
                      <div className="premium-card__shade" />
                      <span className="premium-card__play" aria-hidden="true">
                        ▶
                      </span>
                      <span className="premium-card__badge">
                        {item.video.duration || item.video.category || 'Video'}
                      </span>
                    </div>
                    <div className="premium-card__body">
                      <h3>{item.video.title}</h3>
                      <p>{item.video.description || item.video.category}</p>
                      <div className="premium-card__meta">
                        <span>{item.video.category || 'Tutorial'}</span>
                        <span>Watch</span>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  accent,
  href,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  href: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '2.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'var(--mono)',
            fontSize: '0.72rem',
            color: 'var(--green)',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ width: 24, height: 1, background: 'var(--green)', display: 'block' }} />
          {eyebrow}
        </div>
        <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, lineHeight: 1.1 }}>
          {title} <span style={{ color: 'var(--green)' }}>{accent}</span>
        </h2>
      </div>
      <Link
        href={href}
        prefetch
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.75rem',
          color: 'var(--green)',
          textDecoration: 'none',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
        }}
      >
        View All →
      </Link>
    </div>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div
      style={{
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '3rem',
        background: 'var(--bg3)',
        border: '1px solid var(--border)',
        borderRadius: 12,
        fontFamily: 'var(--mono)',
        color: 'var(--text3)',
      }}
    >
      {label}
    </div>
  );
}
