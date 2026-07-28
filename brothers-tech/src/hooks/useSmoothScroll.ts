import { useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Faz scroll suave em âncoras (#home, #servicos, ...).
 * Respeita prefers-reduced-motion.
 */
export function useSmoothScroll(closeMenu?: () => void): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      closeMenu?.();
      target.scrollIntoView({
        behavior: reduced ? 'auto' : 'smooth',
        block: 'start',
      });
      history.pushState(null, '', href);
    };

    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [reduced, closeMenu]);
}
