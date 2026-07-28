import { useEffect } from 'react';

/**
 * Adiciona/remove a classe `scrolled` no elemento header
 * quando o usuário rola mais que `threshold` pixels.
 */
export function useHeaderScroll(threshold = 8): void {
  useEffect(() => {
    const header = document.getElementById('site-header');
    if (!header) return;

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        header.classList.toggle('scrolled', window.scrollY > threshold);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);
}
