import { useEffect, useRef, useState } from "react";
import { HeroTitle } from "./HeroTitle";
import "./AnimatedHeroTitle.css";

/**
 * AnimatedHeroTitle — wrapper que controla a interação stroke-drawing.
 *
 * - Desktop: hover ativa a animação
 * - Mobile: tap ativa a animação (toggle)
 * - Após 1.5s sem interação, reverte
 *
 * O stroke-dasharray é calculado dinamicamente pelo `getTotalLength()` de cada path.
 */
export const AnimatedHeroTitle = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const strokeLayerRef = useRef<SVGGElement | null>(null);
  const [isActive, setIsActive] = useState(false);
  const resetTimerRef = useRef<number | null>(null);

  // Captura referência ao stroke-layer quando o SVG monta
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const layer = container.querySelector<SVGGElement>(
      ".hero-title__stroke-layer",
    );
    strokeLayerRef.current = layer;
  }, []);

  // Calcula stroke-dasharray para cada path do stroke-layer
  useEffect(() => {
    const layer = strokeLayerRef.current;
    if (!layer) return;

    const paths = layer.querySelectorAll<SVGPathElement>(
      ".hero-title__stroke-path",
    );
    paths.forEach((path) => {
      try {
        const length = path.getTotalLength();
        path.style.strokeDasharray = `${length}`;
        path.style.strokeDashoffset = `${length}`;
      } catch {
        // fallback silencioso
        path.style.strokeDasharray = "500";
        path.style.strokeDashoffset = "500";
      }
    });
  }, []);

  // Ativação por hover (desktop)
  useEffect(() => {
    const el = containerRef.current;
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

  // Touch handlers
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
      ref={containerRef}
      className={`hero-title-wrapper ${isActive ? "is-active" : ""}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <HeroTitle />
    </div>
  );
};