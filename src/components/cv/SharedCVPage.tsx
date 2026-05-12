'use client';

import { useEffect, useState } from 'react';

type CVState = {
  template?: string;
  bio?: string;
  experience?: string;
  education?: string;
  skills?: string;
  projects?: string;
  certifications?: string;
  achievements?: string;
};

const fallback: CVState = {
  template: 'saas',
  bio: 'Software Engineer and DevOps builder focused on production-grade systems, automation, and cloud-ready product experiences.',
  experience:
    'Full-stack platform development, containerized deployment pipelines, MongoDB-backed CMS systems, and admin operating dashboards.',
  education:
    "Master's candidate in Business and Technology Management with supply chain systems context.",
  skills:
    'Next.js, React, TypeScript, Node.js, MongoDB, Docker, CI/CD, system architecture, UI/UX, cloud deployment',
  projects:
    'DevOS Pro Platform, Docker portfolio systems, awards management platform, SaaS content ecosystem',
  certifications: 'Software engineering, DevOps, product systems, business technology management',
  achievements:
    'Shipped production portfolio OS, built dynamic CMS workflows, connected design and engineering into scalable products',
};

function splitLines(value = '') {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export default function SharedCVPage() {
  const [cv, setCv] = useState<CVState>(fallback);

  useEffect(() => {
    const data = new URLSearchParams(window.location.search).get('data');
    if (!data) return;
    try {
      window.setTimeout(() => {
        setCv({ ...fallback, ...JSON.parse(decodeURIComponent(window.atob(data))) });
      }, 0);
    } catch {
      window.setTimeout(() => setCv(fallback), 0);
    }
  }, []);

  return (
    <section className="section-pad shared-cv-page">
      <article className={`cv-preview cv-preview--${cv.template || 'saas'}`}>
        <div className="cv-preview__mast">
          <div>
            <span>Generated CV</span>
            <h2>Francis Amoako</h2>
            <p>Software Engineer · DevOps · SaaS Systems Builder</p>
          </div>
          <small>Shareable CV</small>
        </div>
        <Block title="Professional Summary">
          <p>{cv.bio}</p>
        </Block>
        <List title="Core Skills" items={splitLines(cv.skills)} compact />
        <List title="Experience" items={splitLines(cv.experience)} />
        <List title="Projects" items={splitLines(cv.projects)} />
        <List title="Education" items={splitLines(cv.education)} />
        <List title="Certifications" items={splitLines(cv.certifications)} />
        <List title="Achievements" items={splitLines(cv.achievements)} />
      </article>
    </section>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="cv-block">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function List({
  title,
  items,
  compact = false,
}: {
  title: string;
  items: string[];
  compact?: boolean;
}) {
  if (!items.length) return null;
  return (
    <Block title={title}>
      <ul className={compact ? 'compact' : ''}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </Block>
  );
}
