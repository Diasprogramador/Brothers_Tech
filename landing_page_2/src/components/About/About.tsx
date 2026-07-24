import './About.css';

export const About = () => {
  return (
    <section id="sobre" className="about">
      <div className="about-container">
        <h2 className="about-title">Sobre Nós</h2>
        <div className="about-content">
          <div className="about-frame">
            <svg viewBox="0 0 800 400" className="about-svg">
              {/* Moldura SVG semelhante à Hero */}
              <rect
                x="0"
                y="0"
                width="800"
                height="400"
                rx="40"
                ry="40"
                fill="#161b18"
              />
            </svg>
            <div className="about-inner">
              {/* Personagens ao centro */}
              <div className="about-characters">
                <div className="character">S</div>
                <div className="character">C</div>
              </div>
            </div>
          </div>
          <div className="about-info">
            {/* Informações laterais */}
            <p>Seção em revisão</p>
          </div>
        </div>
      </div>
    </section>
  );
}
