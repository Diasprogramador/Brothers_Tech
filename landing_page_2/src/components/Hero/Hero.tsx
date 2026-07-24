import { useState, useEffect } from "react";
import { Svg } from "./svg/Svg";
import "./Hero.css";

export const Hero = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Formato Svg: */}
      <Svg />

      <section id="home" className="hero">
        <div className="hero-container">
          <nav className={`hero-nav ${scrolled ? "hero-nav--scrolled" : ""}`}>
            <div className="hero-nav-container">
              {/* Logo */}
              <a href="#home" className="hero-nav-logo">
                <img src="/assets/logo/Logo.svg" alt="Brothers Tech" />
              </a>

              {/* Lista ds Links */}
              <ul className="hero-nav-links">
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
                  <a href="#sobre">Sobre Nós</a>
                </li>
                <li>
                  <a href="#contato">Contato</a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </>
  );
};
