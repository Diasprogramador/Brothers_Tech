import { HERO_LETTERS } from "./letterData";
import "./HeroTitle.css";

interface HeroTitleProps {
  /** Ref para o elemento SVG (para futuras integrações com animações externas) */
  svgRef?: React.Ref<SVGSVGElement>;
}

// Layout constants — baseados no Preloader para manter proporções
const GAP_X = 6; // espaço horizontal entre letras (em unidades SVG)
const GAP_Y = 18; // espaço vertical entre as linhas BROTHERS e TECH

interface LetterPosition {
  d: string;
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

interface LayoutResult {
  totalWidth: number;
  totalHeight: number;
  positions: LetterPosition[];
  brothersLine: { x: number; y: number }[];
  techLine: { x: number; y: number }[];
  techScale: number;
  strokeWidth: number;
}

function calculateLayout(): LayoutResult {
  const brothers = HERO_LETTERS.slice(0, 8); // B R O T H E R S
  const tech = HERO_LETTERS.slice(8); // T E C H

  const getDims = (letter: (typeof HERO_LETTERS)[number]) => {
    const parts = letter.viewBox.split(" ").map(Number);
    return { width: parts[2], height: parts[3] };
  };

  const brothersDims = brothers.map(getDims);
  const techDims = tech.map(getDims);

  // Alvo: BROTHERS define a altura base. TECH é escalada para caber na mesma altura.
  // Usamos a letra "R" do BROTHERS (altura 84) como referência porque é a mais comum.
  const TARGET_H = 84;
  const brothersScale = TARGET_H / Math.max(...brothersDims.map((d) => d.height));
  const techScale = TARGET_H / Math.max(...techDims.map((d) => d.height));

  const brothersScaled = brothersDims.map((d) => ({
    width: d.width * brothersScale,
    height: d.height * brothersScale,
  }));
  const techScaled = techDims.map((d) => ({
    width: d.width * techScale,
    height: d.height * techScale,
  }));

  const brothersWidth =
    brothersScaled.reduce((sum, d) => sum + d.width, 0) +
    (brothers.length - 1) * GAP_X;
  const techWidth =
    techScaled.reduce((sum, d) => sum + d.width, 0) +
    (tech.length - 1) * GAP_X;

  const totalWidth = Math.max(brothersWidth, techWidth);
  const totalHeight = TARGET_H + GAP_Y + TARGET_H;

  const brothersOffsetX = (totalWidth - brothersWidth) / 2;
  const techOffsetX = (totalWidth - techWidth) / 2;

  const positions: LetterPosition[] = [];

  // BROTHERS row (y = 0)
  let x = brothersOffsetX;
  for (let i = 0; i < brothers.length; i++) {
    positions.push({
      d: brothers[i].filledPath,
      color: brothers[i].color,
      x: x / brothersScale,
      y: 0,
      width: brothersDims[i].width,
      height: brothersDims[i].height,
    });
    x += brothersScaled[i].width + GAP_X;
  }

  // TECH row (y = TARGET_H + GAP_Y)
  const techY = TARGET_H + GAP_Y;
  x = techOffsetX;
  for (let i = 0; i < tech.length; i++) {
    positions.push({
      d: tech[i].filledPath,
      color: tech[i].color,
      x: x / techScale,
      y: techY / techScale,
      width: techDims[i].width,
      height: techDims[i].height,
    });
    x += techScaled[i].width + GAP_X;
  }

  // stroke-width proporcional ao tamanho: TECH usa stroke menor porque é menor
  const strokeWidth = brothersScale >= techScale ? 1.5 * brothersScale : 1.5 * techScale;

  return {
    totalWidth,
    totalHeight,
    positions,
    brothersLine: [],
    techLine: [],
    techScale,
    strokeWidth,
  };
}

/**
 * HeroTitle — título animado "BROTHERS / TECH" com letras SVG.
 *
 * Estratégia:
 * - SVG único com viewBox calculada.
 * - BROTHERS (8 letras) e TECH (4 letras) em linhas separadas.
 * - As letras do TECH são ESCALADAS para terem a mesma altura visual das do BROTHERS
 *   (resolve o problema de letras do TECH serem 25% maiores no Figma).
 * - Cada letra tem sua própria escala aplicada via transform="translate(...) scale(...)".
 * - Renderiza dois layers: filled (preenchido) e stroke (borda).
 *   O stroke é animado via stroke-dashoffset no hover/touch.
 */
export const HeroTitle = ({ svgRef }: HeroTitleProps = {}) => {
  const { totalWidth, totalHeight, positions, techScale, strokeWidth } =
    calculateLayout();

  // Separa positions por linha para aplicar transform correto
  const TARGET_H = 84;
  const brothersScale =
    TARGET_H /
    Math.max(...HERO_LETTERS.slice(0, 8).map((l) => {
      const p = l.viewBox.split(" ").map(Number);
      return p[3];
    }));

  const brothersEnd = HERO_LETTERS.slice(0, 8).length;

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
          {positions.map((p, i) => {
            const isTech = i >= brothersEnd;
            const scale = isTech ? techScale : brothersScale;
            return (
              <path
                key={`fill-${i}`}
                className="hero-title__filled-path"
                d={p.d}
                fill={p.color}
                transform={`translate(${p.x}, ${p.y}) scale(${scale})`}
              />
            );
          })}
        </g>

        {/* Stroke layer (borda) — animação stroke-drawing no hover/touch */}
        <g
          className="hero-title__stroke-layer"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {positions.map((p, i) => {
            const isTech = i >= brothersEnd;
            const scale = isTech ? techScale : brothersScale;
            return (
              <path
                key={`stroke-${i}`}
                className="hero-title__stroke-path"
                d={p.d}
                fill="none"
                stroke={p.color}
                strokeWidth={strokeWidth / scale}
                transform={`translate(${p.x}, ${p.y}) scale(${scale})`}
              />
            );
          })}
        </g>
      </svg>
    </div>
  );
};