import { useEffect } from 'react';

/**
 * Adiciona a classe `in` em elementos com `.reveal*`
 * quando eles entram na viewport. Usa IntersectionObserver.
 * Respeita `data-delay` (em ms) para stagger opcional.
 */
export function useRevealObserver(): void {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale',
    );
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const delay = Number(entry.target.dataset.delay) || 0;
          window.setTimeout(
            () => entry.target.classList.add('in'),
            delay,
          );
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' },
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}
