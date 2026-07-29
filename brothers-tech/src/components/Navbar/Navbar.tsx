import { useState, useEffect, useRef, useCallback } from "react";
import "./Navbar.css";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // ---------- Header scroll state (com requestAnimationFrame para performance) ----------
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };

    // checa estado inicial
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ---------- Focus trap no menu mobile (a11y) ----------
  useEffect(() => {
    if (!menuOpen) return;

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !menuRef.current) return;

      const focusable = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTab);
    return () => document.removeEventListener("keydown", handleTab);
  }, [menuOpen]);

  // ---------- Mobile menu: fechar com ESC e resize ----------
  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    document.body.style.overflow = "";
    // devolve foco ao burger
    burgerRef.current?.focus();
  }, []);

  const toggleMenu = useCallback(() => {
    setMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        // abrir: foco vai para o primeiro link após o mount
        requestAnimationFrame(() => {
          const firstLink = menuRef.current?.querySelector("a");
          firstLink?.focus();
        });
      } else {
        // fechar: devolve foco ao burger
        burgerRef.current?.focus();
      }
      return next;
    });
  }, []);

  // Bloqueia scroll do body quando menu abre, e restaura ao fechar
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.overscrollBehavior = "contain";
      document.body.style.touchAction = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
      document.body.style.touchAction = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.body.style.overscrollBehavior = "";
      document.body.style.touchAction = "";
    };
  }, [menuOpen]);

  // ESC fecha o menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        closeMenu();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  // Fecha ao redimensionar para desktop
  useEffect(() => {
    const mql = window.matchMedia("(min-width: 860px)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && menuOpen) closeMenu();
    };
    mql.addEventListener("change", handleChange);
    return () => mql.removeEventListener("change", handleChange);
  }, [menuOpen, closeMenu]);

  return (
    <>
      <header id="site-header" className={scrolled ? "scrolled" : ""}>
        <div className="nav">
          <a
            href="#home"
            className="logo"
            aria-label="Brothers Tech — ir para o início"
          >
            <img
              src="assets/logo_icon.svg"
              alt="Brothers Tech"
              width="120"
              height="32"
            />
          </a>
          <nav aria-label="Navegação principal">
            <ul>
              <li>
                <a href="#home">Home</a>
              </li>
              <li>
                <a href="#servicos">Serviços</a>
              </li>
              <li>
                <a href="#projetos">Projetos</a>
              </li>
              <li>
                <a href="#sobre">Sobre nós</a>
              </li>
            </ul>
          </nav>
          <a href="#contato" className="nav-cta">
            Fale com a gente
          </a>
          <button
            ref={burgerRef}
            className="burger"
            id="burger"
            type="button"
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="mobileMenu"
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div
        ref={menuRef}
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        id="mobileMenu"
        role="dialog"
        aria-modal={menuOpen}
        aria-label="Menu de navegação"
        aria-hidden={!menuOpen}
      >
        <a href="#home" onClick={closeMenu}>
          Home
        </a>
        <a href="#servicos" onClick={closeMenu}>
          Serviços
        </a>
        <a href="#projetos" onClick={closeMenu}>
          Projetos
        </a>
        <a href="#sobre" onClick={closeMenu}>
          Sobre nós
        </a>
        <a href="#contato" className="mobile-menu-cta" onClick={closeMenu}>
          Fale com a gente
        </a>
      </div>
    </>
  );
};
