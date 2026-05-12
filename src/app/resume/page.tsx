import Link from 'next/link';
import PublicLayout from '@/components/shared/PublicLayout';
import PrintButton from '@/components/shared/PrintButton';
import connectDB from '@/lib/db';
import Experience from '@/models/Experience';
import Project from '@/models/Project';
import SiteConfig from '@/models/SiteConfig';
import Skill from '@/models/Skill';

interface ResumeSkill {
  name: string;
  category: string;
}

interface ResumeExperience {
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  technologies: string[];
}

interface ResumeProject {
  name: string;
  description: string;
  techStack: string[];
}

interface ResumeConfig {
  name: string;
  title: string;
  bio: string;
  email: string;
  location: string;
  github: string;
  linkedin: string;
  website: string;
}

async function getResumeData() {
  await connectDB();

  const [config, skills, experience, projects] = await Promise.all([
    SiteConfig.findOne().lean(),
    Skill.find().sort({ order: 1 }).lean(),
    Experience.find().sort({ order: 1 }).lean(),
    Project.find({ published: true }).sort({ order: 1, createdAt: -1 }).limit(6).lean(),
  ]);

  return {
    config: JSON.parse(
      JSON.stringify(
        config || {
          name: 'Framo',
          title: 'Software Engineer & DevOps',
          bio: 'Software engineer building production-grade systems, creator tools, and scalable web platforms.',
          email: '',
          location: 'Accra, Ghana',
          github: 'https://github.com/Framotech',
          linkedin: '',
          website: '',
        },
      ),
    ) as ResumeConfig,
    skills: JSON.parse(JSON.stringify(skills)) as ResumeSkill[],
    experience: JSON.parse(JSON.stringify(experience)) as ResumeExperience[],
    projects: JSON.parse(JSON.stringify(projects)) as ResumeProject[],
  };
}

export default async function ResumePage() {
  const { config, skills, experience, projects } = await getResumeData();
  const groupedSkills = skills.reduce(
    (acc, skill) => {
      acc[skill.category] = [...(acc[skill.category] || []), skill];
      return acc;
    },
    {} as Record<string, ResumeSkill[]>,
  );

  return (
    <PublicLayout>
      <main className="resume-page" style={{ padding: '4rem 2.5rem 6rem', maxWidth: '980px', margin: '0 auto' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.5rem' }}>
          <Link href="/" style={secondaryButtonStyle}>
            Back Home
          </Link>
          <PrintButton />
        </div>

        <article className="resume-sheet" style={sheetStyle}>
          <header className="resume-header" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.5rem' }}>
            <div>
              <div style={{ fontFamily: 'var(--mono)', color: 'var(--green)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: '0.6rem' }}>
                Dynamic Resume
              </div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', lineHeight: 1, marginBottom: '0.6rem' }}>
                {config.name || 'Framo'}
              </h1>
              <p style={{ color: 'var(--text)', fontSize: '1.1rem', fontWeight: 700 }}>{config.title}</p>
              <p style={{ color: 'var(--text2)', lineHeight: 1.7, marginTop: '0.85rem', maxWidth: '680px' }}>
                {config.bio || 'Software engineer building production-grade systems and scalable creator platforms.'}
              </p>
            </div>
            <div style={{ minWidth: '220px', color: 'var(--text2)', fontSize: '0.88rem', lineHeight: 1.8 }}>
              {config.location && <div>{config.location}</div>}
              {config.email && <div>{config.email}</div>}
              {config.github && <div>{config.github}</div>}
              {config.linkedin && <div>{config.linkedin}</div>}
              {config.website && <div>{config.website}</div>}
            </div>
          </header>

          <ResumeSection title="Experience">
            {experience.length === 0 ? (
              <Empty>Experience entries from admin will render here.</Empty>
            ) : (
              experience.map(item => (
                <div key={`${item.company}-${item.role}`} style={entryStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem' }}>{item.role}</h3>
                      <div style={{ color: 'var(--text2)', marginTop: '0.2rem' }}>
                        {item.company} {item.location ? `· ${item.location}` : ''}
                      </div>
                    </div>
                    <div style={dateStyle}>
                      {item.startDate} - {item.endDate}
                    </div>
                  </div>
                  {item.highlights?.length > 0 && (
                    <ul style={{ marginTop: '0.75rem', paddingLeft: '1.1rem', color: 'var(--text2)', lineHeight: 1.7 }}>
                      {item.highlights.map(highlight => (
                        <li key={highlight}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                  {item.technologies?.length > 0 && <TagList tags={item.technologies} />}
                </div>
              ))
            )}
          </ResumeSection>

          <ResumeSection title="Selected Projects">
            {projects.length === 0 ? (
              <Empty>Published projects will render here.</Empty>
            ) : (
              <div className="resume-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                {projects.map(project => (
                  <div key={project.name} style={entryStyle}>
                    <h3 style={{ fontSize: '0.98rem' }}>{project.name}</h3>
                    <p style={{ color: 'var(--text2)', lineHeight: 1.65, marginTop: '0.45rem', fontSize: '0.9rem' }}>
                      {project.description}
                    </p>
                    {project.techStack?.length > 0 && <TagList tags={project.techStack} />}
                  </div>
                ))}
              </div>
            )}
          </ResumeSection>

          <ResumeSection title="Skills">
            {Object.keys(groupedSkills).length === 0 ? (
              <Empty>Skills from admin will render here.</Empty>
            ) : (
              <div className="resume-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '1rem' }}>
                {Object.entries(groupedSkills).map(([category, items]) => (
                  <div key={category} style={entryStyle}>
                    <h3 style={{ fontSize: '0.95rem', marginBottom: '0.65rem' }}>{category}</h3>
                    <TagList tags={items.map(skill => skill.name)} />
                  </div>
                ))}
              </div>
            )}
          </ResumeSection>
        </article>
      </main>
    </PublicLayout>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ paddingTop: '1.5rem' }}>
      <h2 style={{
        fontFamily: 'var(--mono)',
        fontSize: '0.78rem',
        color: 'var(--green)',
        textTransform: 'uppercase',
        letterSpacing: '0.14em',
        marginBottom: '1rem',
      }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.85rem' }}>
      {tags.map(tag => (
        <span key={tag} style={tagStyle}>
          {tag}
        </span>
      ))}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <p style={{ color: 'var(--text3)', fontFamily: 'var(--mono)', fontSize: '0.82rem' }}>{children}</p>;
}

const sheetStyle = {
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: '16px',
  padding: '2rem',
};

const entryStyle = {
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '1rem',
};

const dateStyle = {
  fontFamily: 'var(--mono)',
  color: 'var(--text3)',
  fontSize: '0.72rem',
  whiteSpace: 'nowrap' as const,
};

const tagStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '0.62rem',
  padding: '4px 8px',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  color: 'var(--text2)',
  textTransform: 'uppercase' as const,
};

const secondaryButtonStyle = {
  padding: '0.8rem 1rem',
  background: 'var(--bg2)',
  color: 'var(--text2)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  textDecoration: 'none',
  fontWeight: 700,
};
