import { useRef } from "react";
import { usePreloader } from "./hooks/usePreloader";
import { useReveal } from "./hooks/useReveal";

import { Navbar } from "./components/Navbar/Navbar";
import { Preloader } from "./components/Preloader/Preloader";
import { Hero } from "./components/Hero/Hero";
import { Servicos } from "./components/Servicos/Servicos";
import { Projetos } from "./components/Projetos/Projetos";
import { Sobre } from "./components/Sobre/Sobre";
import { Contato } from "./components/Contato/Contato";
import { Footer } from "./components/Footer/Footer";
import { CustomCursor } from "./components/CustomCursor/CustomCursor";

import { SmoothScroll } from "./providers/SmoothScroll";

export const App = () => {
  const { isPreloading, onComplete } = usePreloader();
  const mainRef = useRef<HTMLDivElement>(null);
  useReveal(mainRef);

  return (
    <>
      {isPreloading && <Preloader onComplete={onComplete} />}
      <a href="#main" className="skip-link">
        Pular para o conteúdo
      </a>
      {!isPreloading && (
        <div className="scroll-progress" aria-hidden="true" />
      )}
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
          <Sobre />
          <Contato />
          <Footer />
        </SmoothScroll>
      </div>
      <CustomCursor />
    </>
  );
};
