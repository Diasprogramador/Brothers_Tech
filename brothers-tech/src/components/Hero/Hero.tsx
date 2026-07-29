import { useEffect, useRef } from "react";
import { HeroTitle } from "../HeroTitle";
import "./Hero.css";

export const Hero = () => {
  const heroRef = useRef<HTMLElement>(null);

  // ---------- Parallax sutil nos avatares (joystick no mouse) ----------
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const finePointer =
      window.matchMedia("(pointer: fine)").matches &&
      window.innerWidth >= 860;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!finePointer || prefersReducedMotion) return;

    const avatars = hero.querySelectorAll<HTMLImageElement>(
      ".hero-avatars .avatar-img",
    );
    if (!avatars.length) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      avatars.forEach((img, i) => {
        const depth = (i + 1) * 6; // avatar 2 reage mais
        img.style.setProperty("--px", `${x * depth}px`);
        img.style.setProperty("--py", `${y * depth}px`);
      });
    };

    hero.addEventListener("mousemove", handleMouseMove);
    return () => hero.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="hero" id="home" ref={heroRef}>
      <div className="wrap">
        <HeroTitle />
        <div className="hero-avatars" aria-hidden="true">
          <div className="avatar-item">
            <img
              className="avatar-img"
              src="assets/sanderson_hero.svg"
              alt=""
              width="170"
              height="512"
              loading="eager"
              decoding="async"
            />
          </div>
          <div className="avatar-item">
            <img
              className="avatar-img"
              src="assets/caio_hero.svg"
              alt=""
              width="170"
              height="512"
              loading="eager"
              decoding="async"
            />
          </div>
        </div>

        <div className="hero-legend" aria-label="Áreas de atuação">
          <div className="legend-name">Sanderson & Caio</div>
          <div className="legend-role mono">
            co-fundadores · brothers-tech.dev
          </div>
        </div>

        <div className="hero-tags">
          <span className="tag">
            <span className="dot green" aria-hidden="true"></span>Sistemas
          </span>
          <span className="tag">
            <span className="dot orange" aria-hidden="true"></span>Apps
          </span>
          <span className="tag">
            <span className="dot blue" aria-hidden="true"></span>Sites
          </span>
          <span className="tag">
            <span className="dot green" aria-hidden="true"></span>Softwares
          </span>
        </div>
      </div>
    </section>
  );
};
