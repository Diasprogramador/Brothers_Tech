import './Footer.css';

export const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-logo">
          <img src="/assets/logo/Logo.svg" alt="Brothers Tech" />
        </div>
        <nav className="footer-nav">
          <a href="#home">Home</a>
          <a href="#servicos">Serviços</a>
          <a href="#projetos">Projetos</a>
          <a href="#sobre">Sobre Nós</a>
          <a href="#contato">Contato</a>
        </nav>
        <div className="footer-social">
          <a href="#">GitHub</a>
          <a href="#">Instagram</a>
          <a href="#">LinkedIn</a>
        </div>
        <p className="footer-copyright">
          © 2026 Brothers Tech. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
