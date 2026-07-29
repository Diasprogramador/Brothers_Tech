import { HERO_LETTERS } from "./letterData";
import "./HeroTitle.css";

interface HeroTitleProps {
  /** Ref para o elemento SVG (para futuras integrações com animações externas) */
  svgRef?: React.Ref<SVGSVGElement>;
}

// Layout constants — baseados no Preloader para manter proporções
const GAP_X = 6; // espaço horizontal entre letras (em unidades SVG)
const GAP_Y = 18; // espaço vertical entre as linhas BROTHERS e TECH
const STROKE_WIDTH = 1.5; // espessura do stroke no estado hovered

// viewBox com base em unidades (multiplicador) — usado para ter coordenadas absolutas
const SCALE = 1;

interface LetterPosition {
  d: string;
  color: string;
  x: number;
  y: number;
}

function calculateLayout() {
  const brothers = HERO_LETTERS.slice(0, 8); // B R O T H E R S
  const tech = HERO_LETTERS.slice(8); // T E C H

  // Extrai viewBox dimensions de cada letra para layout preciso
  const getDims = (letter: (typeof HERO_LETTERS)[number]) => {
    const parts = letter.viewBox.split(" ").map(Number);
    return { width: parts[2], height: parts[3] };
  };

  const brothersDims = brothers.map(getDims);
  const techDims = tech.map(getDims);

  const brothersWidth =
    brothersDims.reduce((sum, d) => sum + d.width, 0) +
    (brothers.length - 1) * GAP_X;
  const techWidth =
    techDims.reduce((sum, d) => sum + d.width, 0) +
    (tech.length - 1) * GAP_X;

  const brothersMaxH = Math.max(...brothersDims.map((d) => d.height));
  const techMaxH = Math.max(...techDims.map((d) => d.height));

  const totalWidth = Math.max(brothersWidth, techWidth);
  const totalHeight = brothersMaxH + GAP_Y + techMaxH;

  // Centraliza cada linha horizontalmente
  const brothersOffsetX = (totalWidth - brothersWidth) / 2;
  const techOffsetX = (totalWidth - techWidth) / 2;
  const techY = brothersMaxH + GAP_Y;

  const positions: LetterPosition[] = [];
  let x = brothersOffsetX;
  for (let i = 0; i < brothers.length; i++) {
    positions.push({
      d: brothers[i].filledPath,
      color: brothers[i].color,
      x,
      y: 0,
    });
    x += brothersDims[i].width + GAP_X;
  }
  x = techOffsetX;
  for (let i = 0; i < tech.length; i++) {
    positions.push({
      d: tech[i].filledPath,
      color: tech[i].color,
      x,
      y: techY,
    });
    x += techDims[i].width + GAP_X;
  }

  return {
    totalWidth: totalWidth * SCALE,
    totalHeight: totalHeight * SCALE,
    positions: positions.map((p) => ({
      ...p,
      x: p.x * SCALE,
      y: p.y * SCALE,
    })),
    strokeWidth: STROKE_WIDTH * SCALE,
  };
}

/**
 * HeroTitle — título animado "BROTHERS / TECH" com letras SVG.
 * Estrutura idêntica ao Preloader: SVG único, viewBox calculada,
 * paths posicionados via transform. Garante proporções corretas em qualquer tela.
 *
 * As letras são interativas: ao hover/touch, fazem stroke-drawing animation
 * (fade-out do preenchido + animação de stroke da borda).
 */
export const HeroTitle = ({ svgRef }: HeroTitleProps = {}) => {
  const { totalWidth, totalHeight, positions, strokeWidth } = calculateLayout();

  return (
    <div className="hero-title" aria-label="Brothers Tech">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        xmlns="http://www.w3.org/2000/svg"
        className="hero-title__svg"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        aria-label="Brothers Tech"
      >
        {/* Filled layer (preenchido) — visível por padrão */}
        <g className="hero-title__filled-layer">
          {positions.map((p, i) => (
            <path
              key={`fill-${i}`}
              className="hero-title__filled-path"
              d={p.d}
              fill={p.color}
              transform={`translate(${p.x}, ${p.y})`}
            />
          ))}
        </g>

        {/* Stroke layer (borda) — animação stroke-drawing no hover/touch */}
        <g
          className="hero-title__stroke-layer"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {positions.map((p, i) => (
            <path
              key={`stroke-${i}`}
              className="hero-title__stroke-path"
              d={p.d}
              fill="none"
              stroke={p.color}
              strokeWidth={strokeWidth}
              transform={`translate(${p.x}, ${p.y})`}
            />
          ))}
        </g>
      </svg>
    </div>
  );
};