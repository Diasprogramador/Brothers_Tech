import { useRef } from "react";
import { MotionConfig } from "framer-motion";
import { usePreloader } from "./hooks/usePreloader";
import { useReveal } from "./hooks/useReveal";

import { Navbar } from "./components/Navbar/Navbar";
import { Preloader } from "./components/Preloader/Preloader";
import { Hero } from "./components/Hero/Hero";
import { Servicos } from "./components/Servicos/Servicos";
import { Projetos } from "./components/Projetos/Projetos";
import { About } from "./components/About/About";
import { Contato } from "./components/Contato/Contato";
import { Footer } from "./components/Footer/Footer";
import { CustomCursor } from "./components/CustomCursor/CustomCursor";

import { SmoothScroll } from "./providers/SmoothScroll";

export const App = () => {
  const { isPreloading, onComplete } = usePreloader();
  const mainRef = useRef<HTMLDivElement>(null);
  useReveal(mainRef);

  return (
    // As animações do About rodam via useScroll/useTransform (JS), fora do
    // alcance do bloco global @media (prefers-reduced-motion: reduce) em
    // index.css, que só zera animation/transition de CSS. reducedMotion="user"
    // faz o Framer Motion respeitar a preferência do sistema nessas também.
    <MotionConfig reducedMotion="user">
      {isPreloading && <Preloader onComplete={onComplete} />}
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      {!isPreloading && <div className="scroll-progress" aria-hidden="true" />}
      <div
        ref={mainRef}
        id="main"
        style={{
          opacity: isPreloading ? 0 : 1,
          transition: "opacity 0.5s ease",
        }}
      >
        <SmoothScroll>
          <Navbar />
          <Hero />
          <Servicos />
          <Projetos />
          <About />
          <Contato />
          <Footer />
        </SmoothScroll>
      </div>
      <CustomCursor />
    </MotionConfig>
  );
};
