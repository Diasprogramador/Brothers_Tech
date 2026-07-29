import { useEffect, useRef, useState } from "react";
import { HeroTitle } from "./HeroTitle";
import "./AnimatedHeroTitle.css";

/**
 * AnimatedHeroTitle — wrapper que controla a interação stroke-drawing.
 *
 * Estratégia robusta:
 * 1. Captura o SVG após o mount via callback ref
 * 2. Calcula stroke-dasharray de cada path (no espaço REAL, considerando scale)
 * 3. Aplica dasharray/dashoffset INLINE (inline > CSS specificity)
 * 4. Controla estado is-active via class no wrapper
 *
 * - Desktop: hover ativa
 * - Mobile: tap ativa (toggle)
 * - Auto-reset 1.5s após mouseleave / touchend
 */
export const AnimatedHeroTitle = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  // Após o SVG montar, calcular dasharray para cada path
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const strokePaths = svg.querySelectorAll<SVGPathElement>(
      ".hero-title__stroke-path",
    );

    strokePaths.forEach((path) => {
      try {
        const length = path.getTotalLength();
        // Aplicar inline com !important via setProperty para garantir prioridade sobre CSS
        path.style.setProperty("stroke-dasharray", `${length}`, "important");
        path.style.setProperty("stroke-dashoffset", `${length}`, "important");
      } catch {
        path.style.setProperty("stroke-dasharray", "800", "important");
        path.style.setProperty("stroke-dashoffset", "800", "important");
      }
    });
  }, []);

  // Hover handlers (desktop)
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    const handleEnter = () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
      setIsActive(true);
    };

    const handleLeave = () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
      resetTimerRef.current = window.setTimeout(() => {
        setIsActive(false);
        resetTimerRef.current = null;
      }, 1500);
    };

    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const handleTouchStart = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
    setIsActive(true);
  };

  const handleTouchEnd = () => {
    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }
    resetTimerRef.current = window.setTimeout(() => {
      setIsActive(false);
      resetTimerRef.current = null;
    }, 1500);
  };

  return (
    <div
      ref={wrapperRef}
      className={`hero-title-wrapper ${isActive ? "is-active" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <HeroTitle svgRef={svgRef} />
    </div>
  );
};