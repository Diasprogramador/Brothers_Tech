import { useEffect } from 'react';
import { useReducedMotion } from './useReducedMotion';

/**
 * Custom cursor desktop (pointer:fine + ≥860px).
 * Cria dot e ring no body. Ring segue o mouse com lerp (requestAnimationFrame).
 * Cresce (`.grow`) sobre elementos interativos.
 */
export function useCustomCursor(): void {
  const reduced = useReducedMotion();

  useEffect(() => {
    const finePointer =
      window.matchMedia('(pointer: fine)').matches && window.innerWidth >= 860;
    if (!finePointer || reduced) return;

    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursorDot';
    ring.className = 'cursorRing';
    dot.setAttribute('aria-hidden', 'true');
    ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring);

    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let rafId = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    };

    const follow = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      rafId = window.requestAnimationFrame(follow);
    };

    const onEnter = () => {
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };
    const onLeave = () => {
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    window.addEventListener('mousemove', onMove);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseleave', onLeave);

    const interactives = document.querySelectorAll<HTMLElement>(
      'a, button, .tag, .channel, .cursorHover',
    );
    const enterHandlers: Array<() => void> = [];
    interactives.forEach((el) => {
      const on = () => ring.classList.add('grow');
      const off = () => ring.classList.remove('grow');
      el.addEventListener('mouseenter', on);
      el.addEventListener('mouseleave', off);
      enterHandlers.push(on, off);
    });

    rafId = window.requestAnimationFrame(follow);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseleave', onLeave);
      window.cancelAnimationFrame(rafId);
      interactives.forEach((el, i) => {
        el.removeEventListener('mouseenter', enterHandlers[i * 2]);
        el.removeEventListener('mouseleave', enterHandlers[i * 2 + 1]);
      });
      dot.remove();
      ring.remove();
    };
  }, [reduced]);
}
