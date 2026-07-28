import "./Projetos.css";

export const Projetos = () => {
  return (
    <section id="projetos">
      <div className="wrap">
        <div className="section-head reveal-right">
          <div className="section-eyebrow">
            <span className="n">02</span> — trabalhos
          </div>
          <h2>Projetos recentes</h2>
          <p>
            A Brothers Tech acabou de nascer — esses são os espaços reservados
            para os primeiros projetos que vamos entregar.
          </p>
        </div>

        <div className="projects-grid reveal">
          <div className="project-card">
            <div className="project-thumb">
              <span>em breve</span>
            </div>
            <div className="project-body">
              <h4>Projeto 01</h4>
              <p>sistema · em produção</p>
            </div>
          </div>
          <div className="project-card">
            <div className="project-thumb">
              <span>em breve</span>
            </div>
            <div className="project-body">
              <h4>Projeto 02</h4>
              <p>app · em produção</p>
            </div>
          </div>
          <div className="project-card">
            <div className="project-thumb">
              <span>em breve</span>
            </div>
            <div className="project-body">
              <h4>Projeto 03</h4>
              <p>site · em produção</p>
            </div>
          </div>
        </div>

        <div className="projects-note reveal">
          <span className="dot"></span>
          <span className="mono">
            Quer ser o primeiro case da Brothers Tech? Fale com a gente na seção
            de contato.
          </span>
        </div>
      </div>
    </section>
  );
};
