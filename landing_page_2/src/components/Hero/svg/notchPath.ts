// ============================================================
// SVG Path Morphing — parse, normalize, rotate, interpolate
// ============================================================

interface Point { x: number; y: number; }
interface CubicSegment { start: Point; cp1: Point; cp2: Point; end: Point; }

const lerpPt = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

// ── Tokenize & Parse ────────────────────────────────────────
function tokenize(d: string): string[] {
  return (d.match(/[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)/g) || []);
}

function parseTokens(tokens: string[]): { type: string; values: number[] }[] {
  const cmds: { type: string; values: number[] }[] = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (/^[a-zA-Z]$/.test(t)) {
      const values: number[] = [];
      i++;
      while (i < tokens.length && /^[-+]?\d/.test(tokens[i])) {
        values.push(parseFloat(tokens[i]));
        i++;
      }
      cmds.push({ type: t, values });
    } else i++;
  }
  return cmds;
}

// ── Normalize → start + cubic segments (without Z) ──────────
function parseToCubic(d: string): { start: Point; segments: CubicSegment[] } {
  const cmds = parseTokens(tokenize(d));
  const segments: CubicSegment[] = [];
  let cx = 0, cy = 0, mx = 0, my = 0;
  let prevEnd: Point = { x: 0, y: 0 };

  for (const cmd of cmds) {
    const rel = cmd.type === cmd.type.toLowerCase();
    const T = cmd.type.toUpperCase();
    const v = cmd.values;

    if (T === "M") {
      cx = rel ? cx + v[0] : v[0]; cy = rel ? cy + v[1] : v[1];
      mx = cx; my = cy; prevEnd = { x: cx, y: cy };
    } else if (T === "H") {
      const ex = rel ? cx + v[0] : v[0];
      segments.push({ start: { ...prevEnd }, cp1: { ...prevEnd }, cp2: { x: ex, y: cy }, end: { x: ex, y: cy } });
      cx = ex; prevEnd = { x: ex, y: cy };
    } else if (T === "V") {
      const ey = rel ? cy + v[0] : v[0];
      segments.push({ start: { ...prevEnd }, cp1: { ...prevEnd }, cp2: { x: cx, y: ey }, end: { x: cx, y: ey } });
      cy = ey; prevEnd = { x: cx, y: ey };
    } else if (T === "C") {
      const c1x = rel ? cx + v[0] : v[0], c1y = rel ? cy + v[1] : v[1];
      const c2x = rel ? cx + v[2] : v[2], c2y = rel ? cy + v[3] : v[3];
      const ex  = rel ? cx + v[4] : v[4], ey  = rel ? cy + v[5] : v[5];
      segments.push({ start: { ...prevEnd }, cp1: { x: c1x, y: c1y }, cp2: { x: c2x, y: c2y }, end: { x: ex, y: ey } });
      cx = ex; cy = ey; prevEnd = { x: ex, y: ey };
    } else if (T === "L" || T === "S" || T === "Q" || T === "T") {
      const ex = rel ? cx + v[v.length - 2] : v[v.length - 2];
      const ey = rel ? cy + v[v.length - 1] : v[v.length - 1];
      segments.push({ start: { ...prevEnd }, cp1: { ...prevEnd }, cp2: { x: ex, y: ey }, end: { x: ex, y: ey } });
      cx = ex; cy = ey; prevEnd = { x: ex, y: ey };
    }
    // Z ignorado aqui — será reconstruído depois da rotação
  }

  return { start: { x: mx, y: my }, segments };
}

// ── De Casteljau: subdividir curva cúbica em t=0.5 ──────────
function subdivide(s: CubicSegment): [CubicSegment, CubicSegment] {
  const { start: p0, cp1: p1, cp2: p2, end: p3 } = s;
  const l = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });
  const p01 = l(p0, p1), p12 = l(p1, p2), p23 = l(p2, p3);
  const p012 = l(p01, p12), p123 = l(p12, p23), p0123 = l(p012, p123);
  return [
    { start: p0, cp1: p01, cp2: p012, end: p0123 },
    { start: p0123, cp1: p123, cp2: p23, end: p3 },
  ];
}

// ── Equalizar contagem de segmentos ─────────────────────────
function equalize(allSegs: CubicSegment[][]): CubicSegment[][] {
  const maxLen = Math.max(...allSegs.map(s => s.length));
  return allSegs.map(arr => {
    const result = arr.map(s => ({ ...s, start: { ...s.start }, cp1: { ...s.cp1 }, cp2: { ...s.cp2 }, end: { ...s.end } }));
    while (result.length < maxLen) {
      let maxIdx = 0, maxDist = 0;
      for (let i = 0; i < result.length; i++) {
        const s = result[i];
        const d = (s.end.x - s.start.x) ** 2 + (s.end.y - s.start.y) ** 2;
        if (d > maxDist) { maxDist = d; maxIdx = i; }
      }
      const [a, b] = subdivide(result[maxIdx]);
      result.splice(maxIdx, 1, a, b);
    }
    return result;
  });
}

// ── Rotacionar segments para começarem no ponto de referência ─
function rotateToReference(
  _start: Point,
  segments: CubicSegment[],
  refPoint: Point,
): { start: Point; segments: CubicSegment[] } {
  // Encontrar o segmento cujo endpoint mais se aproxima do refPoint
  let bestIdx = 0, bestDist = Infinity;
  for (let i = 0; i < segments.length; i++) {
    const dx = segments[i].end.x - refPoint.x;
    const dy = segments[i].end.y - refPoint.y;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) { bestDist = dist; bestIdx = i; }
  }

  // Rotacionar: pegar a partir do próximo segmento após bestIdx
  const rotated = [
    ...segments.slice(bestIdx + 1),
    ...segments.slice(0, bestIdx + 1),
  ];

  // Novo ponto de início = endpoint do segmento que encontramos
  const newStart = { ...segments[bestIdx].end };

  // Ajustar o primeiro segmento para começar do novo ponto
  rotated[0] = { ...rotated[0], start: newStart };

  // Reconstruir o segmento de fechamento (Z) no final
  rotated[rotated.length - 1] = {
    ...rotated[rotated.length - 1],
    end: { ...newStart },
  };

  return { start: newStart, segments: rotated };
}

// ── Interpolação ────────────────────────────────────────────
function interpolateSegments(a: CubicSegment[], b: CubicSegment[], t: number): CubicSegment[] {
  return a.map((sa, i) => ({
    start: lerpPt(sa.start, b[i].start, t),
    cp1: lerpPt(sa.cp1, b[i].cp1, t),
    cp2: lerpPt(sa.cp2, b[i].cp2, t),
    end: lerpPt(sa.end, b[i].end, t),
  }));
}

function segmentsToD(start: Point, segments: CubicSegment[]): string {
  let d = `M${start.x.toFixed(6)} ${start.y.toFixed(6)}`;
  for (const s of segments) {
    d += ` C${s.cp1.x.toFixed(6)} ${s.cp1.y.toFixed(6)} ${s.cp2.x.toFixed(6)} ${s.cp2.y.toFixed(6)} ${s.end.x.toFixed(6)} ${s.end.y.toFixed(6)}`;
  }
  return d + "Z";
}

// ── Easing ──────────────────────────────────────────────────
export const easeInOut = (t: number): number =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

// ============================================================
// SVG path d strings — extraídos dos arquivos Figma
// ============================================================

const DESKTOP_INITIAL_D = `M0.809993 0.063112 C0.809993 0.075131 0.816326 0.084875 0.824068 0.084875 H0.985925 C0.993702 0.084875 1 0.094618 1 0.106638 V0.910773 C1 0.922793 0.993702 0.932535 0.985925 0.932535 H0.967628 C0.959887 0.932535 0.953554 0.942328 0.953554 0.955386 V0.978237 C0.953554 0.990257 0.947220 1 0.939479 1 H0.052076 C0.044335 1 0.038001 0.990257 0.038001 0.978237 V0.830250 C0.038001 0.818281 0.031668 0.808488 0.023927 0.808488 H0.014075 C0.006301 0.808488 0 0.798694 0 0.786725 V0.106638 C0 0.094618 0.006301 0.084875 0.014075 0.084875 H0.146376 C0.154116 0.084875 0.160450 0.075131 0.160450 0.063112 V0.021763 C0.160450 0.009742 0.166784 0 0.174525 0 H0.795918 C0.803694 0 0.809993 0.009742 0.809993 0.021763 V0.063112 Z`;

const DESKTOP_INTERMEDIATE_D = `M0.964110 0.020131 C0.964110 0.031248 0.969937 0.040261 0.977833 0.040261 H0.985925 C0.993702 0.040261 1 0.050004 1 0.062024 V0.910773 C1 0.922793 0.993702 0.932535 0.985925 0.932535 H0.967628 C0.959887 0.932535 0.953554 0.942328 0.953554 0.955386 V0.978237 C0.953554 0.990257 0.947220 1 0.939479 1 H0.052076 C0.044335 1 0.038001 0.990257 0.038001 0.978237 V0.830250 C0.038001 0.818281 0.031668 0.808488 0.023927 0.808488 H0.014075 C0.006301 0.808488 0 0.798694 0 0.786725 V0.059303 C0 0.048787 0.005514 0.040261 0.012315 0.040261 C0.019117 0.040261 0.024630 0.031736 0.024630 0.021219 V0.020131 C0.024630 0.009014 0.030457 0 0.038353 0 H0.951442 C0.959338 0 0.964110 0.009014 0.964110 0.020131 Z`;

const DESKTOP_FINAL_D = `M1 0.910773 C1 0.922793 0.993702 0.932535 0.985925 0.932535 H0.967628 C0.959887 0.932535 0.953554 0.942328 0.953554 0.955386 V0.978237 C0.953554 0.990257 0.947220 1 0.939479 1 H0.052076 C0.044335 1 0.038001 0.990257 0.038001 0.978237 V0.830250 C0.038001 0.818281 0.031668 0.808488 0.023927 0.808488 H0.014075 C0.006301 0.808488 0 0.798694 0 0.786725 V0.021763 C0 0.009742 0.006301 0 0.014075 0 H0.985925 C0.993702 0 1 0.009742 1 0.021763 V0.910773 Z`;

const MOBILE_INITIAL_D = `M0.952247 0.109649 C0.952247 0.115532 0.962938 0.120301 0.976124 0.120301 C0.989310 0.120301 1 0.125070 1 0.130952 V0.974937 C1 0.988722 0.974719 1 0.943820 1 H0.151685 C0.120658 1 0.095506 0.988722 0.095506 0.974937 V0.953634 C0.095506 0.941868 0.074126 0.932331 0.047753 0.932331 C0.021380 0.932331 0 0.920538 0 0.909774 V0.092732 C0 0.078890 0.025152 0.067669 0.056180 0.067669 H0.474719 C0.505618 0.067669 0.530899 0.056448 0.530899 0.042607 V0.025063 C0.530899 0.011222 0.556180 0 0.587079 0 H0.896067 C0.926966 0 0.952247 0.011222 0.952247 0.025063 V0.109649 Z`;

const MOBILE_INTERMEDIATE_D = `M0.952247 0.030702 C0.952247 0.036584 0.962938 0.041353 0.976124 0.041353 C0.989310 0.041353 1 0.046122 1 0.052005 V0.974937 C1 0.988722 0.974848 1 0.943820 1 H0.151685 C0.120658 1 0.095506 0.988722 0.095506 0.974937 V0.953634 C0.095506 0.941868 0.074126 0.932331 0.047753 0.932331 C0.021380 0.932331 0 0.920538 0 0.909774 V0.064536 C0 0.053116 0.020751 0.043860 0.046348 0.043860 C0.071944 0.043860 0.092697 0.034603 0.092697 0.023183 V0.021930 C0.092697 0.009818 0.114705 0 0.141854 0 H0.905899 C0.931497 0 0.952247 0.009257 0.952247 0.020677 V0.030702 Z`;

const MOBILE_FINAL_D = `M1 0.872180 C1 0.879102 0.987424 0.884712 0.971910 0.884712 C0.956396 0.884712 0.943820 0.890351 0.943820 0.897243 V0.974937 C0.943820 0.988722 0.918669 1 0.887640 1 H0.151685 C0.120658 1 0.095506 0.988722 0.095506 0.974937 V0.953634 C0.095506 0.941868 0.074126 0.932331 0.047753 0.932331 C0.021380 0.932331 0 0.920538 0 0.909774 V0.025063 C0 0.011222 0.025152 0 0.056180 0 H0.943820 C0.974848 0 1 0.011222 1 0.025063 V0.872180 Z`;

// ============================================================
// Keyframes pré-computados (normalizados + equalizados)
// ============================================================

function buildKeyframes(dInitial: string, dIntermediate: string, dFinal: string) {
  const init = parseToCubic(dInitial);
  const inter = parseToCubic(dIntermediate);
  const fin = parseToCubic(dFinal);

  // Referência: o ponto M do path final — todos os paths devem começar daqui
  const refPoint = fin.start;

  // Rotacionar initial e intermediate para começarem no mesmo ponto que o final
  const initNorm = rotateToReference(init.start, init.segments, refPoint);
  const interNorm = rotateToReference(inter.start, inter.segments, refPoint);

  // Equalizar contagem de segmentos entre os 3
  const [eqInit, eqInter, eqFinal] = equalize([
    initNorm.segments,
    interNorm.segments,
    fin.segments,
  ]);

  return {
    initStart: initNorm.start,
    interStart: interNorm.start,
    finStart: fin.start,
    initSegments: eqInit,
    interSegments: eqInter,
    finSegments: eqFinal,
  };
}

const DESKTOP = buildKeyframes(DESKTOP_INITIAL_D, DESKTOP_INTERMEDIATE_D, DESKTOP_FINAL_D);
const MOBILE = buildKeyframes(MOBILE_INITIAL_D, MOBILE_INTERMEDIATE_D, MOBILE_FINAL_D);

// ============================================================
// Public API
// ============================================================

export const buildClipPath = (p: number, isMobile: boolean): string => {
  const kf = isMobile ? MOBILE : DESKTOP;

  let start: Point;
  let segments: CubicSegment[];

  if (p <= 0.5) {
    const t = p / 0.5;
    start = lerpPt(kf.initStart, kf.interStart, t);
    segments = interpolateSegments(kf.initSegments, kf.interSegments, t);
  } else {
    const t = (p - 0.5) / 0.5;
    start = lerpPt(kf.interStart, kf.finStart, t);
    segments = interpolateSegments(kf.interSegments, kf.finSegments, t);
  }

  return segmentsToD(start, segments);
};

export const getInitialPath = (isMobile: boolean): string =>
  buildClipPath(0, isMobile);
