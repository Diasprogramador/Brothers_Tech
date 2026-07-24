import './About.css';
import { useReveal } from '../../hooks/useReveal';
import { useTilt } from '../../hooks/useTilt';
import { useParallax } from '../../hooks/useParallax';
import avatarCaio from '../../assets/founders/avatar-caio.png';
import avatarSanderson from '../../assets/founders/avatar-sanderson.png';

export const About = () => {
  const sectionRef = useReveal<HTMLDivElement>({ animation: 'slideUpBig' });
  const cardTiltRef = useTilt<HTMLDivElement>({ max: 14, perspective: 1100, scale: 1.02 });
  // Parallax real em direções opostas — profundidade 3D óbvia ao rolar
  const leftRef = useParallax<HTMLImageElement>({ amount: -120, axis: 'y' });
  const rightRef = useParallax<HTMLImageElement>({ amount: -200, axis: 'y' });

  return (
    <section id="sobre" className="about">
      <div className="about-container" ref={sectionRef}>
        <span className="about-label">Sobre Nós</span>

        <div className="about-card" ref={cardTiltRef}>
          <div className="about-avatars">
            <img
              src={avatarCaio}
              alt="Caio — cofundador da Brothers Tech"
              className="about-avatar about-avatar--left"
              ref={leftRef}
              loading="lazy"
            />
            <img
              src={avatarSanderson}
              alt="Sanderson — cofundador da Brothers Tech"
              className="about-avatar about-avatar--right"
              ref={rightRef}
              loading="lazy"
            />
          </div>
          <span className="about-platform" aria-hidden="true" />
          <div className="about-names">
            <span>Caio</span>
            <span>Sanderson</span>
          </div>
        </div>

        <p className="about-text">
          Somos a <strong>Brothers Tech</strong> — dois irmãos unidos pela paixão
          de transformar ideias em produtos digitais. Da concepção ao deploy,
          cuidamos de cada detalhe para entregar sistemas, apps e sites que
          performam e encantam.
        </p>
      </div>
    </section>
  );
};
