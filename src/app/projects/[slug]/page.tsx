import { notFound } from 'next/navigation';
import PublicLayout from '@/components/shared/PublicLayout';
import connectDB from '@/lib/db';
import Project from '@/models/Project';

interface ProjectView {
  name: string;
  slug: string;
  image: string;
  description: string;
  caseStudy: string;
  githubLink: string;
  liveLink: string;
  techStack: string[];
  status: string;
  port: string;
}

async function getProject(slug: string): Promise<ProjectView | null> {
  await connectDB();
  const query = slug.match(/^[a-f\d]{24}$/i)
    ? { _id: slug, published: true }
    : { slug, published: true };
  const project = await Project.findOne(query).lean();
  return project ? JSON.parse(JSON.stringify(project)) : null;
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);

  if (!project) notFound();

  return (
    <PublicLayout>
      <section
        className="section-pad"
        style={{ padding: '4rem 2.5rem 6rem', maxWidth: 1120, margin: '0 auto' }}
      >
        <div className="project-detail-hero">
          {project.image && <img src={project.image} alt={project.name} loading="eager" />}
          <div />
          <article>
            <span>
              {project.status || 'running'} · {project.port || '80:80'}
            </span>
            <h1>{project.name}</h1>
            <p>{project.description}</p>
            <nav>
              {project.liveLink && (
                <a href={project.liveLink} target="_blank" rel="noreferrer">
                  Open Live →
                </a>
              )}
              {project.githubLink && (
                <a href={project.githubLink} target="_blank" rel="noreferrer">
                  GitHub →
                </a>
              )}
            </nav>
          </article>
        </div>

        <div className="detail-grid">
          <section>
            <h2>Case Study</h2>
            <p>{project.caseStudy || project.description}</p>
          </section>
          <aside>
            <h2>Stack</h2>
            <div>
              {project.techStack.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </PublicLayout>
  );
}
