import './Contact.css';

export const Contact = () => {
  return (
    <section id="contato" className="contact">
      <div className="contact-container">
        <h2 className="contact-title">Contato</h2>
        <div className="contact-content">
          <form className="contact-form">
            <input type="text" placeholder="Nome" />
            <input type="email" placeholder="E-mail" />
            <textarea placeholder="Mensagem" rows={4}></textarea>
            <button type="submit">Enviar</button>
          </form>
          <div className="contact-links">
            <a href="mailto:contato@brothertech.dev">contato@brothertech.dev</a>
            <a href="#">@brother_tech</a>
          </div>
        </div>
      </div>
    </section>
  );
}
