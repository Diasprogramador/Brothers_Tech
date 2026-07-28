import { useEffect, useRef, useState } from 'react';

/**
 * Gerencia estado e acessibilidade do menu mobile.
 * - Toggle via botão burger
 * - Fecha em ESC
 * - Fecha ao clicar em qualquer link
 * - Fecha se redimensionar para desktop (≥860px)
 * - Trava o scroll do body enquanto aberto
 */
export function useMobileMenu() {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      document.body.style.overflow = '';
      burgerRef.current?.focus();
      return;
    }
    document.body.style.overflow = 'hidden';
    const firstLink = menuRef.current?.querySelector<HTMLAnchorElement>('a');
    firstLink?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  // fecha se redimensionar para desktop
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 860px)');
    const onChange = (e: MediaQueryListEvent) => {
      if (e.matches) setOpen(false);
    };
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  return { open, setOpen, burgerRef, menuRef };
}
