'use client';

import { useEffect, useRef, useState } from 'react';

interface Skill {
  _id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  order: number;
}

interface Experience {
  _id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  highlights: string[];
  technologies: string[];
  current: boolean;
}

const fallbackSkills = [
  { _id: 'next', name: 'Next.js', category: 'Frontend', level: 5, icon: '', order: 1 },
  { _id: 'node', name: 'Node.js', category: 'Backend', level: 5, icon: '', order: 2 },
  { _id: 'docker', name: 'Docker', category: 'DevOps', level: 5, icon: '', order: 3 },
  { _id: 'mongo', name: 'MongoDB', category: 'Database', level: 4, icon: '', order: 4 },
];

export default function SkillsExperienceSection() {
  const [skills, setSkills] = useState<Skill[]>(fallbackSkills);
  const [experience, setExperience] = useState<Experience[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/skills').then(res => res.json()).catch(() => []),
      fetch('/api/experience').then(res => res.json()).catch(() => []),
    ]).then(([skillData, experienceData]) => {
      if (Array.isArray(skillData) && skillData.length > 0) setSkills(skillData);
      if (Array.isArray(experienceData)) setExperience(experienceData);
    });
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.scroll-fade').forEach((el, index) => {
              setTimeout(() => el.classList.add('visible'), index * 90);
            });
          }
        });
      },
      { threshold: 0.08 },
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [skills, experience]);

  const grouped = skills.reduce(
    (acc, skill) => {
      acc[skill.category] = [...(acc[skill.category] || []), skill];
      return acc;
    },
    {} as Record<string, Skill[]>,
  );

  return (
    <section
      ref={sectionRef}
      id="skills"
      style={{
        padding: '5rem 2.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(340px, 0.9fr)',
        gap: '1.5rem',
      }}
    >
      <div className="scroll-fade">
        <SectionLabel label="Dynamic Skills" />
        <h2 style={headingStyle}>
          Skills That Power the <span style={{ color: 'var(--green)' }}>System</span>
        </h2>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} style={panelStyle}>
              <div style={panelHeadingStyle}>{category}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.7rem' }}>
                {items.map(skill => (
                  <div key={skill._id} style={skillRowStyle}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                        {skill.icon ? `${skill.icon} ` : ''}
                        {skill.name}
                      </div>
                      <div style={{ display: 'flex', gap: '3px', marginTop: '0.45rem' }}>
                        {[1, 2, 3, 4, 5].map(level => (
                          <span
                            key={level}
                            style={{
                              width: '18px',
                              height: '4px',
                              borderRadius: '999px',
                              background: level <= skill.level ? 'var(--green)' : 'var(--bg)',
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="scroll-fade">
        <SectionLabel label="Experience" />
        <h2 style={headingStyle}>
          Career <span style={{ color: 'var(--green)' }}>Timeline</span>
        </h2>
        <div style={panelStyle}>
          {experience.length === 0 ? (
            <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>
              Experience entries added in the admin dashboard will render here automatically.
            </p>
          ) : (
            experience.map((item, index) => (
              <div key={item._id} style={{ display: 'grid', gridTemplateColumns: '24px 1fr', gap: '0.8rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={timelineDotStyle} />
                  {index < experience.length - 1 && <span style={timelineLineStyle} />}
                </div>
                <div style={{ paddingBottom: index < experience.length - 1 ? '1.25rem' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1rem', margin: 0 }}>{item.role}</h3>
                    {item.current && <span style={currentBadgeStyle}>Current</span>}
                  </div>
                  <div style={{ color: 'var(--text2)', marginTop: '0.25rem' }}>
                    {item.company} {item.location ? `· ${item.location}` : ''}
                  </div>
                  <div style={dateStyle}>
                    {item.startDate} - {item.endDate}
                  </div>
                  {item.highlights?.[0] && (
                    <p style={{ color: 'var(--text2)', lineHeight: 1.65, marginTop: '0.65rem', fontSize: '0.88rem' }}>
                      {item.highlights[0]}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div style={{
      fontFamily: 'var(--mono)',
      fontSize: '0.72rem',
      color: 'var(--green)',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
    }}>
      <span style={{ width: '24px', height: '1px', background: 'var(--green)', display: 'block' }} />
      {label}
    </div>
  );
}

const headingStyle = {
  fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
  lineHeight: 1.1,
  marginBottom: '1.5rem',
};

const panelStyle = {
  background: 'var(--bg2)',
  border: '1px solid var(--border)',
  borderRadius: '14px',
  padding: '1.25rem',
};

const panelHeadingStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '0.68rem',
  color: 'var(--text3)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.12em',
  marginBottom: '0.85rem',
};

const skillRowStyle = {
  background: 'var(--bg3)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  padding: '0.85rem',
};

const timelineDotStyle = {
  width: '10px',
  height: '10px',
  borderRadius: '50%',
  background: 'var(--green)',
  boxShadow: '0 0 10px var(--green-glow)',
  marginTop: '0.35rem',
};

const timelineLineStyle = {
  width: '1px',
  flex: 1,
  minHeight: '84px',
  background: 'var(--border)',
  marginTop: '0.35rem',
};

const currentBadgeStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '0.58rem',
  color: 'var(--green)',
  background: 'var(--green-dim)',
  border: '1px solid var(--border-green)',
  borderRadius: '4px',
  padding: '2px 7px',
  textTransform: 'uppercase' as const,
};

const dateStyle = {
  fontFamily: 'var(--mono)',
  fontSize: '0.66rem',
  color: 'var(--text3)',
  marginTop: '0.35rem',
};
