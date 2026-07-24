import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export type RevealAnimation = 'fadeUp' | 'fadeIn' | 'scale' | 'fadeLeft' | 'fadeRight';

interface UseRevealOptions {
  animation?: RevealAnimation;
  delay?: number;
  duration?: number;
  /** Stagger children with [data-reveal-child] instead of animating the element itself */
  stagger?: number;
  /** Element visibility triggerStart. Defaults to "top 85%" */
  start?: string;
}

const fromStates: Record<RevealAnimation, gsap.TweenVars> = {
  fadeUp: { y: 40, opacity: 0 },
  fadeIn: { opacity: 0 },
  scale: { scale: 0.94, opacity: 0 },
  fadeLeft: { x: -50, opacity: 0 },
  fadeRight: { x: 50, opacity: 0 },
};

/**
 * Hook reutilizável para scroll reveal com GSAP ScrollTrigger.
 * Respeita prefers-reduced-motion (não anima nesse caso).
 *
 * Uso:
 *   const ref = useReveal({ animation: 'fadeUp', delay: 0.1 });
 *   <section ref={ref}>...</section>
 *
 * Ou para stagger de filhos:
 *   const ref = useReveal({ stagger: 0.15 });
 *   <section ref={ref}>
 *     <div data-reveal-child>card 1</div>
 *     <div data-reveal-child>card 2</div>
 *   </section>
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

    const { animation = 'fadeUp', delay = 0, duration = 0.8, stagger = 0, start = 'top 85%' } = options;
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
          duration,
          delay,
          ease: 'power3.out',
          stagger: stagger || undefined,
          scrollTrigger: {
            trigger: el,
            start,
            once: true,
          },
        }
      );
    }, el);

    return () => ctx.revert();
  }, [options.animation, options.delay, options.duration, options.stagger, options.start]);

  return ref;
}
