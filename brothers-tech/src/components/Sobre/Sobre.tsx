import "./Sobre.css";

export const Sobre = () => {
  return (
    <section id="sobre">
      <div className="wrap">
        <div className="section-head reveal-left">
          <div className="section-eyebrow">
            <span className="n">03</span> — quem faz
          </div>
          <h2>Sobre nós</h2>
          <p>
            A Brothers Tech nasceu de uma parceria simples: dois irmãos que
            gostam de resolver problemas com código.
          </p>
        </div>

        <div className="about-grid reveal-scale">
          <div className="founder">
            <img
              className="founder-avatar-img"
              src="assets/sanderson_avatar.svg"
              alt=""
              width="120"
              height="360"
              loading="lazy"
              decoding="async"
            />
            <div className="role mono">co-fundador</div>
            <h3>Sanderson</h3>
            <p>
              Cuida da ponte entre o que o cliente precisa e o que a gente
              constrói — do primeiro papo até a entrega final.
            </p>
          </div>
          <div className="founder">
            <img
              className="founder-avatar-img"
              src="assets/caio_avatar.svg"
              alt=""
              width="120"
              height="360"
              loading="lazy"
              decoding="async"
            />
            <div className="role mono">co-fundador</div>
            <h3>Caio</h3>
            <p>
              Põe a mão no código: arquitetura, integrações e a parte técnica
              que faz tudo funcionar nos bastidores.
            </p>
          </div>
        </div>

        <p className="about-story reveal">
          Somos uma dupla pequena de propósito —
          <strong>sem camadas, sem intermediários</strong>. Cada projeto passa
          pelas mãos dos dois fundadores, do escopo ao deploy. É esse o nosso
          jeito de garantir padrão e cuidado em cada entrega.
        </p>

        <div className="founded-tag reveal">
          <span className="dot green"></span>
          fundada em 23.07.2026
        </div>
      </div>
    </section>
  );
};
