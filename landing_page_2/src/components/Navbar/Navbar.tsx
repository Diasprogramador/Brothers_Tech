import { useState, useEffect } from "react";
import "./Navbar.css";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleContactClick = () => {
    document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleLinkClick = (href: string) => {
    const element = document.getElementById(href.replace("#", ""));
    element?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="nav-logo-icon">
        <a href="#home">
          <img src="/assets/logo/Logo_icon.svg" alt="Brothers Tech" />
        </a>
      </div>

      <ul className={`nav-links ${menuOpen ? "is-open" : ""}`}>
        <li>
          <a href="#servicos" onClick={(e) => { e.preventDefault(); handleLinkClick("servicos"); }}>
            Serviços
          </a>
        </li>
        <li>
          <a href="#projetos" onClick={(e) => { e.preventDefault(); handleLinkClick("projetos"); }}>
            Projetos
          </a>
        </li>
        <li>
          <a href="#sobre-nos" onClick={(e) => { e.preventDefault(); handleLinkClick("sobre-nos"); }}>
            Sobre Nós
          </a>
        </li>
        <li>
          <a href="#contato" onClick={(e) => { e.preventDefault(); handleLinkClick("contato"); }}>
            Contato
          </a>
        </li>
      </ul>

      <div className="nav-button">
        <button onClick={handleContactClick}>Fale Conosco</button>
      </div>

      <button
        className={`nav-toggle ${menuOpen ? "is-open" : ""}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Abrir menu"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {menuOpen && (
        <div className="nav-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </nav>
  );
};