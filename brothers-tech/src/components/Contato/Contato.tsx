import "./Contato.css";

export const Contato = () => {
  return (
    <section id="contato">
      <div className="wrap">
        <div className="contact-box reveal-scale">
          <h2>Bora tirar seu projeto do papel?</h2>
          <p>
            Conta pra gente o que você precisa — sistema, app, site ou software
            — e a gente volta com um plano.
          </p>
          <div className="contact-actions">
            <a href="mailto:contato@brothertech.dev" className="btn-primary">
              Enviar e-mail →
            </a>
            <a
              href="https://wa.me/55SEUNUMERO"
              className="btn-ghost"
              rel="noopener"
            >
              Chamar no WhatsApp
            </a>
          </div>
          <ul className="contact-channels" role="list">
            <li>
              <a href="mailto:contato@brothertech.dev" className="channel">
                <span className="dot green" aria-hidden="true"></span>
                contato@brothertech.dev
              </a>
            </li>
            <li>
              <a href="#" className="channel">
                <span className="dot orange" aria-hidden="true"></span>
                @brothers_tech
              </a>
            </li>
            <li>
              <a href="#" className="channel">
                <span className="dot blue" aria-hidden="true"></span>
                github.com/brothers-tech
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
