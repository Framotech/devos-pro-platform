'use client';

import { useEffect, useMemo, useState } from 'react';

type Template = 'minimal' | 'corporate' | 'saas' | 'creative' | 'ats';

type CVState = {
  template: Template;
  bio: string;
  experience: string;
  education: string;
  skills: string;
  projects: string;
  certifications: string;
  achievements: string;
};

const templates: { id: Template; label: string; tone: string }[] = [
  {
    id: 'minimal',
    label: 'Minimal Executive',
    tone: 'Crisp leadership summary with clear commercial impact.',
  },
  {
    id: 'corporate',
    label: 'Corporate Professional',
    tone: 'Structured, formal, and recruiter familiar.',
  },
  {
    id: 'saas',
    label: 'Modern SaaS Developer',
    tone: 'Product-minded engineering profile with metrics.',
  },
  {
    id: 'creative',
    label: 'Creative Designer CV',
    tone: 'Visual, expressive, and portfolio oriented.',
  },
  { id: 'ats', label: 'ATS-friendly Format', tone: 'Plain, keyword-rich, and parsing safe.' },
];

const defaultCV: CVState = {
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

const storageKey = 'devos-cv-builder-draft';

function splitLines(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildSummary(cv: CVState) {
  const intro = cv.bio.trim() || defaultCV.bio;
  if (cv.template === 'ats') return intro;
  if (cv.template === 'creative')
    return `${intro} Known for turning complex systems into clear, visually polished product experiences.`;
  if (cv.template === 'corporate')
    return `${intro} Brings disciplined execution, stakeholder awareness, and measurable delivery across technical programs.`;
  if (cv.template === 'minimal')
    return `${intro} Focused on high-signal outcomes, operational clarity, and durable systems.`;
  return `${intro} Combines product judgment, reliable infrastructure, and modern SaaS interface craft.`;
}

export default function CVBuilderClient() {
  const [cv, setCv] = useState<CVState>(defaultCV);
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    const saved = window.localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      window.setTimeout(() => setCv({ ...defaultCV, ...JSON.parse(saved) }), 0);
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, JSON.stringify(cv));
      setSavedAt(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 350);
    return () => window.clearTimeout(id);
  }, [cv]);

  const generated = useMemo(
    () => ({
      summary: buildSummary(cv),
      experience: splitLines(cv.experience),
      education: splitLines(cv.education),
      skills: splitLines(cv.skills),
      projects: splitLines(cv.projects),
      certifications: splitLines(cv.certifications),
      achievements: splitLines(cv.achievements),
    }),
    [cv],
  );

  const update = (key: keyof CVState, value: string) =>
    setCv((prev) => ({ ...prev, [key]: value }));
  const copyShareLink = async () => {
    const encoded = window.btoa(encodeURIComponent(JSON.stringify(cv)));
    await navigator.clipboard?.writeText(`${window.location.origin}/cv?data=${encoded}`);
  };

  return (
    <div className="admin-page-pad cv-builder">
      <div className="cv-toolbar no-print">
        <div>
          <span>Draft autosave</span>
          <strong>{savedAt ? `Saved ${savedAt}` : 'Ready'}</strong>
        </div>
        <div>
          <button type="button" onClick={() => window.print()}>
            Export PDF
          </button>
          <button type="button" onClick={copyShareLink}>
            Copy Share Link
          </button>
        </div>
      </div>

      <div className="cv-builder-grid">
        <section className="cv-panel no-print">
          <div className="cv-panel__head">
            <span>Template System</span>
            <h2>CV inputs</h2>
          </div>

          <div className="cv-template-grid">
            {templates.map((template) => (
              <button
                key={template.id}
                type="button"
                className={cv.template === template.id ? 'active' : ''}
                onClick={() => setCv((prev) => ({ ...prev, template: template.id }))}
              >
                <strong>{template.label}</strong>
                <span>{template.tone}</span>
              </button>
            ))}
          </div>

          <Field label="Bio" value={cv.bio} onChange={(value) => update('bio', value)} rows={4} />
          <Field
            label="Experience"
            value={cv.experience}
            onChange={(value) => update('experience', value)}
            rows={4}
          />
          <Field
            label="Education"
            value={cv.education}
            onChange={(value) => update('education', value)}
            rows={3}
          />
          <Field
            label="Skills"
            value={cv.skills}
            onChange={(value) => update('skills', value)}
            rows={3}
          />
          <Field
            label="Projects"
            value={cv.projects}
            onChange={(value) => update('projects', value)}
            rows={3}
          />
          <Field
            label="Certifications"
            value={cv.certifications}
            onChange={(value) => update('certifications', value)}
            rows={3}
          />
          <Field
            label="Achievements"
            value={cv.achievements}
            onChange={(value) => update('achievements', value)}
            rows={3}
          />
        </section>

        <section className={`cv-preview cv-preview--${cv.template}`}>
          <div className="cv-preview__mast">
            <div>
              <span>{templates.find((t) => t.id === cv.template)?.label}</span>
              <h2>Francis Amoako</h2>
              <p>Software Engineer · DevOps · SaaS Systems Builder</p>
            </div>
            <small>Shareable CV</small>
          </div>

          <CVBlock title="Professional Summary">
            <p>{generated.summary}</p>
          </CVBlock>
          <CVList title="Core Skills" items={generated.skills} compact />
          <CVList title="Experience" items={generated.experience} />
          <CVList title="Projects" items={generated.projects} />
          <CVList title="Education" items={generated.education} />
          <CVList title="Certifications" items={generated.certifications} />
          <CVList title="Achievements" items={generated.achievements} />
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  rows,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows: number;
}) {
  return (
    <label className="cv-field">
      {label}
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows} />
    </label>
  );
}

function CVBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="cv-block">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function CVList({
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
    <CVBlock title={title}>
      <ul className={compact ? 'compact' : ''}>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </CVBlock>
  );
}
