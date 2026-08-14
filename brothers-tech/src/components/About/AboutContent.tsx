import { useCallback, useRef, useState } from "react";
import { useCenaFixada, suave, trava01, trecho } from "../../hooks/useCenaFixada";
import "./About.css";

interface Fundador {
  papel: string;
  nome: string;
  desc: string;
  cor: string;
  avatares: { lego: string; normal: string; pixel: string };
}

const FUNDADORES: Fundador[] = [
  {
    papel: "Co-fundador & Engenheiro",
    nome: "Sanderson",
    desc: "O cérebro por trás da arquitetura. Transforma problemas complexos em sistemas escaláveis e performáticos — backend e infraestrutura.",
    cor: "var(--blue-soft)",
    avatares: {
      lego: "/assets/sanderson_avatar_lego.avif",
      normal: "/assets/sanderson_avatar.avif",
      pixel: "/assets/sanderson_avatar_pixel.avif",
    },
  },
  {
    papel: "Co-fundador & Designer",
    nome: "Caio",
    desc: "A alma da interface. Une estética e funcionalidade para criar experiências que não apenas funcionam, mas encantam — UI/UX e animações.",
    cor: "var(--orange)",
    avatares: {
      lego: "/assets/caio_avatar_lego.avif",
      normal: "/assets/caio_avatar.avif",
      pixel: "/assets/caio_avatar_pixel.avif",
    },
  },
];

const ESTILOS = ["lego", "normal", "pixel"] as const;

/**
 * SOBRE fixado: a tela trava e o avatar percorre lego → normal → pixel com a
 * rolagem; passada a metade da cena, troca para o segundo fundador. O toque no
 * avatar adianta um estilo (o ciclo dá a volta) — é a parte que antes só
 * existia no desktop.
 */
export const AboutContent = () => {
  const cenaRef = useRef<HTMLElement>(null);
  const palavraRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const barraRef = useRef<HTMLSpanElement>(null);
  const blocosRef = useRef<Array<HTMLElement | null>>([]);
  const desvios = useRef([0, 0]);
  const desviosSuaves = useRef([0, 0]);
  const [, forcar] = useState(0);

  const pintarFundador = (bloco: HTMLElement, fase: number, ciclico: boolean) => {
    const ph = ciclico ? ((fase % 3) + 3) % 3 : Math.min(2, Math.max(0, fase));
    bloco.querySelectorAll<HTMLElement>("[data-estilo]").forEach((img, idx) => {
      let d = Math.abs(ph - idx);
      if (ciclico && d > 1.5) d = 3 - d;
      const o = trava01(1 - d);
      img.style.opacity = String(o);
      img.style.filter = `drop-shadow(0 20px 40px rgba(0,0,0,0.5)) blur(${(1 - o) * 7}px)`;
      img.style.transform = `scale(${0.93 + 0.07 * o})`;
    });
    bloco.querySelectorAll<HTMLElement>("[data-chip]").forEach((chip, idx) => {
      let d = Math.abs(ph - idx);
      if (ciclico && d > 1.5) d = 3 - d;
      chip.dataset.ativo = String(d < 0.5);
    });
  };

  const aplicar = useCallback((p: number) => {
    if (palavraRef.current) {
      palavraRef.current.style.transform = `translateX(calc(-50% + ${p * 26 - 13}vw))`;
    }
    if (barraRef.current) barraRef.current.style.transform = `scaleX(${p})`;
    if (tituloRef.current) {
      const esconde = suave(trecho(p, 0.06, 0.3));
      tituloRef.current.style.opacity = String(1 - esconde);
      tituloRef.current.style.transform = `translateY(${-26 * esconde}px)`;
    }

    const total = p * 2;
    blocosRef.current.forEach((bloco, fi) => {
      if (!bloco) return;
      const troca = suave(trava01((total - 0.92) / 0.16));
      const visivel = fi === 0 ? 1 - troca : troca;
      bloco.style.opacity = String(visivel);
      bloco.style.pointerEvents = visivel > 0.5 ? "auto" : "none";
      bloco.style.transform = `translateY(${26 * (1 - visivel) * (fi === 0 ? -1 : 1)}px)`;

      const alvo = desvios.current[fi];
      desviosSuaves.current[fi] += (alvo - desviosSuaves.current[fi]) * 0.14;
      const desvio = desviosSuaves.current[fi];
      pintarFundador(bloco, trava01(total - fi) * 2 + desvio, desvio > 0.005);
    });
  }, []);

  useCenaFixada(cenaRef, aplicar);

  const tocar = (fi: number) => {
    desvios.current[fi] += 1;
    forcar((n) => n + 1); // garante um quadro mesmo com a cena parada
  };

  return (
    <section className="cena cena--sobre about" id="sobre" ref={cenaRef}>
      <div className="cena__palco about-palco">
        <div className="about-palavra" ref={palavraRef} aria-hidden="true">
          BROTHERS TECH
        </div>

        <div className="about-cabeca">
          <div className="section-eyebrow">
            <span className="n">03</span> — quem somos
          </div>
          <h2 ref={tituloRef}>Duas cabeças, um só padrão de entrega.</h2>
        </div>

        {FUNDADORES.map((f, fi) => (
          <div
            key={f.nome}
            className="fundador-cena"
            style={{ "--founder-color": f.cor } as React.CSSProperties}
            ref={(el) => {
              blocosRef.current[fi] = el;
            }}
          >
            <div
              className="fundador-cena__visual"
              role="button"
              tabIndex={0}
              aria-label={`Trocar o estilo do avatar de ${f.nome}`}
              onClick={() => tocar(fi)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  tocar(fi);
                }
              }}
            >
              <span className="fundador-cena__brilho" aria-hidden="true" />
              {ESTILOS.map((estilo) => (
                <img
                  key={estilo}
                  data-estilo={estilo}
                  src={f.avatares[estilo]}
                  alt={estilo === "normal" ? f.nome : ""}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>

            <div className="fundador-cena__lado">
              <div className="fundador-cena__chips" aria-hidden="true">
                {ESTILOS.map((estilo) => (
                  <span key={estilo} data-chip className="mono">
                    {estilo}
                  </span>
                ))}
              </div>

              <div className="fundador-cena__info">
                <span className="founder-eyebrow" style={{ color: f.cor }}>
                  {f.papel}
                </span>
                <h3>{f.nome}</h3>
                <p>{f.desc}</p>
              </div>
            </div>
          </div>
        ))}

        <div className="about-barra">
          <span className="mono">toque para trocar</span>
          <span className="about-barra__trilho">
            <span className="about-barra__preenche" ref={barraRef} />
          </span>
        </div>
      </div>
    </section>
  );
};
