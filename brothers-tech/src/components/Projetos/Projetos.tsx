import { useCallback, useRef } from "react";
import { useCenaFixada, suave, trava01 } from "../../hooks/useCenaFixada";
import "./Projetos.css";

interface Projeto {
  id: string;
  titulo: string;
  legenda: string;
  thumb: string;
  descricao: string;
  stack: string[];
  ano: string;
}

const PROJETOS: Projeto[] = [
  {
    id: "biblioteca-monsa",
    titulo: "Biblioteca Monsa",
    legenda: "site · sistema",
    thumb: "assets/projeto_biblioteca-monsa.avif",
    descricao:
      "Sistema de catalogação e empréstimo para biblioteca escolar — simples para o bibliotecário, fácil de descobrir para os alunos.",
    stack: ["React", "Java Spring Boot", "PostgreSQL"],
    ano: "2025",
  },
  {
    id: "cri-arte",
    titulo: "Cri-Arte",
    legenda: "site · galeria",
    thumb: "assets/projeto_cri-arte.avif",
    descricao:
      "Plataforma para expor e vender obras de arte — galeria imersiva com curadoria e checkout integrado.",
    stack: ["React", "FireBase", "Sanity CMS"],
    ano: "2025",
  },
  {
    id: "caio-portifolio",
    titulo: "Caio Portfólio",
    legenda: "site · portfólio",
    thumb: "assets/projeto_caio-portifolio.avif",
    descricao:
      "Portfólio pessoal com animações sutis, transições suaves e foco total nos projetos — sem distrações.",
    stack: ["Astro", "GSAP", "Tailwind"],
    ano: "2026",
  },
];

/** PROJETOS fixado: cada case sobe em tela cheia por dentro de um recorte. */
export const Projetos = () => {
  const cenaRef = useRef<HTMLElement>(null);
  const cabecaRef = useRef<HTMLDivElement>(null);
  const contadorRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLElement | null>>([]);

  const aplicar = useCallback((p: number) => {
    const n = PROJETOS.length;
    const pos = p * (n + 0.15);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const rev = suave(trava01((pos - i + 0.9) / 0.9));
      card.style.clipPath = `inset(${100 - 100 * rev}% 0 0 0)`;
      card.style.zIndex = String(i + 1);
      const img = card.querySelector<HTMLImageElement>(".projeto-cena__img");
      if (img) img.style.transform = `scale(${1.22 - 0.22 * rev}) translateY(${30 * (1 - rev)}px)`;
      const meta = card.querySelector<HTMLElement>(".projeto-cena__meta");
      if (meta) {
        const m = suave(trava01((rev - 0.55) / 0.45));
        meta.style.opacity = String(m);
        meta.style.transform = `translateY(${40 * (1 - m)}px)`;
      }
    });

    const ativo = Math.min(n, Math.max(1, Math.ceil(pos + 0.1)));
    const rotulo = `0${ativo} / 0${n}`;
    if (contadorRef.current && contadorRef.current.textContent !== rotulo) {
      contadorRef.current.textContent = rotulo;
    }
    if (cabecaRef.current) {
      const esconde = suave(trava01(pos / 0.55));
      cabecaRef.current.style.opacity = String(1 - esconde);
      cabecaRef.current.style.transform = `translateY(${-40 * esconde}px)`;
    }
  }, []);

  useCenaFixada(cenaRef, aplicar);

  return (
    <section className="cena cena--projetos projetos" id="projetos" ref={cenaRef}>
      <div className="cena__palco projetos-palco">
        <div className="projetos-cabeca" ref={cabecaRef}>
          <div className="section-eyebrow">
            <span className="n">02</span> — trabalhos
          </div>
          <h2>Projetos recentes</h2>
        </div>

        {PROJETOS.map((proj, i) => (
          <article
            key={proj.id}
            className="projeto-cena"
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
          >
            <img
              className="projeto-cena__img"
              src={proj.thumb}
              alt={`Preview do projeto ${proj.titulo}`}
              loading="lazy"
              decoding="async"
            />
            <div className="projeto-cena__veu" aria-hidden="true" />
            <div className="projeto-cena__meta">
              <span className="projeto-cena__ano mono">
                {proj.ano} · {proj.legenda}
              </span>
              <h3>{proj.titulo}</h3>
              <p>{proj.descricao}</p>
              <ul className="projeto-cena__stack" aria-label="Stack técnica">
                {proj.stack.map((tech) => (
                  <li key={tech} className="mono">
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}

        <div className="projetos-contador mono" ref={contadorRef} aria-hidden="true">
          01 / 03
        </div>
      </div>
    </section>
  );
};
