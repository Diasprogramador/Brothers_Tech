import { useState, useEffect } from "react";
import "./Navbar.css";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
        <a href="#home" className="navbar-logo">
          <img src="/assets/logo/Logo.svg" alt="Brothers Tech" />
        </a>
        <ul className={`navbar-links ${menuOpen ? "is-open" : ""}`}>
          <li>
            <a href="#servicos" onClick={() => setMenuOpen(false)}>
              Serviços
            </a>
          </li>
          <li>
            <a href="#projetos" onClick={() => setMenuOpen(false)}>
              Projetos
            </a>
          </li>
          <li>
            <a href="#sobre" onClick={() => setMenuOpen(false)}>
              Sobre Nós
            </a>
          </li>
          <li>
            <a href="#contato" onClick={() => setMenuOpen(false)}>
              Contato
            </a>
          </li>
        </ul>

        <div className="navbar-placeholder">
          <h2>Fale Conosco</h2>
        </div>

        <button
          className={`navbar-toggle ${menuOpen ? "is-open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      {menuOpen && (
        <div className="navbar-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};
