import { useCallback, useRef } from "react";
import { useCenaFixada, suave, trecho, trava01 } from "../../hooks/useCenaFixada";
import "./Hero.css";

/**
 * HERO fixado: a tela fica parada e a rolagem conduz a animação.
 *  0.00–0.34  título dá zoom, desfoca e sai
 *  0.10–0.52  a dupla entra pelas duas bordas e endireita
 *  0.52–0.86  os dois se separam de leve
 *  0.58–0.95  assinatura e tags sobem por dentro de uma máscara
 *  0.93–1.00  a tela escurece e emenda na seção de Serviços
 */
export const Hero = () => {
  const cenaRef = useRef<HTMLElement>(null);
  const palavraRef = useRef<HTMLDivElement>(null);
  const gradeRef = useRef<HTMLDivElement>(null);
  const tituloRef = useRef<HTMLDivElement>(null);
  const dicaRef = useRef<HTMLDivElement>(null);
  const av1Ref = useRef<HTMLImageElement>(null);
  const av2Ref = useRef<HTMLImageElement>(null);
  const assinaturaRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const veuRef = useRef<HTMLDivElement>(null);

  const aplicar = useCallback((p: number) => {
    const sai = suave(trecho(p, 0.02, 0.34));
    if (tituloRef.current) {
      tituloRef.current.style.transform = `translateY(${-90 * sai}px) scale(${1 + 0.22 * sai})`;
      tituloRef.current.style.opacity = String(1 - sai);
      tituloRef.current.style.filter = `blur(${sai * 5}px)`;
    }
    if (gradeRef.current) {
      gradeRef.current.style.transform = `translateY(${-70 * p}px) scale(${1 + 0.16 * p})`;
      gradeRef.current.style.opacity = String(1 - 0.5 * p);
    }
    if (palavraRef.current) {
      palavraRef.current.style.transform = `translate(calc(-50% + ${p * 46 - 23}px), ${-34 * p}px)`;
    }

    const entra = suave(trecho(p, 0.1, 0.52));
    const separa = suave(trecho(p, 0.52, 0.86));
    const escala = 0.78 + 0.22 * entra + 0.05 * separa;
    if (av1Ref.current) {
      av1Ref.current.style.opacity = String(trava01(entra * 1.4));
      av1Ref.current.style.transform =
        `translate(${-190 * (1 - entra) - 22 * separa}px, ${70 * (1 - entra)}px) rotate(${-12 * (1 - entra)}deg) scale(${escala})`;
    }
    if (av2Ref.current) {
      av2Ref.current.style.opacity = String(trava01(entra * 1.4));
      av2Ref.current.style.transform =
        `translate(${190 * (1 - entra) + 22 * separa}px, ${70 * (1 - entra)}px) rotate(${12 * (1 - entra)}deg) scale(${escala})`;
    }

    const assina = suave(trecho(p, 0.58, 0.88));
    if (assinaturaRef.current) {
      assinaturaRef.current.style.clipPath = `inset(0 0 ${100 - 100 * assina}% 0)`;
      assinaturaRef.current.style.transform = `translateY(${24 * (1 - assina)}px)`;
    }
    const tags = suave(trecho(p, 0.66, 0.95));
    if (tagsRef.current) {
      tagsRef.current.style.clipPath = `inset(0 0 ${100 - 100 * tags}% 0)`;
      tagsRef.current.style.transform = `translateY(${24 * (1 - tags)}px)`;
    }
    if (dicaRef.current) dicaRef.current.style.opacity = String(1 - suave(trecho(p, 0, 0.12)));
    if (veuRef.current) veuRef.current.style.opacity = String(0.9 * suave(trecho(p, 0.93, 1)));
  }, []);

  useCenaFixada(cenaRef, aplicar);

  return (
    <section className="cena cena--hero hero" id="home" ref={cenaRef}>
      <div className="cena__palco hero-palco">
        <div className="hero-grade" ref={gradeRef} aria-hidden="true" />
        <div className="hero-brilho" aria-hidden="true" />
        {/* "BROTHERS TECH" no mesmo tom do fundo: textura, sem contraste */}
        <div className="hero-palavra" ref={palavraRef} aria-hidden="true">
          BROTHERS TECH
        </div>

        {/* título e dupla dividem a MESMA célula central: o título sai, a
            dupla entra no mesmo lugar — o miolo nunca fica vazio. */}
        <div className="hero-centro">
          <div className="hero-titulo" ref={tituloRef}>
            <h1>
              <img
                src="assets/hero-title.png"
                alt="Brothers Tech — Sistemas, Apps, Sites e Software sob medida"
                loading="eager"
                decoding="async"
              />
            </h1>
          </div>

          <div className="hero-dupla" aria-hidden="true">
            <img
              ref={av1Ref}
              className="hero-dupla__img hero-dupla__img--1"
              src="assets/sanderson_hero.avif"
              alt=""
              width="237"
              height="712"
              loading="eager"
              decoding="async"
            />
            <img
              ref={av2Ref}
              className="hero-dupla__img hero-dupla__img--2"
              src="assets/caio_hero.avif"
              alt=""
              width="373"
              height="676"
            loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className="hero-rodape">
          <div className="hero-assinatura" ref={assinaturaRef}>
            <div className="hero-assinatura__nome">Sanderson &amp; Caio</div>
            <div className="hero-assinatura__papel mono">
              co-fundadores · brothers-tech.dev
            </div>
          </div>
          <div className="hero-tags" ref={tagsRef}>
            <span className="tag"><span className="dot green" aria-hidden="true" />Sistemas</span>
            <span className="tag"><span className="dot orange" aria-hidden="true" />Apps</span>
            <span className="tag"><span className="dot blue" aria-hidden="true" />Sites</span>
            <span className="tag"><span className="dot green" aria-hidden="true" />Softwares</span>
          </div>
        </div>

        <div className="hero-dica" ref={dicaRef}>
          <span>role</span>
          <span className="hero-dica__linha" />
        </div>

        <div className="hero-veu" ref={veuRef} aria-hidden="true" />
      </div>
    </section>
  );
};
