import { useEffect } from "react";

/**
 * useReveal — adiciona a classe `.in` nos elementos com `.reveal*`
 * quando eles entram na viewport, replicando a lógica do script.js vanilla.
 *
 * Aceita um ref opcional: se fornecido, observa apenas os descendentes desse ref.
 * Caso contrário, observa todos os elementos do documento com as classes de reveal.
 *
 * Suporta `data-delay` (em ms) para atrasos individuais por elemento.
 * Respeita `prefers-reduced-motion` mostrando tudo imediatamente.
 */
export const useReveal = (rootRef?: React.RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const selector =
      ".reveal, .reveal-left, .reveal-right, .reveal-scale";

    const root = rootRef?.current ?? document;
    const elements = root.querySelectorAll<HTMLElement>(selector);

    if (!elements.length) return;

    // Se o usuário prefere movimento reduzido, mostra tudo de uma vez.
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      elements.forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const target = entry.target as HTMLElement;
          const delay = Number(target.dataset.delay) || 0;

          setTimeout(() => target.classList.add("in"), delay);

          observer.unobserve(target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px",
      },
    );

    elements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [rootRef]);
};
