import { useEffect } from "react";
import "./CustomCursor.css";

/**
 * CustomCursor — cursor customizado (dot + ring com lerp) para
 * desktops com mouse fino (≥860px). Replica a lógica do script.js vanilla.
 *
 * - Ativa apenas se `pointer: fine` e `innerWidth >= 860px`.
 * - Desativa se `prefers-reduced-motion` estiver ativo.
 * - Ring segue o mouse com "elasticidade" (lerp 0.18).
 * - Cresce (grow) ao passar sobre elementos interativos.
 * - Some ao sair da janela, volta ao entrar.
 */
export const CustomCursor = () => {
  useEffect(() => {
    const finePointer =
      window.matchMedia("(pointer: fine)").matches &&
      window.innerWidth >= 860;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!finePointer || prefersReducedMotion) return;

    // Cria dot e ring dinamicamente
    const dot = document.createElement("div");
    const ring = document.createElement("div");
    dot.className = "cursor-dot";
    ring.className = "cursor-ring";
    dot.setAttribute("aria-hidden", "true");
    ring.setAttribute("aria-hidden", "true");
    document.body.append(dot, ring);

    // Estado do cursor
    let mx = 0;
    let my = 0;
    let rx = 0;
    let ry = 0;
    let rafId = 0;
    let active = true;

    // mousemove — dot segue direto, ring é atualizado via rAF
    const handleMouseMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx - 3}px, ${my - 3}px)`;
    };

    // follow loop — ring com lerp para elasticidade
    const follow = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
      if (active) rafId = requestAnimationFrame(follow);
    };
    rafId = requestAnimationFrame(follow);

    // Hover grow em elementos interativos
    const interactiveSelector =
      "a, button, .tag, .channel, .service-card, .project-card, .founder";
    const interactiveEls = document.querySelectorAll<HTMLElement>(
      interactiveSelector,
    );

    const handleEnter = () => ring.classList.add("grow");
    const handleLeave = () => ring.classList.remove("grow");

    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", handleEnter);
      el.addEventListener("mouseleave", handleLeave);
    });

    // Some ao sair da janela, volta ao entrar
    const handleDocLeave = () => {
      dot.style.opacity = "0";
      ring.style.opacity = "0";
    };
    const handleDocEnter = () => {
      dot.style.opacity = "1";
      ring.style.opacity = "1";
    };
    document.addEventListener("mouseleave", handleDocLeave);
    document.addEventListener("mouseenter", handleDocEnter);

    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup
    return () => {
      active = false;
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleDocLeave);
      document.removeEventListener("mouseenter", handleDocEnter);
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", handleEnter);
        el.removeEventListener("mouseleave", handleLeave);
      });
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
};
