import "./Navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="#home" className="navbar-logo">
          <img src="/assets/logo/Logo.svg" alt="Brothers Tech" />
        </a>
        <ul className="navbar-links">
          <li>
            <a href="#home">Home</a>
          </li>
          <li>
            <a href="#servicos">Serviços</a>
          </li>
          <li>
            <a href="#projetos">Projetos</a>
          </li>
          <li>
            <a href="#sobre">Sobre Nós</a>
          </li>
          <li>
            <a href="#contato">Contato</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};
