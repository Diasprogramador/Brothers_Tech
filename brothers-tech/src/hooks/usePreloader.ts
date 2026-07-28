import { useEffect, useState } from 'react';

/**
 * Controla a tela de preloader com timing de 3s.
 * Devolve:
 * - `visible`  -> se o preloader deve estar montado
 * - `complete` -> se o preloader terminou (true após ~2.6s ou ao carregar tudo)
 *
 * O fade-out (~350ms) e remoção do DOM (~900ms) são gerenciados em CSS
 * via classes `.is-complete` e `.is-done` aplicadas em sequência.
 */
export function usePreloader(): { visible: boolean; complete: boolean } {
  const [visible, setVisible] = useState(true);
  const [complete, setComplete] = useState(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const TOTAL_MS = 3000;
    const LAST_LETTER_DELAY = 120 + 11 * 180 + 520; // ~2.6s

    let done = false;
    const completeNow = () => {
      if (done) return;
      done = true;
      setComplete(true);
      window.setTimeout(() => setVisible(false), 900);
    };

    // após última letra assentar
    const t1 = window.setTimeout(() => {
      if (document.readyState === 'complete' || prefersReduced) completeNow();
    }, LAST_LETTER_DELAY);
    // garante 3s totais
    const t2 = window.setTimeout(completeNow, TOTAL_MS);
    // fallback se demorar muito
    const t3 = window.setTimeout(completeNow, 5000);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
    };
  }, []);

  return { visible, complete };
}
