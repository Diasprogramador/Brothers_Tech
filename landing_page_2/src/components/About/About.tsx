import './About.css';
import { useReveal } from '../../hooks/useReveal';
import { useTilt } from '../../hooks/useTilt';
import avatarCaio from '../../assets/founders/avatar-caio.png';
import avatarSanderson from '../../assets/founders/avatar-sanderson.png';

export const About = () => {
  const sectionRef = useReveal<HTMLDivElement>({ animation: 'fadeUp' });
  const cardTiltRef = useTilt<HTMLDivElement>({ max: 6, perspective: 1400 });

  return (
    <section id="sobre" className="about">
      <div className="about-container" ref={sectionRef}>
        <span className="about-label">Sobre Nós</span>

        <div className="about-card" ref={cardTiltRef}>
          <div className="about-avatars" data-reveal-child>
            <img
              src={avatarCaio}
              alt="Caio — cofundador da Brothers Tech"
              className="about-avatar"
              loading="lazy"
            />
            <img
              src={avatarSanderson}
              alt="Sanderson — cofundador da Brothers Tech"
              className="about-avatar"
              loading="lazy"
            />
          </div>
          <span className="about-platform" aria-hidden="true" />
          <div className="about-names" data-reveal-child>
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
