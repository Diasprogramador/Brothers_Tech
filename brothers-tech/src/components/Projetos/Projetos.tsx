import { useState } from "react";
import "./Projetos.css";

interface Project {
  id: string;
  title: string;
  subtitle: string;
  thumb: string;
  description: string;
  stack: string[];
  year: string;
  status: "production" | "development" | "concept";
}

const PROJECTS: Project[] = [
  {
    id: "biblioteca-monsa",
    title: "Biblioteca Monsa",
    subtitle: "site · sistema",
    thumb: "assets/projeto_biblioteca-monsa.png",
    description:
      "Sistema de catalogação e empréstimo para biblioteca escolar — focado em simplicidade para o bibliotecário e descoberta para os alunos.",
    stack: ["React", "Java Spring Boot", "PostgreSQL"],
    year: "2025",
    status: "production",
  },
  {
    id: "cri-arte",
    title: "Cri-Arte",
    subtitle: "site · galeria",
    thumb: "assets/projeto_cri-arte.png",
    description:
      "Plataforma para expor e vender obras de arte — galeria imersiva com curadoria e checkout integrado.",
    stack: ["React", "FireBase", "Sanity CMS"],
    year: "2025",
    status: "development",
  },
  {
    id: "caio-portifolio",
    title: "Caio Portfólio",
    subtitle: "site · portfólio",
    thumb: "assets/projeto_caio-portifolio.png",
    description:
      "Portfólio pessoal com animações sutis, transições suaves e foco total nos projetos — sem distrações.",
    stack: ["Astro", "GSAP", "Tailwind"],
    year: "2026",
    status: "production",
  },
];

export const Projetos = () => {
  // Mobile: card ativo via tap. Desktop: hover (CSS). Aqui controlamos o estado para clique/tap.
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleToggle = (id: string) => {
    setActiveId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="projetos">
      <div className="wrap">
        <div className="section-head reveal-right">
          <div className="section-eyebrow">
            <span className="n">02</span> — trabalhos
          </div>
          <h2>Projetos recentes</h2>
          <p>
            A Brothers Tech acabou de nascer — esses são os primeiros projetos
            que estamos entregando.
          </p>
        </div>

        <div className="projects-grid reveal">
          {PROJECTS.map((project) => (
            <article
              key={project.id}
              className={`project-card ${
                activeId === project.id ? "is-active" : ""
              }`}
              onClick={() => handleToggle(project.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleToggle(project.id);
                }
              }}
              tabIndex={0}
              role="button"
              aria-expanded={activeId === project.id}
              aria-label={`Ver detalhes do projeto ${project.title}`}
            >
              <div className="project-thumb">
                <img
                  src={project.thumb}
                  alt={`Preview do projeto ${project.title}`}
                  loading="lazy"
                  decoding="async"
                />
                <span className="project-status">{project.subtitle}</span>
              </div>

              <div className="project-body">
                <div className="project-body__head">
                  <h4>{project.title}</h4>
                  <span className="project-year mono">{project.year}</span>
                </div>
                <p className="project-tagline mono">{project.subtitle}</p>

                {/* Detalhes extras — aparecem no hover/active */}
                <div className="project-details">
                  <p className="project-description">{project.description}</p>
                  <ul className="project-stack" aria-label="Stack técnica">
                    {project.stack.map((tech) => (
                      <li key={tech} className="project-stack__item">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="projects-note reveal">
          <span className="dot"></span>
          <span className="mono">
            Quer ser o próximo case da Brothers Tech? Fale com a gente na seção
            de contato.
          </span>
        </div>
      </div>
    </section>
  );
};
