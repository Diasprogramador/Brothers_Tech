import './Services.css';

export const Services = () => {
  return (
    <section id="servicos" className="services">
      <div className="services-container">
        <h2 className="services-title">Serviços</h2>
        <div className="services-grid">
          {/* Cards de serviços serão adicionados aqui */}
          <div className="service-card">Sistemas</div>
          <div className="service-card">Apps</div>
          <div className="service-card">Sites</div>
          <div className="service-card">Softwares</div>
        </div>
      </div>
    </section>
  );
}
