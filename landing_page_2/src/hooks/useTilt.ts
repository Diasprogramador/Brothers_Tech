import { useEffect, useRef } from 'react';

interface UseTiltOptions {
  /** Max rotation degrees on each axis */
  max?: number;
  /** Perspective in px (lower = more dramatic 3D) */
  perspective?: number;
  /** Spring scale on hover */
  scale?: number;
}

/**
 * Hook para efeito TILT 3D (transform 3D puro CSS, zero deps) em qualquer elemento.
 * Gira o card em rotateX/rotateY baseado na posição do mouse.
 *
 * Uso:
 *   const ref = useTilt({ max: 12 });
 *   <div ref={ref} className="card">...</div>
 *
 * Respeita prefers-reduced-motion.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(options: UseTiltOptions = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    // Também desativa em touch devices (não faz sentido tilt em mobile)
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (isCoarse) return;

    const { max = 12, perspective = 800, scale = 1.02 } = options;

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;   // 0..1
      const py = (e.clientY - rect.top) / rect.height;  // 0..1
      const rotateY = (px - 0.5) * 2 * max;  // -max..+max
      const rotateX = (0.5 - py) * 2 * max;  // +max..-max
      el.style.transform = `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
    };

    const handleLeave = () => {
      el.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale(1)`;
    };

    el.style.transition = 'transform 0.25s ease-out';
    el.style.willChange = 'transform';
    el.style.transformStyle = 'preserve-3d';

    el.addEventListener('mousemove', handleMove);
    el.addEventListener('mouseleave', handleLeave);

    return () => {
      el.removeEventListener('mousemove', handleMove);
      el.removeEventListener('mouseleave', handleLeave);
      el.style.transform = '';
      el.style.willChange = '';
      el.style.transformStyle = '';
      el.style.transition = '';
    };
  }, [options.max, options.perspective, options.scale]);

  return ref;
}
