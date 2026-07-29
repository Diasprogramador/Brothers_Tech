import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  type MotionValue,
} from "framer-motion";

/* ──────────────────────────────────────────────────────────
   Cada fundador agora tem 3 versões do avatar:
     lego  → normal  → pixel
   A transição entre estilos acontece ao longo do scroll.
   ────────────────────────────────────────────────────────── */

interface AvatarSet {
  lego: string;
  normal: string;
  pixel: string;
}

interface Founder {
  role: string;
  name: string;
  desc: string;
  avatars: AvatarSet;
  color: string;
}

interface FounderCardAnim {
  avatarOpacity: ReturnType<typeof useTransform<number, number>>;
  avatarScale: ReturnType<typeof useTransform<number, number>>;
  textOpacity: ReturnType<typeof useTransform<number, number>>;
  textY: ReturnType<typeof useTransform<number, number>>;
  zIndex: number;
}

interface AvatarStyleAnim {
  opacity: ReturnType<typeof useTransform<number, number>>;
  scale: ReturnType<typeof useTransform<number, number>>;
}

const FOUNDERS: Founder[] = [
  {
    role: "Co-fundador & Engenheiro",
    name: "Sanderson",
    desc: "O cérebro por trás da arquitetura. Sanderson transforma problemas complexos em sistemas escaláveis e performáticos. Especialista em backend e infraestrutura.",
    avatars: {
      lego: "/assets/sanderson_avatar_lego.svg",
      normal: "/assets/sanderson_avatar.svg",
      pixel: "/assets/sanderson_avatar_pixel.svg",
    },
    color: "var(--green)",
  },
  {
    role: "Co-fundador & Designer",
    name: "Caio",
    desc: "A alma da interface. Caio une estética e funcionalidade para criar experiências digitais que não apenas funcionam, mas encantam. Especialista em UI/UX e animações.",
    avatars: {
      lego: "/assets/caio_avatar_lego.svg",
      normal: "/assets/caio_avatar.svg",
      pixel: "/assets/caio_avatar_pixel.svg",
    },
    color: "var(--orange)",
  },
];

/* ── Progress map ──
   O scroll total da seção é dividido em blocos para cada fundador.
   Cada fundador ocupa 3 sub-blocos (lego → normal → pixel).

   Sanderson: 0% → 50%
     0  – 16.7  → lego visível
     16.7 – 33.3 → transição lego → normal
     33.3 – 50   → transição normal → pixel

   Caio: 50% → 100%
     50   – 66.7 → lego visível
     66.7 – 83.3 → transição lego → normal
     83.3 – 100  → transição normal → pixel
*/

function useBuildFounderAnims(
  progress: MotionValue<number>,
  start: number,
  end: number,
): { card: FounderCardAnim; lego: AvatarStyleAnim; normal: AvatarStyleAnim; pixel: AvatarStyleAnim } {
  // (mid removed — was unused)

  // Card visibility
  const avatarOpacity = useTransform(progress, [start, start + 0.02, end - 0.02, end], [0, 1, 1, 0]);
  const avatarScale = useTransform(progress, [start, end], [0.95, 1.05]);
  const textOpacity = useTransform(
    progress,
    [start, start + 0.03, end - 0.03, end],
    [0, 1, 1, 0],
  );
  const textY = useTransform(progress, [start, end], [30, -30]);

  // ── Avatar style transitions ──
  // Divide o intervalo do fundador em 3 partes iguais:
  //   Parte 1: lego dominante
  //   Parte 2: normal dominante
  //   Parte 3: pixel dominante
  const third = (end - start) / 3;
  const t1End = start + third;
  const t2End = start + third * 2;

  // Lego: 1 no início, cai em t1End
  const legoOpacity = useTransform(
    progress,
    [start, t1End - 0.03, t1End + 0.03],
    [1, 1, 0],
  );
  const legoScale = useTransform(
    progress,
    [start, t1End],
    [1, 0.85],
  );

  // Normal: 0 no início, sobe em t1End, cai em t2End
  const normalOpacity = useTransform(
    progress,
    [start, t1End - 0.03, t1End + 0.03, t2End - 0.03, t2End + 0.03],
    [0, 0, 1, 1, 0],
  );
  const normalScale = useTransform(
    progress,
    [start, t1End, t2End],
    [1.15, 1, 0.85],
  );

  // Pixel: 0 no início, sobe em t2End
  const pixelOpacity = useTransform(
    progress,
    [t2End - 0.03, t2End + 0.03, end],
    [0, 1, 1],
  );
  const pixelScale = useTransform(
    progress,
    [t2End, end],
    [1.15, 1],
  );

  return {
    card: { avatarOpacity, avatarScale, textOpacity, textY, zIndex: 1 },
    lego: { opacity: legoOpacity, scale: legoScale },
    normal: { opacity: normalOpacity, scale: normalScale },
    pixel: { opacity: pixelOpacity, scale: pixelScale },
  };
}

export const About = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 28,
    restDelta: 0.001,
  });

  // Background text slides slightly opposite to scroll
  const bgX = useTransform(smoothProgress, [0, 1], ["10%", "-10%"]);

  // San: 0 → 0.50   |   Caio: 0.50 → 1.00
  const f0Anims = useBuildFounderAnims(smoothProgress, 0, 0.50);
  const f1Anims = useBuildFounderAnims(smoothProgress, 0.50, 1.0);

  const allAnims = [f0Anims, f1Anims];

  return (
    <section ref={containerRef} id="sobre" className="about-premium">
      <div className="about-sticky-wrapper">
        <motion.div className="about-bg-text" style={{ x: bgX }}>
          BROTHERS TECH
        </motion.div>

        <div className="wrap about-wrap">
          <div className="about-grid">
            <div className="about-visuals">
              {FOUNDERS.map((f, i) => {
                const a = allAnims[i];
                return (
                  <motion.div
                    key={f.name}
                    className="about-avatar-box"
                    style={{
                      opacity: a.card.avatarOpacity,
                      scale: a.card.avatarScale,
                      zIndex: a.card.zIndex,
                    }}
                  >
                    {/* Lego */}
                    <motion.img
                      src={f.avatars.lego}
                      alt={`${f.name} Lego`}
                      className="about-img about-style-img"
                      style={{
                        opacity: a.lego.opacity,
                        scale: a.lego.scale,
                        position: "absolute",
                      }}
                    />
                    {/* Normal */}
                    <motion.img
                      src={f.avatars.normal}
                      alt={`${f.name}`}
                      className="about-img about-style-img"
                      style={{
                        opacity: a.normal.opacity,
                        scale: a.normal.scale,
                        position: "absolute",
                      }}
                    />
                    {/* Pixel */}
                    <motion.img
                      src={f.avatars.pixel}
                      alt={`${f.name} Pixel`}
                      className="about-img about-style-img"
                      style={{
                        opacity: a.pixel.opacity,
                        scale: a.pixel.scale,
                        position: "absolute",
                      }}
                    />
                  </motion.div>
                );
              })}
            </div>

            <div className="about-infos">
              {FOUNDERS.map((f, i) => {
                const a = allAnims[i];
                return (
                  <motion.div
                    key={f.name + "-text"}
                    className="about-text-card"
                    style={{
                      opacity: a.card.textOpacity,
                      y: a.card.textY,
                    }}
                  >
                    <span className="about-eyebrow" style={{ color: f.color }}>
                      {f.role}
                    </span>
                    <h2 className="about-title">{f.name}</h2>
                    <p className="about-paragraph">{f.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="about-progress">
          <motion.div
            className="about-progress-fill"
            style={{ scaleY: smoothProgress, originY: 0 }}
          />
        </div>
      </div>
    </section>
  );
};
