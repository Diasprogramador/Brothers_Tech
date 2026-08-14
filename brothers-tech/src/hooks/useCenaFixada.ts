import { useEffect, useRef } from "react";

/**
 * useCenaFixada — progresso de rolagem de uma seção "pinada".
 *
 * A seção tem altura de N x 100vh e um palco `position: sticky` dentro (ver
 * cenas.css). Este hook devolve, a cada quadro, o progresso 0..1 da rolagem
 * dentro dessa seção e chama `aplicar(p)`.
 *
 * Ele também adiciona a classe `cena--pronta` na seção. Enquanto ela não
 * existe, o CSS mostra o conteúdo em fluxo normal — então uma falha de script
 * ou um navegador sem suporte nunca deixa a tela preta.
 *
 * Regras de performance:
 * - um único requestAnimationFrame por seção, e só enquanto a seção está na
 *   tela (IntersectionObserver liga/desliga o loop);
 * - `aplicar` só escreve transform/opacity/clip-path — nada que gere layout;
 * - `prefers-reduced-motion` desliga o loop e aplica o estado final uma vez.
 */
export function useCenaFixada(
  ref: React.RefObject<HTMLElement | null>,
  aplicar: (p: number) => void,
) {
  const aplicarRef = useRef(aplicar);
  useEffect(() => {
    aplicarRef.current = aplicar;
  }, [aplicar]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduzido) {
      aplicarRef.current(1);
      return;
    }

    // só pina depois que sabemos que o script está rodando
    el.classList.add("cena--pronta");

    let raf = 0;
    let rodando = false;

    const loop = () => {
      raf = requestAnimationFrame(loop);
      const vao = el.offsetHeight - window.innerHeight;
      if (vao <= 0) {
        aplicarRef.current(0);
        return;
      }
      const p = Math.min(1, Math.max(0, -el.getBoundingClientRect().top / vao));
      aplicarRef.current(p);
    };

    const io = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting && !rodando) {
          rodando = true;
          raf = requestAnimationFrame(loop);
        } else if (!entrada.isIntersecting && rodando) {
          rodando = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(el);

    // primeiro quadro imediato: o palco já entra no estado certo
    aplicarRef.current(0);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      el.classList.remove("cena--pronta");
    };
  }, [ref]);
}

/* utilitários de curva usados pelas cenas */
export const trava01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const suave = (t: number) => t * t * (3 - 2 * t);
export const trecho = (p: number, a: number, b: number) => trava01((p - a) / (b - a));
