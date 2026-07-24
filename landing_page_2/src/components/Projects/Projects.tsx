import './Projects.css';
import { useReveal } from '../../hooks/useReveal';
import { useParallax } from '../../hooks/useParallax';
import { useTilt } from '../../hooks/useTilt';

const PROJECTS = [
  {
    title: 'Projeto 01',
    desc: 'Sistema de gestão empresarial fullstack com dashboard em tempo real.',
    tech: ['React', 'Node.js', 'PostgreSQL'],
    year: '2025',
    big: '01',
  },
  {
    title: 'Projeto 02',
    desc: 'App mobile de entregas com tracking e pagamentos integrados.',
    tech: ['React Native', 'Stripe', 'Firebase'],
    year: '2025',
    big: '02',
  },
  {
    title: 'Projeto 03',
    desc: 'Landing page institucional animada com Insights e SEO.',
    tech: ['Vite', 'GSAP', 'TypeScript'],
    year: '2024',
    big: '03',
  },
];

export const Projects = () => {
  const titleRef = useReveal<HTMLDivElement>({ animation: 'rotateIn' });

  return (
    <section id="projetos" className="projects">
      <div className="projects-container">
        <div ref={titleRef} className="projects-head">
          <span className="section-eyebrow">Portfólio</span>
          <h2 className="projects-title">Projetos Recentes</h2>
        </div>
        <div className="projects-list">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} index={i} {...p} />
          ))}
        </div>
      </div>
    </section>
  );
};

function ProjectCard({
  index,
  title,
  desc,
  tech,
  year,
  big,
}: {
  index: number;
  title: string;
  desc: string;
  tech: string[];
  year: string;
  big: string;
}) {
  const revealRef = useReveal<HTMLDivElement>({
    animation: index % 2 === 0 ? 'fadeLeft' : 'fadeRight',
    duration: 1.4,
    amount: 120,
  });
  const tiltRef = useTilt<HTMLDivElement>({ max: 10, perspective: 1100, scale: 1.03 });
  // Parallax REAL no número grande — viaja no scroll, sente a profundidade
  const bigRef = useParallax<HTMLSpanElement>({ amount: -180, axis: 'y' });

  return (
    <div className="project-card" ref={tiltRef}>
      <div ref={revealRef} className="project-card-inner">
        <div className="project-image" aria-hidden="true">
          <span className="project-num" ref={bigRef}>{big}</span>
        </div>
        <div className="project-info">
          <div className="project-meta">
            <h3 className="project-name">{title}</h3>
            <span className="project-year">{year}</span>
          </div>
          <p className="project-desc">{desc}</p>
          <ul className="project-tech">
            {tech.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <a className="project-link" href="#">
            Ver projeto
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </div>
  );
}
