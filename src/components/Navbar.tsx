import { useEffect, useState } from 'react'

const NAV_LINKS = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Sobre', href: '#sobre' },
  { label: 'Contato', href: '#contato' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    // Close menu on resize to desktop
    const mql = window.matchMedia('(min-width: 860px)')
    const handler = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
  }, [menuOpen])

  return (
    <header className={scrolled ? 'scrolled' : ''} id="site-header">
      <div className="nav">
        <a href="#hero" className="logo">
          <img src="/assets/logo.svg" alt="Brothers Tech" />
        </a>

        <nav className="nav-links" aria-label="Navegação principal" style={{ display: 'none' }}>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>{link.label}</a>
          ))}
          <a
            href="#contato"
            className="nav-cta"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', fontWeight: 500,
              color: 'var(--paper)', background: 'var(--ink)', padding: '10px 18px',
              borderRadius: 'var(--r-pill)'
            }}
          >Contato</a>
        </nav>

        <button
          className="burger"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', gap: 5, width: 44, height: 44,
            position: 'relative', zIndex: 60
          }}
        >
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--ink)' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--ink)' }} />
          <span style={{ display: 'block', width: 22, height: 2, background: 'var(--ink)' }} />
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-menu open" style={{
          position: 'fixed', inset: 0, zIndex: 55, background: 'var(--bg)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 'clamp(var(--s-6), 8vh, var(--s-12))'
        }}>
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 7vw, 2.5rem)',
                fontWeight: 500, color: 'var(--ink)', letterSpacing: '-0.02em'
              }}
            >{link.label}</a>
          ))}
        </div>
      )}
    </header>
  )
}
