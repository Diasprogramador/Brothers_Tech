import { lazy, Suspense, useEffect, useRef, useState } from "react";

/**
 * O About é a seção mais pesada do site (3 imagens por fundador + o CSS de
 * animação). O Lighthouse mobile mostrou 1,77s de "element render delay" no
 * avatar do Hero — o main thread ficava ocupado processando TODAS as seções
 * de uma vez no mount inicial, About incluído, mesmo estando fora da tela.
 *
 * `lazy()` tira o conteúdo pesado do bundle principal, e o
 * IntersectionObserver abaixo só pede esse chunk quando a seção se aproxima
 * da tela — mesma técnica usada para a maquete 3D no site irmão deste
 * projeto.
 */
const AboutContent = lazy(() =>
  import("./AboutContent").then((m) => ({ default: m.AboutContent })),
);

function useProximoDaTela<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  // App é 100% client-side (sem SSR), então checar `IntersectionObserver`
  // já no estado inicial é seguro — evita ter que corrigir via setState
  // síncrono dentro do efeito só pra esse caso extremo.
  const [proximo, setProximo] = useState(
    () => typeof IntersectionObserver === "undefined",
  );

  useEffect(() => {
    if (proximo) return;
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) {
          setProximo(true);
          obs.disconnect();
        }
      },
      { rootMargin: "600px" },
    );
    obs.observe(el);

    // Rede de segurança: em aba de segundo plano o observer pode não disparar.
    const prazo = window.setTimeout(() => {
      setProximo(true);
      obs.disconnect();
    }, 3000);

    return () => {
      obs.disconnect();
      clearTimeout(prazo);
    };
  }, [proximo]);

  return { ref, proximo };
}

export const About = () => {
  const { ref, proximo } = useProximoDaTela<HTMLDivElement>();

  return (
    <div ref={ref} className="about-placeholder-wrap">
      {proximo ? (
        <Suspense fallback={<div className="about-placeholder" aria-hidden="true" />}>
          <AboutContent />
        </Suspense>
      ) : (
        <div className="about-placeholder" aria-hidden="true" />
      )}
    </div>
  );
};
