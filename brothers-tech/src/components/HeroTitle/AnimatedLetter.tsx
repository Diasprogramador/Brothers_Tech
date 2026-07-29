import { useEffect, useRef, useState } from "react";
import "./AnimatedLetter.css";

interface AnimatedLetterProps {
  filledPath: string;
  strokePath: string;
  viewBox: string;
  delay?: number;
  color: string;
  label: string;
}

/**
 * AnimatedLetter — exibe uma letra SVG que troca da versão preenchida
 * para a versão só com borda quando o usuário passa o cursor / toca perto.
 *
 * Animação:
 * - Ao hover: fade-out do preenchido + stroke-drawing animation da borda
 * - Ao sair do hover: aguarda 1.5s e reverte (preenchido volta)
 *
 * Funciona com mouse (desktop) e touch (mobile via :active).
 */
export const AnimatedLetter = ({
  filledPath,
  strokePath,
  viewBox,
  delay = 0,
  color,
  label,
}: AnimatedLetterProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [isActive, setIsActive] = useState(false);
  const [pathLength, setPathLength] = useState(500);
  const resetTimerRef = useRef<number | null>(null);

  // Calcula o comprimento do path da borda para o stroke-dasharray
  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    try {
      const length = path.getTotalLength();
      setPathLength(length);
    } catch {
      setPathLength(500);
    }
  }, [strokePath]);

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

  // Suporte a touch (tap-and-hold)
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
      className={`hero-letter ${isActive ? "is-active" : ""}`}
      style={{
        animationDelay: `${delay}s`,
        "--letter-color": color,
        "--path-length": pathLength,
      } as React.CSSProperties}
      role="img"
      aria-label={label}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* SVG com 2 layers: filled (preenchido) + stroke (borda) */}
      <svg
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className="hero-letter__svg"
        aria-hidden="true"
      >
        {/* Layer 1: filled (preenchido) */}
        <path
          className="hero-letter__filled"
          d={filledPath}
          fill={color}
          style={{ animationDelay: `${delay}s` }}
        />
        {/* Layer 2: stroke (borda) - anima stroke-dashoffset */}
        <path
          ref={pathRef}
          className="hero-letter__stroke"
          d={strokePath}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          style={{ animationDelay: `${delay}s` }}
        />
      </svg>
    </div>
  );
};