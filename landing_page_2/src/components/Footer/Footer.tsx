import './Footer.css';
import { useReveal } from '../../hooks/useReveal';
import logoUrl from '../../assets/logo/Logo.svg';

export const Footer = () => {
  const ref = useReveal<HTMLElement>({ animation: 'fadeIn', duration: 1 });

  return (
    <footer className="footer" ref={ref}>
      <div className="footer-container">
        <div className="footer-brand">
          <img src={logoUrl} alt="Brothers Tech" className="footer-logo" />
          <p className="footer-tagline">Transformando ideias em produtos digitais.</p>
        </div>
        <nav className="footer-nav">
          <a href="#home">Home</a>
          <a href="#servicos">Serviços</a>
          <a href="#projetos">Projetos</a>
          <a href="#sobre">Sobre Nós</a>
          <a href="#contato">Contato</a>
        </nav>
        <div className="footer-social">
          <SocialLink href="#" label="GitHub" glyph="⌥" />
          <SocialLink href="#" label="Instagram" glyph=" @" />
          <SocialLink href="#" label="LinkedIn" glyph="in" />
        </div>
        <div className="footer-divider" />
        <p className="footer-copyright">
          © 2026 Brothers Tech. Todos os direitos reservados.
        </p>
        <a href="#home" className="footer-backtop">↑ Voltar ao topo</a>
      </div>
    </footer>
  );
};

function SocialLink({ href, label, glyph }: { href: string; label: string; glyph: string }) {
  return (
    <a href={href} className="footer-social-link" aria-label={label} title={label}>
      <span aria-hidden="true">{glyph}</span>
    </a>
  );
}
