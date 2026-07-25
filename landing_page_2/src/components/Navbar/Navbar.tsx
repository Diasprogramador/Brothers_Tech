import { useState, useEffect, useMemo, useRef } from "react";
import { buildClipPath, easeInOut } from "../Hero/svg/notchPath";
import "./Navbar.css";

interface NavbarProps {
  pathRef?: React.RefObject<SVGPathElement | null>;
}

const SCROLL_RANGE_RATIO = 0.15;

export const Navbar = ({ pathRef }: NavbarProps) => {
  const [progress, setProgress] = useState(0);
  const scrollRange = useRef(120);
  const prefersReduced = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );

  useEffect(() => {
    const updateRange = () => {
      const isMobile = window.matchMedia("(max-width: 768px)").matches;
      scrollRange.current = isMobile
        ? window.innerHeight * (SCROLL_RANGE_RATIO * 1.5)
        : window.innerHeight * SCROLL_RANGE_RATIO;
    };

    updateRange();

    const update = () => {
      const raw = Math.min(window.scrollY / scrollRange.current, 1);
      const p = prefersReduced ? (raw > 0 ? 1 : 0) : easeInOut(raw);
      setProgress(p);

      if (pathRef && "current" in pathRef && pathRef.current && !prefersReduced) {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        pathRef.current.setAttribute("d", buildClipPath(p, isMobile));
      }
    };

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
        ticking = true;
      }
    };

    const onResize = () => {
      updateRange();
      update();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    update();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [prefersReduced, pathRef]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const id = href.replace("#", "");
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const handleContactClick = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      className="navbar"
      style={{ "--nav-progress": progress } as React.CSSProperties}
    >
      <div className="nav-inner">
        <div className="nav-logo-icon">
          <a href="#home" onClick={(e) => handleNavClick(e, "#home")}>
            <img src="/assets/logo/Logo_icon.svg" alt="Brothers Tech" />
          </a>
        </div>

        <ul>
          <li>
            <a href="#servicos" onClick={(e) => handleNavClick(e, "#servicos")}>
              Serviços
            </a>
          </li>
          <li>
            <a href="#projetos" onClick={(e) => handleNavClick(e, "#projetos")}>
              Projetos
            </a>
          </li>
          <li>
            <a href="#sobre" onClick={(e) => handleNavClick(e, "#sobre")}>
              Sobre Nós
            </a>
          </li>
          <li>
            <a href="#contato" onClick={(e) => handleNavClick(e, "#contato")}>
              Contato
            </a>
          </li>
        </ul>

        <button onClick={handleContactClick}>Fale Conosco</button>
      </div>
    </nav>
  );
};
