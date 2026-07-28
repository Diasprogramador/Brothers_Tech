import { StrictMode } from 'react';
import SectionHeader from '../components/ui/SectionHeader';
import styles from '../components/ui/SectionHeader.module.css';

export default function App() {
  return (
    <>
      {/* HERO */}
      <section className="hero" id="home">
        <div className="wrap">
          <div className="hero-content">
            <div className="eyebrow mono">estúdio de desenvolvimento</div>
            <h1 className="hero-title">
              BROTHERS
              <br />
              <span className="accent">TECH</span>
            </h1>
            <p className="hero-sub">
              Construímos sistemas, apps, sites e softwares sob medida — do primeiro rascunho ao
              produto no ar.
            </p>
            <div className="hero-actions">
              <a href="#contato" className="btn-primary">Iniciar projeto →</a>
              <a href="#servicos" className="btn-ghost">Serviços</a>
            </div>
          </div>

          <div className="hero-avatars" aria-hidden="true">
            <div className="avatar-item">
              <img
                className="avatar-img"
                src="/assets/avatar-sanderson-clean.png"
                alt=""
                width={170}
                height={512}
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="avatar-item">
              <img
                className="avatar-img"
                src="/assets/avatar-caio-clean.png"
                alt=""
                width={170}
                height={512}
                loading="eager"
                decoding="async"
              />
            </div>
          </div>

          <div className="hero-legend" aria-label="Áreas de atuação">
            <div className="legend-name">Sanderson & Caio</div>
            <div className="legend-role mono">co-fundadores · brothers-tech.dev</div>
          </div>

          <div className="hero-tags">
            <span class="tag">
              <span class="dot green" aria-hidden="true"></span>Sistemas
            </span>
            <span class="tag">
              <span class="dot orange" aria-hidden="true"></span>Apps
            </span>
            <span class="tag">
              <span class="dot blue" aria-hidden="true"></span>Sites
            </span>
            <span class="tag">
              <span class="dot green" aria-hidden="true"></span>Softwares
            </span>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="servicos">
        <div className="wrap">
          <SectionHeader
            num="01"
            eyebrow="o que fazemos"
            title="Quatro frentes, um mesmo padrão de qualidade."
            description="Cada projeto passa pela mesma régu...
          />
          {/* Content below would be rendered by a ServicesGrid component, omitted for brevity */}
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projetos">
        <div className="wrap">
          <SectionHeader
            num="02"
            eyebrow="trabalhos"
            title="Projetos recentes"
            description="Projetos recentes" />
          {/* ProjectsGrid omitted for brevity */}
        </div>
      </section>

      {/* ABOUT */}
      <section id="sobre">
        <div className="wrap">
          <SectionHeader
            num="03"
            eyebrow="quem faz"
            title="Sobre nós" />
          {/* AboutGrid omitted for brevity */}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contato">
        <div className="wrap contact-box">
          <h2>Bora tirar seu projeto do papel?</h2>
          <p>Conta pra gente o que você precisa — sistema, app, site ou software — e a gente volta com um plano.</p>
          <div className="contact-actions">
            <a href="mailto:contato@brothertech.dev" className="btn-primary">Enviar e‑mail →</a>
            <a href="https://wa.me/55SEUNUMERO" className="btn-ghost" rel="noopener">
              Chamar no WhatsApp
            </a>
          </div>
          <ul className="contact-channels" role="list">
            <li>
              <a href="mailto:contato@brothertech.dev" className="channel">
                <span class="dot green" aria-hidden="true"></span>contato@brothertech.dev
              </a>
            </li>
            <li>
              <a href="#" className="channel">
                <span class="dot orange" aria-hidden="true"></span>@brothers_tech
              </a>
            </li>
            <li>
              <a href="#" className="channel">
                <span class="dot blue" aria-hidden="true"></span>github.com/brothers-tech
              </a>
            </li>
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer>
        <div className="wrap footer-row" aria-label="Footer">
          <p className="footer-brand">© 2026 Brothers Tech</p>
          <p className="footer-tag">feito por dois irmãos, um código de cada vez</p>
        </div>
      </footer>
    </>
  );
}