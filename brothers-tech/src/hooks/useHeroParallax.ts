import { useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Parallax sutil nos avatares do hero: reage ao mouse com translate
 * proporcional ao depth (avatar 2 reage mais).
 * Só em pointer:fine + desktop (≥860px) e sem reduced motion.
 */
export function useHeroParallax(): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    const finePointer =
      window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 860;
    if (!finePointer || reduced) return;

    const hero = document.querySelector<HTMLElement>('.hero');
    const avatars = document.querySelectorAll<HTMLElement>('.hero-avatars .avatar-img');
    if (!hero || avatars.length === 0) return;

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      avatars.forEach((img, i) => {
        const depth = (i + 1) * 6;
        img.style.setProperty('--px', `${x * depth}px`);
        img.style.setProperty('--py', `${y * depth}px`);
      });
    };

    hero.addEventListener('mousemove', onMove);
    return () => hero.removeEventListener('mousemove', onMove);
  }, [reduced]);
}
