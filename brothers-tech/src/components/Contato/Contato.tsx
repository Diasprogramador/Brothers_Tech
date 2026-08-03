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
            <a href="mailto:brothers.tech.237@gmail.com" className="btn-primary">
              Enviar e-mail →
            </a>
            <a
              href="https://wa.me/5531972037820"
              className="btn-ghost"
              rel="noopener"
            >
              Chamar no WhatsApp
            </a>
          </div>
          <ul className="contact-channels" role="list">
            <li>
              <a href="mailto:brothers.tech.237@gmail.com" className="channel">
                <span className="dot green" aria-hidden="true"></span>
                brothers.tech.237@gmail.com
              </a>
            </li>
            <li>
              <a href="https://www.instagram.com/_brothers.tech" className="channel" target="_blank" rel="noopener noreferrer">
                <span className="dot orange" aria-hidden="true"></span>
                @_brothers.tech
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};
