import { Button } from '../ui/Button';
import { NAV_LINKS } from '../../data/content';
import { useHeaderScroll } from '../../hooks/useHeaderScroll';
import { useMobileMenu } from '../../hooks/useMobileMenu';
import { useSmoothScroll } from '../../hooks/useSmoothScroll';
import styles from './Header.module.css';

export function Header() {
  useHeaderScroll(8);
  const { open, setOpen, burgerRef, menuRef } = useMobileMenu();
  const closeMenu = () => setOpen(false);
  useSmoothScroll(closeMenu);

  return (
    <>
      <header id="site-header" className={styles.header}>
        <div className={styles.nav}>
          <a href="#home" className={styles.logo} aria-label="Brothers Tech — ir para o início">
            <img src="/assets/logo.svg" alt="Brothers Tech" width={120} height={32} />
          </a>
          <nav aria-label="Navegação principal">
            <ul className={styles.navList}>
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <Button href="#contato" variant="primary" className={styles.cta}>
            Fale com a gente
          </Button>
          <button
            ref={burgerRef}
            id="burger"
            type="button"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            aria-controls="mobileMenu"
            className={styles.burger}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div
        ref={menuRef}
        id="mobileMenu"
        className={`${styles.mobileMenu} ${open ? styles.mobileMenuOpen : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
      >
        {NAV_LINKS.map((link) => (
          <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
            {link.label}
          </a>
        ))}
        <a href="#contato" className={styles.mobileMenuCta} onClick={() => setOpen(false)}>
          Fale com a gente →
        </a>
      </div>
    </>
  );
}
