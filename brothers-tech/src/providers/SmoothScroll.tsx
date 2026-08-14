import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

/**
 * Smooth scroll provider — envolve toda a aplicação e dá a sensação
 * de inércia/fluidez ao rolar (igual sites Awwwards).
 * "Puxa" o scroll suavemente em vez do snap do browser.
 * Respeita prefers-reduced-motion (nada muda nesse caso).
 *
 * Só liga em ponteiro fino (mouse/trackpad) + desktop, mesmo critério do
 * CustomCursor. No toque, rolagem suavizada por JS perde o momentum nativo
 * do sistema e passa a impressão de atraso no dedo — melhor deixar o
 * celular com o scroll nativo do navegador.
 */
export const SmoothScroll = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointerDesktop = window.matchMedia(
      "(pointer: fine) and (min-width: 860px)",
    ).matches;
    if (prefersReduced || !finePointerDesktop) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
