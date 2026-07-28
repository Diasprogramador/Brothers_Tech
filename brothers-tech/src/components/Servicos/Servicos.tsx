import "./Servicos.css";

export const Servicos = () => {
  return (
    <section id="servicos">
      <div className="wrap">
        <div className="section-head reveal-left">
          <div className="section-eyebrow">
            <span className="n">01</span> — o que fazemos
          </div>
          <h2>Quatro frentes, um mesmo padrão de qualidade.</h2>
          <p>
            Cada projeto passa pela mesma régua: escopo claro, prazos combinados
            e entrega que funciona de verdade.
          </p>
        </div>

        <div className="services-grid reveal-scale">
          <div className="service-card">
            <div className="num mono">01</div>
            <h3>Sistemas</h3>
            <p>
              Plataformas sob medida para organizar processos internos, integrar
              áreas e tirar planilhas soltas da equação.
            </p>
            <div className="for mono">→ gestão, automação, integração</div>
          </div>
          <div className="service-card">
            <div className="num mono">02</div>
            <h3>Apps</h3>
            <p>
              Aplicativos mobile pensados do fluxo do usuário para trás — nada
              de tela bonita que ninguém sabe usar.
            </p>
            <div className="for mono">→ iOS, Android, multiplataforma</div>
          </div>
          <div className="service-card">
            <div className="num mono">03</div>
            <h3>Sites</h3>
            <p>
              Presença digital rápida, responsiva e fácil de manter — do
              institucional simples ao e-commerce completo.
            </p>
            <div className="for mono">→ institucional, landing page, loja</div>
          </div>
          <div className="service-card">
            <div className="num mono">04</div>
            <h3>Softwares</h3>
            <p>
              Ferramentas específicas para um problema específico do seu
              negócio, feitas sob encomenda.
            </p>
            <div className="for mono">
              → automação, ferramentas internas, APIs
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
