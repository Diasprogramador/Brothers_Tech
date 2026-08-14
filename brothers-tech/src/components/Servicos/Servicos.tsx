import { useCallback, useRef } from "react";
import { useCenaFixada, suave, trava01 } from "../../hooks/useCenaFixada";
import "./Servicos.css";

const FRENTES = [
  {
    num: "01",
    titulo: "Sistemas",
    texto:
      "Plataformas sob medida para organizar processos internos, integrar áreas e tirar planilhas soltas da equação.",
    para: "→ gestão, automação, integração",
  },
  {
    num: "02",
    titulo: "Apps",
    texto:
      "Aplicativos mobile pensados do fluxo do usuário para trás — nada de tela bonita que ninguém sabe usar.",
    para: "→ iOS, Android, multiplataforma",
  },
  {
    num: "03",
    titulo: "Sites",
    texto:
      "Presença digital rápida, responsiva e fácil de manter — do institucional simples ao e-commerce completo.",
    para: "→ institucional, landing page, loja",
  },
  {
    num: "04",
    titulo: "Softwares",
    texto:
      "Ferramentas específicas para um problema específico do seu negócio, feitas sob encomenda.",
    para: "→ automação, ferramentas internas, APIs",
  },
];

/** SERVIÇOS fixado: baralho de 4 cards que avança com a rolagem. */
export const Servicos = () => {
  const cenaRef = useRef<HTMLElement>(null);
  const cabecaRef = useRef<HTMLDivElement>(null);
  const contadorRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<Array<HTMLElement | null>>([]);
  const tracosRef = useRef<Array<HTMLElement | null>>([]);

  const aplicar = useCallback((p: number) => {
    const n = FRENTES.length;
    const pos = p * n;

    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const rel = pos - i;
      const entra = suave(trava01((rel + 0.62) / 0.62));
      const sai = suave(trava01((rel - 0.72) / 0.3));
      const y = (1 - entra) * 120 - sai * 90;
      const escala = 0.88 + 0.12 * entra - 0.06 * sai;
      const giro = (1 - entra) * 5 - sai * 4;
      card.style.transform = `translateY(${y}px) scale(${escala}) rotate(${giro}deg)`;
      card.style.opacity = String(entra * (1 - sai));
      card.style.zIndex = String(10 + i);
      card.style.boxShadow = `0 ${18 * entra}px ${44 * entra}px rgba(0,0,0,0.34)`;
    });

    const ativo = Math.min(n - 1, Math.floor(pos + 0.15));
    if (contadorRef.current) {
      const rotulo = FRENTES[ativo].num;
      if (contadorRef.current.textContent !== rotulo) contadorRef.current.textContent = rotulo;
      contadorRef.current.style.transform = `translateY(${-14 * (pos - ativo)}px)`;
    }
    tracosRef.current.forEach((traco, i) => {
      if (!traco) return;
      const cheio = trava01(pos - i);
      traco.style.opacity = String(0.16 + 0.84 * cheio);
      traco.style.transform = `scaleY(${1 + 1.4 * cheio})`;
    });
    if (cabecaRef.current) cabecaRef.current.style.transform = `translateY(${-34 * p}px)`;
  }, []);

  useCenaFixada(cenaRef, aplicar);

  return (
    <section className="cena cena--servicos servicos" id="servicos" ref={cenaRef}>
      <div className="cena__palco servicos-palco">
        <div className="servicos-grade" aria-hidden="true" />

        <div className="servicos-cabeca" ref={cabecaRef}>
          <div className="section-eyebrow">
            <span className="n">01</span> — o que fazemos
          </div>
          <h2>Quatro frentes, um mesmo padrão de qualidade.</h2>
        </div>

        <div className="servicos-contador" ref={contadorRef} aria-hidden="true">
          01
        </div>

        <div className="servicos-baralho">
          {FRENTES.map((f, i) => (
            <article
              key={f.num}
              className="servico-card"
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
            >
              <div className="num mono">{f.num}</div>
              <h3>{f.titulo}</h3>
              <p>{f.texto}</p>
              <div className="for mono">{f.para}</div>
            </article>
          ))}
        </div>

        <div className="servicos-tracos" aria-hidden="true">
          {FRENTES.map((f, i) => (
            <span
              key={f.num}
              ref={(el) => {
                tracosRef.current[i] = el;
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
