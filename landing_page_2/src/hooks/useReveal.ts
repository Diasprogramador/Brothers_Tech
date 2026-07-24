import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type RevealAnimation =
  | 'fadeUp'
  | 'fadeIn'
  | 'scale'
  | 'fadeLeft'
  | 'fadeRight'
  | 'slideUpBig'
  | 'rotateIn'
  | 'clipReveal';

interface UseRevealOptions {
  animation?: RevealAnimation;
  delay?: number;
  duration?: number;
  /** Stagger de filhos marcados com [data-reveal-child] */
  stagger?: number;
  /** Distance/offset amplitude. Default depende da animação. */
  amount?: number;
  /** "top 85%" por padrão */
  start?: string;
  /** Reproduz a animação ao reverter (scrub-like). Default: once only. */
  scrub?: boolean;
}

// Estados iniciais DRAMATICOS (intencionalmente grandes p/ serem óbvios)
const fromStates: Record<RevealAnimation, gsap.TweenVars> = {
  fadeUp: { y: 60, opacity: 0 },
  fadeIn: { opacity: 0 },
  scale: { scale: 0.85, opacity: 0 },
  fadeLeft: { x: -90, opacity: 0 },
  fadeRight: { x: 90, opacity: 0 },
  // Animações novas — bem mais dramáticas
  slideUpBig: { y: 180, opacity: 0, scale: 0.95 },
  rotateIn: { y: 80, rotation: 8, opacity: 0, transformOrigin: 'left bottom' },
  clipReveal: { clipPath: 'inset(0 100% 0 0)', opacity: 0.6 },
};

/**
 * Scroll reveal com GSAP ScrollTrigger — ação ÓBVIA (não sutil).
 * Modos extras: slideUpBig, rotateIn, clipReveal. Scrub opcional.
 * Respeita prefers-reduced-motion.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const {
      animation = 'fadeUp',
      delay = 0,
      duration = 1.1,
      stagger = 0,
      start = 'top 82%',
      scrub = false,
    } = options;
    const from = fromStates[animation];

    const targets: Element[] = stagger
      ? Array.from(el.querySelectorAll('[data-reveal-child]'))
      : [el];
    if (targets.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        from,
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          rotation: 0,
          clipPath: 'inset(0 0% 0 0)',
          duration,
          delay,
          ease: 'power4.out',
          stagger: stagger || undefined,
          scrollTrigger: {
            trigger: el,
            start,
            toggleActions: 'play none none reverse',
            ...(scrub ? { scrub: 0.6 } : { once: true }),
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [options.animation, options.delay, options.duration, options.stagger, options.start, options.scrub]);

  return ref;
}
