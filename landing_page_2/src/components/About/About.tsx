import './About.css';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useReveal } from '../../hooks/useReveal';
import { useTilt } from '../../hooks/useTilt';
import { useParallax } from '../../hooks/useParallax';
import avatarCaio from '../../assets/founders/avatar-caio.png';
import avatarSanderson from '../../assets/founders/avatar-sanderson.png';

interface Founder {
  name: string;
  role: string;
  tag: string;
  avatar: string;
  alt: string;
}

const FOUNDERS: Founder[] = [
  {
    name: 'Caio',
    role: 'Front-end & 3D',
    tag: 'Design que performa',
    avatar: avatarCaio,
    alt: 'Caio — cofundador da Brothers Tech',
  },
  {
    name: 'Sanderson',
    role: 'Back-end & Sistemas',
    tag: 'Arquitetura que escala',
    avatar: avatarSanderson,
    alt: 'Sanderson — cofundador da Brothers Tech',
  },
];

export const About = () => {
  const sectionRef = useReveal<HTMLDivElement>({ animation: 'slideUpBig' });
  const cardTiltRef = useTilt<HTMLDivElement>({ max: 8, perspective: 1400, scale: 1.01 });

  // Parallax scroll em direções opostas — profundidade 3D óbvia ao rolar
  const leftRef = useParallax<HTMLImageElement>({ amount: -100, axis: 'y' });
  const rightRef = useParallax<HTMLImageElement>({ amount: -180, axis: 'y' });

  // Refs para animações próprias da seção (idle, spotlight, split de nomes)
  const arenaRef = useRef<HTMLDivElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const leftCharRef = useRef<HTMLImageElement>(null);
  const rightCharRef = useRef<HTMLImageElement>(null);

  // Refs de parallax precisam estar no <img>, então reaproveitamos encadeando:
  // O useParallax devolve um ref; setamos também o charRef no onLoad.
  const bindLeft = (el: HTMLImageElement | null) => {
    (leftRef as React.MutableRefObject<HTMLImageElement | null>).current = el;
    (leftCharRef as React.MutableRefObject<HTMLImageElement | null>).current = el;
  };
  const bindRight = (el: HTMLImageElement | null) => {
    (rightRef as React.MutableRefObject<HTMLImageElement | null>).current = el;
    (rightCharRef as React.MutableRefObject<HTMLImageElement | null>).current = el;
  };

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;
    const arena = arenaRef.current;
    if (!arena) return;

    // ---- Animação idle: os personagens "respiram/flutuam" continuamente ----
    const chars = [leftCharRef.current, rightCharRef.current].filter(Boolean) as HTMLImageElement[];
    const idle = gsap.timeline({ repeat: -1, yoyo: true });
    idle.to(chars, {
      y: -12,
      duration: 2.2,
      ease: 'sine.inOut',
      stagger: { each: 0.5, from: 'random' },
    });

    // ---- Spotlight segue o mouse dentro da arena ----
    const spot = spotRef.current;
    const onMove = (e: MouseEvent) => {
      const rect = arena.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      if (spot) {
        gsap.to(spot, {
          '--spot-x': `${x}%`,
          '--spot-y': `${y}%`,
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
        });
      }
    };
    const onLeave = () => {
      if (spot) gsap.to(spot, { opacity: 0, duration: 0.5 });
    };
    arena.addEventListener('mousemove', onMove);
    arena.addEventListener('mouseleave', onLeave);

    // ---- Partículas âmbar flutuando (DOM, leve) ----
    const particles = arena.querySelectorAll<HTMLElement>('.about-particle');
    const pAnims: gsap.core.Tween[] = [];
    particles.forEach((p, i) => {
      pAnims.push(
        gsap.to(p, {
          y: -(40 + Math.random() * 80),
          x: `+=${Math.random() * 30 - 15}`,
          opacity: 0,
          scale: 0.3,
          duration: 4 + Math.random() * 4,
          delay: i * 0.4,
          repeat: -1,
          ease: 'sine.out',
        })
      );
    });

    // ---- Split de nomes: cada letra sobe na entrada (reveal manual) ----
    const names = arena.querySelectorAll<HTMLElement>('.about-name span');
    gsap.set(names, { yPercent: 110, opacity: 0 });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(names, {
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
    names.forEach((n) => obs.observe(n));
    return () => {
      idle.kill();
      pAnims.forEach((a) => a.kill());
      arena.removeEventListener('mousemove', onMove);
      arena.removeEventListener('mouseleave', onLeave);
      obs.disconnect();
    };
  }, []);

  return (
    <section id="sobre" className="about">
      <div className="about-grid-bg" aria-hidden="true" />
      <div className="about-container" ref={sectionRef}>
        <span className="about-label">Sobre Nós</span>

        <div className="about-arena" ref={arenaRef}>
          {/* Spotlight que segue o mouse */}
          <div className="about-spotlight" ref={spotRef} aria-hidden="true" />
          {/* Partículas âmbar */}
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="about-particle"
              style={{ left: `${(i * 7 + 8) % 100}%`, bottom: `${(i * 13) % 40}%` }}
              aria-hidden="true"
            />
          ))}

          <div className="about-card" ref={cardTiltRef}>
            <div className="about-avatars">
              {FOUNDERS.map((f, i) => (
                <div className={`about-character about-character--${i === 0 ? 'left' : 'right'}`} key={f.name}>
                  <div className="about-char-wrapper">
                    <img
                      src={f.avatar}
                      alt={f.alt}
                      className="about-avatar"
                      loading="lazy"
                      ref={i === 0 ? bindLeft : bindRight}
                    />
                    <span className="about-ring" aria-hidden="true" />
                  </div>
                  <div className="about-bubble">
                    <strong>{f.name}</strong>
                    <span className="about-bubble-role">{f.role}</span>
                    <span className="about-bubble-tag">{f.tag}</span>
                  </div>
                </div>
              ))}
            </div>

            <span className="about-platform" aria-hidden="true" />

            <div className="about-names">
              {FOUNDERS.map((f) => (
                <span className="about-name" key={f.name}>
                  {f.name.split('').map((ch, idx) => (
                    <span key={idx} style={{ display: 'inline-block' }}>{ch}</span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="about-text">
          Somos a <strong>Brothers Tech</strong> — dois irmãos unidos pela paixão
          de transformar ideias em produtos digitais. Da concepção ao deploy,
          cuidamos de cada detalhe para entregar sistemas, apps e sites que
          performam e encantam.
        </p>
      </div>
    </section>
  );
};
