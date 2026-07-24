import './Contact.css';
import { useReveal } from '../../hooks/useReveal';
import { useTilt } from '../../hooks/useTilt';

export const Contact = () => {
  const titleRef = useReveal<HTMLDivElement>({ animation: 'fadeUp' });
  const formRef = useReveal<HTMLDivElement>({ animation: 'fadeRight', delay: 0.1 });
  const sideRef = useReveal<HTMLDivElement>({ animation: 'fadeLeft', delay: 0.2 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const btn = (e.currentTarget as HTMLFormElement).querySelector('button');
    if (btn) {
      btn.textContent = '✓ Enviado!';
      btn.setAttribute('data-sent', 'true');
      setTimeout(() => {
        btn.textContent = 'Enviar';
        btn.removeAttribute('data-sent');
        (e.currentTarget as HTMLFormElement).reset();
      }, 2000);
    }
  };

  return (
    <section id="contato" className="contact">
      <div className="contact-container">
        <div ref={titleRef} className="contact-head">
          <span className="section-eyebrow">Fale com a gente</span>
          <h2 className="contact-title">Contato</h2>
        </div>
        <div className="contact-content">
          <div ref={formRef} className="contact-form-wrap">
            <form className="contact-form" onSubmit={handleSubmit}>
              <label className="field">
                <span className="field-label">Nome</span>
                <input type="text" name="nome" required placeholder="Seu nome" />
              </label>
              <label className="field">
                <span className="field-label">E-mail</span>
                <input type="email" name="email" required placeholder="voce@email.com" />
              </label>
              <label className="field">
                <span className="field-label">Mensagem</span>
                <textarea name="mensagem" rows={4} required placeholder="Conte sobre o projeto"></textarea>
              </label>
              <button type="submit" className="contact-submit">Enviar</button>
            </form>
          </div>

          <div ref={sideRef} className="contact-side">
            <ContactLink icon="✉" label="E-mail" value="contato@brothertech.dev" href="mailto:contato@brothertech.dev" />
            <ContactLink icon="@" label="Instagram" value="@brother_tech" href="#" />
            <ContactLink icon="⌥" label="GitHub" value="/brothers-tech" href="#" />
            <ContactLink icon="in" label="LinkedIn" value="/brothers-tech" href="#" />
          </div>
        </div>
      </div>
    </section>
  );
};

function ContactLink({ icon, label, value, href }: { icon: string; label: string; value: string; href: string }) {
  const tiltRef = useTilt<HTMLAnchorElement>({ max: 8, scale: 1.04 });
  return (
    <a href={href} className="contact-link" ref={tiltRef}>
      <span className="contact-link-icon" aria-hidden="true">{icon}</span>
      <span className="contact-link-text">
        <span className="contact-link-label">{label}</span>
        <span className="contact-link-value">{value}</span>
      </span>
    </a>
  );
}
