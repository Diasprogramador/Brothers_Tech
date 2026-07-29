import { HERO_LETTERS } from "./letterData";
import { AnimatedLetter } from "./AnimatedLetter";
import "./HeroTitle.css";

/**
 * HeroTitle — título animado "BROTHERS / TECH" com letras SVG individuais
 * Cada letra anima stroke-drawing no hover/touch.
 */
export const HeroTitle = () => {
  // Agrupa as letras nas duas linhas
  const brothersLetters = HERO_LETTERS.slice(0, 8); // B R O T H E R S
  const techLetters = HERO_LETTERS.slice(8); // T E C H

  return (
    <div className="hero-title" aria-label="Brothers Tech">
      <div className="hero-title__line hero-title__line--brothers">
        {brothersLetters.map((letter, index) => (
          <AnimatedLetter
            key={`brothers-${letter.char}-${index}`}
            filledPath={letter.filledPath}
            strokePath={letter.strokePath}
            viewBox={letter.viewBox}
            delay={index * 0.05} // stagger suave
            color={letter.color}
            label={`Letra ${letter.char}`}
          />
        ))}
      </div>
      <div className="hero-title__line hero-title__line--tech">
        {techLetters.map((letter, index) => (
          <AnimatedLetter
            key={`tech-${letter.char}-${index}`}
            filledPath={letter.filledPath}
            strokePath={letter.strokePath}
            viewBox={letter.viewBox}
            delay={index * 0.05}
            color={letter.color}
            label={`Letra ${letter.char}`}
          />
        ))}
      </div>
    </div>
  );
};