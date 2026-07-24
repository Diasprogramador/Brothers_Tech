import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface UseParallaxOptions {
  /** Quão longe o elemento viaja. Negativo = sobe, positivo = desce. px. Default -120. */
  amount?: number;
  /** Quadrante do movimento: 'y' (vertical), 'x' (horizontal), 'rotate' (spin). */
  axis?: 'y' | 'x' | 'rotate';
  /** start do ScrollTrigger. Default "top bottom". */
  start?: string;
  /** end do ScrollTrigger. Default "bottom top". */
  end?: string;
}

/**
 * Parallax REAL (scrub sincronizado com o scroll).
 * O elemento se move na velocidade do scroll, criando profundidade.
 * Respeita prefers-reduced-motion.
 *
 * Uso:
 *   const ref = useParallax({ amount: -150 });
 *   <img ref={ref} src="..." />
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: UseParallaxOptions = {}
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const { amount = -120, axis = 'y', start = 'top bottom', end = 'bottom top' } = options;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { [axis]: amount * -0.5 },
        {
          [axis]: amount * 0.5,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start,
            end,
            scrub: 1,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [options.amount, options.axis, options.start, options.end]);

  return ref;
}
