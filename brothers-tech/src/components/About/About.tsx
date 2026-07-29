import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

interface Founder {
  role: string;
  name: string;
  desc: string;
  img: string;
  color: string;
}

interface FounderAnim {
  avatarOpacity: ReturnType<typeof useTransform<number, number>>;
  avatarScale: ReturnType<typeof useTransform<number, number>>;
  textOpacity: ReturnType<typeof useTransform<number, number>>;
  textY: ReturnType<typeof useTransform<number, number>>;
  zIndex: number;
  cardNode: ReactNode;
}

const FOUNDERS: Founder[] = [
  {
    role: "Co-fundador & Engenheiro",
    name: "Sanderson",
    desc: "O cérebro por trás da arquitetura. Sanderson transforma problemas complexos em sistemas escaláveis e performáticos. Especialista em backend e infraestrutura.",
    img: "/assets/sanderson_avatar.svg",
    color: "var(--green)",
  },
  {
    role: "Co-fundador & Designer",
    name: "Caio",
    desc: "A alma da interface. Caio une estética e funcionalidade para criar experiências digitais que não apenas funcionam, mas encantam. Especialista em UI/UX e animações.",
    img: "/assets/caio_avatar.svg",
    color: "var(--orange)",
  },
];

export const About = () => {
  const containerRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Background text slides slightly opposite to scroll
  const bgX = useTransform(smoothProgress, [0, 1], ["10%", "-10%"]);

  // Founder 0 (Sanderson): visible first half
  const f0AvatarOpacity = useTransform(
    smoothProgress,
    [0, 0.48, 0.52],
    [1, 1, 0],
  );
  const f0AvatarScale = useTransform(smoothProgress, [0, 0.5], [1, 1.05]);
  const f0TextOpacity = useTransform(
    smoothProgress,
    [0, 0.1, 0.45, 0.55],
    [0, 1, 1, 0],
  );
  const f0TextY = useTransform(smoothProgress, [0, 0.5], [20, -20]);

  // Founder 1 (Caio): visible second half
  const f1AvatarOpacity = useTransform(
    smoothProgress,
    [0.48, 0.52, 1],
    [0, 1, 1],
  );
  const f1AvatarScale = useTransform(smoothProgress, [0.5, 1], [1, 1.05]);
  const f1TextOpacity = useTransform(
    smoothProgress,
    [0.45, 0.55, 0.9, 1],
    [0, 1, 1, 0],
  );
  const f1TextY = useTransform(smoothProgress, [0.5, 1], [20, -20]);

  const founderAnims: FounderAnim[] = [
    {
      avatarOpacity: f0AvatarOpacity,
      avatarScale: f0AvatarScale,
      textOpacity: f0TextOpacity,
      textY: f0TextY,
      zIndex: 2,
      cardNode: null,
    },
    {
      avatarOpacity: f1AvatarOpacity,
      avatarScale: f1AvatarScale,
      textOpacity: f1TextOpacity,
      textY: f1TextY,
      zIndex: 1,
      cardNode: null,
    },
  ];

  return (
    <section ref={containerRef} id="sobre" className="about-premium">
      <div className="about-sticky-wrapper">
        <motion.div className="about-bg-text" style={{ x: bgX }}>
          BROTHERS TECH
        </motion.div>

        <div className="wrap about-wrap">
          <div className="about-grid">
            <div className="about-visuals">
              {FOUNDERS.map((f, i) => (
                <motion.div
                  key={f.name}
                  className="about-avatar-box"
                  style={{
                    opacity: founderAnims[i].avatarOpacity,
                    scale: founderAnims[i].avatarScale,
                    zIndex: founderAnims[i].zIndex,
                  }}
                >
                  <img src={f.img} alt={f.name} className="about-img" />
                </motion.div>
              ))}
            </div>

            <div className="about-infos">
              {FOUNDERS.map((f, i) => (
                <motion.div
                  key={f.name + "-text"}
                  className="about-text-card"
                  style={{
                    opacity: founderAnims[i].textOpacity,
                    y: founderAnims[i].textY,
                  }}
                >
                  <span className="about-eyebrow" style={{ color: f.color }}>
                    {f.role}
                  </span>
                  <h2 className="about-title">{f.name}</h2>
                  <p className="about-paragraph">{f.desc}</p>
                </motion.div>
              ))}
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
