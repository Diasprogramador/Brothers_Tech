import { useEffect, useState } from 'react'
import Preloader from './components/Preloader'
import CustomCursor from './components/CustomCursor'
import Navbar from './components/Navbar'

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isLoaded) {
      // Reveal animations via IntersectionObserver
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('in')
              observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
      )
      document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }
  }, [isLoaded])

  return (
    <>
      <Preloader onComplete={() => setIsLoaded(true)} />
      <CustomCursor />
      <div style={{ opacity: isLoaded ? 1 : 0, transition: 'opacity 500ms var(--ease-out-expo)' }}>
        <Navbar />
        <main>
          <Hero />
          <Services />
          <About />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}

/* ===== SEED DATA ===== */
const SERVICES = [
  { num: '01', title: 'Web Development', desc: 'Sites e aplicações web modernos e performáticos.', for: 'Para empresas e startups' },
  { num: '02', title: 'Mobile Design', desc: 'Interfaces mobile-first com foco em usabilidade.', for: 'Para apps e landing pages' },
  { num: '03', title: 'UX/UI Design', desc: 'Design de interfaces nível Awwwards, foco em conversão.', for: 'Para produtos digitais' },
]

const FOUNDERS = [
  { role: 'Co-fundador', name: 'Sanderson', desc: 'Desenvolvedor full-stack, apaixonado por arquiteturas performáticas e design detail.', img: '/assets/avatar-sanderson-clean.png' },
  { role: 'Co-fundador', name: 'Caio', desc: 'Designer dev, focado em interfaces de alto nível e micro-interações.', img: '/assets/avatar-caio-clean.png' },
]

/* ===== COMPONENTS ===== */
function Hero() {
  return (
    <section className="hero" id="hero" style={{
      minHeight: '100svh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 'calc(var(--s-12) + 40px) 0 var(--s-10)', position: 'relative', background: 'var(--bg)'
    }}>
      <div className="wrap" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 'var(--s-8)' }}>
        <div className="hero-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 680 }}>
          <span className="eyebrow" style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-eyebrow)', fontWeight: 500,
            marginBottom: 'var(--s-5)', display: 'inline-flex', alignItems: 'center', gap: 'var(--s-2)',
            background: 'rgba(255,255,255,.6)', padding: '8px 16px', borderRadius: 'var(--r-pill)', border: '1px solid var(--line-soft)'
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)' }} />
            Brothers Tech · Studio
          </span>
          <h1 className="hero-title reveal" style={{
            fontSize: 'var(--text-hero)', lineHeight: 0.92, fontWeight: 700, textTransform: 'uppercase'
          }}>
            Código limpo<br />design <span style={{ color: 'var(--green)' }}>impecável</span>
          </h1>
          <p className="hero-sub reveal" style={{
            marginTop: 'var(--s-5)', maxWidth: 560, color: 'var(--ink-muted)', fontSize: 'clamp(1rem, 1.4vw, 1.1875rem)'
          }}>
            Somos dois irmãos unindo engenharia de software e design de alto nível
            para construir experiências digitais que impressionam.
          </p>
        </div>

        <div className="hero-avatars reveal" style={{ display: 'flex', gap: 'var(--s-6)', alignItems: 'flex-end', justifyContent: 'center' }}>
          {FOUNDERS.map((f) => (
            <div key={f.name} className="avatar-item" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <img src={f.img} alt={f.name} style={{
                height: 'clamp(220px, 38vh, 360px)', objectFit: 'contain', objectPosition: 'center bottom',
                filter: 'drop-shadow(0 22px 32px rgba(0,0,0,.15))'
              }} />
            </div>
          ))}
        </div>

        <div className="hero-legend reveal" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--s-1)' }}>
          <span className="legend-name" style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.0625rem' }}>
            Sanderson & Caio
          </span>
          <span className="legend-role" style={{ fontSize: 'var(--text-eyebrow)', color: 'var(--ink-dim)' }}>
            co-fundadores
          </span>
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="servicos" className="reveal" style={{ background: '#1F1F1F', padding: 'var(--s-12) 0' }}>
      <div className="wrap">
        <div className="section-head" style={{ marginBottom: 'var(--s-8)' }}>
          <span className="section-eyebrow" style={{
            fontFamily: 'var(--font-mono)', color: 'var(--on-dark-dim)', fontSize: 'var(--text-eyebrow)'
          }}>
            <span style={{ color: 'var(--on-dark)' }}>02</span> — Serviços
          </span>
          <h2 style={{ color: 'var(--on-dark)', fontSize: 'var(--text-h2)' }}>O que fazemos</h2>
        </div>
        <div className="services-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1,
          background: '#2E2E2E', borderRadius: 'var(--r-lg)', overflow: 'hidden'
        }}>
          {SERVICES.map((s) => (
            <div key={s.num} className="service-card" style={{
              background: '#1F1F1F', padding: 'var(--s-6) var(--s-5)', transition: 'background var(--dur-normal) var(--ease-out-expo)'
            }}>
              <span className="num" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--on-dark)', fontWeight: 600
              }}>{s.num}</span>
              <h3 style={{ color: 'var(--on-dark)', fontSize: 'var(--text-h3)', margin: 'var(--s-3) 0' }}>{s.title}</h3>
              <p style={{ color: 'var(--on-dark-muted)', fontSize: 'var(--text-body)' }}>{s.desc}</p>
              <span className="for" style={{
                marginTop: 'var(--s-5)', display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--on-dark-dim)'
              }}>{s.for}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="sobre" className="reveal" style={{ background: '#5C5C5C', padding: 'var(--s-12) 0' }}>
      <div className="wrap">
        <div className="section-head" style={{ marginBottom: 'var(--s-8)' }}>
          <span className="section-eyebrow" style={{
            fontFamily: 'var(--font-mono)', color: '#BDBDBD', fontSize: 'var(--text-eyebrow)'
          }}>
            <span style={{ color: 'var(--on-dark)' }}>03</span> — Sobre
          </span>
          <h2 style={{ color: 'var(--on-dark)', fontSize: 'var(--text-h2)' }}>Os irmãos por trás do código</h2>
        </div>
        <div className="about-grid" style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 1,
          background: '#6E6E6E', borderRadius: 'var(--r-lg)', overflow: 'hidden'
        }}>
          {FOUNDERS.map((f) => (
            <div key={f.name} className="founder" style={{ padding: 'var(--s-8) var(--s-6)', background: '#5C5C5C' }}>
              <img src={f.img} alt={f.name} style={{
                width: 'clamp(90px, 22vw, 130px)', marginBottom: 'var(--s-4)',
                filter: 'drop-shadow(0 12px 24px rgba(0,0,0,.3))'
              }} />
              <span className="role" style={{
                fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--on-dark)'
              }}>{f.role}</span>
              <h3 style={{ color: 'var(--on-dark)', fontSize: 'var(--text-h3)', margin: 'var(--s-3) 0' }}>{f.name}</h3>
              <p style={{ color: '#D8D8D8', fontSize: 'var(--text-body)' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section id="contato" className="reveal" style={{ background: '#484848', padding: 'var(--s-12) 0 var(--s-10)' }}>
      <div className="wrap">
        <div className="contact-box" style={{
          background: '#3A3A3A', border: '1px solid #5A5A5A', borderRadius: 'var(--r-xl)',
          padding: 'clamp(var(--s-8), 10vw, var(--s-12)) clamp(var(--s-5), 6vw, var(--s-10))',
          textAlign: 'center', boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{
            color: 'var(--on-dark)', fontSize: 'clamp(1.75rem, 5vw, 3rem)', maxWidth: 680, margin: '0 auto'
          }}>Vamos construir algo memorável?</h2>
          <p style={{
            color: 'var(--on-dark-muted)', marginTop: 'var(--s-4)', maxWidth: 480, margin: 'var(--s-4) auto 0'
          }}>Entre em contato e descubra como podemos elevar o seu projeto ao próximo nível.</p>
          <div style={{
            display: 'flex', gap: 'var(--s-3)', justifyContent: 'center', marginTop: 'var(--s-8)', flexWrap: 'wrap'
          }}>
            <a href="mailto:contato@brotherstech.dev" style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 500,
              background: 'var(--paper)', color: '#2A2A2A', padding: '14px 26px', borderRadius: 'var(--r-pill)',
              transition: 'transform var(--dur-normal) var(--ease-spring)'
            }}>Iniciar conversa</a>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)', padding: 'var(--s-6) 0', background: 'var(--bg)' }}>
      <div className="wrap" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--s-2)' }}>
        <span className="footer-brand" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
          Brothers Tech © {new Date().getFullYear()}
        </span>
        <span className="footer-tag" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6875rem', color: 'var(--ink-dim)' }}>
          Feito com <span style={{ color: 'var(--orange)' }}>♥</span> em React
        </span>
      </div>
    </footer>
  )
}
