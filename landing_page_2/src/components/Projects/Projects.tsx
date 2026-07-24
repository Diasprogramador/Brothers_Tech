import './Projects.css';

export const Projects = () => {
  return (
    <section id="projetos" className="projects">
      <div className="projects-container">
        <h2 className="projects-title">Projetos</h2>
        <div className="projects-grid">
          {/* Cards de projetos serão adicionados aqui */}
          <div className="project-card">
            <div className="project-image">Imagem</div>
            <div className="project-info">
              <h3>Projeto 01</h3>
              <p>Descrição do projeto</p>
            </div>
          </div>
          <div className="project-card">
            <div className="project-image">Imagem</div>
            <div className="project-info">
              <h3>Projeto 02</h3>
              <p>Descrição do projeto</p>
            </div>
          </div>
          <div className="project-card">
            <div className="project-image">Imagem</div>
            <div className="project-info">
              <h3>Projeto 03</h3>
              <p>Descrição do projeto</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
