import './About.css';
import { lazy, Suspense, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReveal } from '../../hooks/useReveal';
import avatarCaio from '../../assets/founders/avatar-caio.png';
import avatarSanderson from '../../assets/founders/avatar-sanderson.png';

// Lazy-load: mantém three.js/R3F em chunk separado (code-split do Vite)
const AvatarStage = lazy(() =>
  import('./AvatarStage').then((m) => ({ default: m.AvatarStage }))
);

interface Founder {
  name: string;
  role: string;
  tag: string;
  alt: string;
}

const FOUNDERS: Founder[] = [
  {
    name: 'Caio',
    role: 'Front-end & 3D',
    tag: 'Design que performa',
    alt: 'Caio — cofundador da Brothers Tech',
  },
  {
    name: 'Sanderson',
    role: 'Back-end & Sistemas',
    tag: 'Arquitetura que escala',
    alt: 'Sanderson — cofundador da Brothers Tech',
  },
];

export const About = () => {
  const sectionRef = useReveal<HTMLDivElement>({ animation: 'slideUpBig' });
  const namesWrap = useRef<HTMLDivElement>(null);

  // Split reveal dos nomes (GSAP no DOM, fontes nítidas)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const wrap = namesWrap.current;
    if (!wrap) return;
    const letters = wrap.querySelectorAll<HTMLElement>('.about-name span');
    if (prefersReduced) {
      gsap.set(letters, { yPercent: 0, opacity: 1 });
      return;
    }
    gsap.set(letters, { yPercent: 110, opacity: 0 });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(letters, {
              yPercent: 0,
              opacity: 1,
              duration: 0.7,
              ease: 'power4.out',
              stagger: 0.04,
              delay: 0.3,
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    letters.forEach((l) => obs.observe(l));
    return () => obs.disconnect();
  }, []);

  return (
    <section id="sobre" className="about">
      {/* Camada 3D — palco com personagens, plataforma, partículas */}
      <div className="about-stage-layer" aria-hidden="true">
        <Suspense fallback={<div className="about-stage-loading" />}>
          <AvatarStage />
        </Suspense>
      </div>

      {/* Camada de fundo gradiente + holofote que segue o mouse */}
      <div className="about-bg" aria-hidden="true" />

      {/* Layer semântico por cima */}
      <div className="about-container" ref={sectionRef}>
        <span className="about-label">Sobre Nós</span>

        {/* Box invisível que alinha os balões sobre os avatares do palco 3D */}
        <div className="about-stage-frame">
          {/* Cartões de especialidade por cima dos personagens 3D */}
          {FOUNDERS.map((f, i) => (
            <div className={`about-bubble about-bubble--${i === 0 ? 'left' : 'right'}`} key={f.name}>
              <strong>{f.name}</strong>
              <span className="about-bubble-role">{f.role}</span>
              <span className="about-bubble-tag">{f.tag}</span>
            </div>
          ))}
        </div>

        {/* Nomes com split reveal (DOM, nítidos) */}
        <div className="about-names" ref={namesWrap}>
          {FOUNDERS.map((f) => (
            <span className="about-name" key={f.name} aria-label={f.name}>
              {f.name.split('').map((ch, idx) => (
                <span key={idx} aria-hidden="true">
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </div>

        <p className="about-text">
          Somos a <strong>Brothers Tech</strong> — dois irmãos unidos pela paixão
          de transformar ideias em produtos digitais. Da concepção ao deploy,
          cuidamos de cada detalhe para entregar sistemas, apps e sites que
          performam e encantam.
        </p>

        {/* Hidden — avatares mantêm sourcing Vite p/ preload/hash consistente */}
        <link rel="preload" as="image" href={avatarCaio} />
        <link rel="preload" as="image" href={avatarSanderson} />
      </div>
    </section>
  );
};
