import { useMemo, useState } from "react";
import "./Contato.css";

const WHATSAPP = "5531972037820";
const EMAIL = "brothers.tech.237@gmail.com";

const TIPOS = ["Sistema", "App", "Site", "Software"] as const;

const PRAZOS = [
  { rotulo: "sem pressa", frase: "sem pressa" },
  { rotulo: "1–2 meses", frase: "para os próximos 1 a 2 meses" },
  { rotulo: "urgente", frase: "com urgência" },
] as const;

/**
 * CONTATO — montador de recado.
 * O visitante escolhe o que precisa e o prazo; a mensagem se escreve sozinha e
 * os links de WhatsApp/e-mail já saem preenchidos. Acento único (verde, o
 * principal da marca) em vez de uma cor por tipo de serviço — com os quatro
 * chips escolhidos ao mesmo tempo, cada um puxando o brilho do card, o
 * contador e o botão pra uma cor diferente, o card virava um mosaico.
 */
export const Contato = () => {
  const [tipos, setTipos] = useState<string[]>([]);
  const [prazo, setPrazo] = useState(1);
  const [copiado, setCopiado] = useState(false);

  const mensagem = useMemo(() => {
    const n = tipos.length;
    const lista =
      n === 0
        ? "um projeto"
        : n === 1
          ? `um ${tipos[0].toLowerCase()}`
          : `${tipos.slice(0, -1).map((t) => t.toLowerCase()).join(", ")} e ${tipos[n - 1].toLowerCase()}`;
    return `Oi, Brothers Tech! Preciso de ${lista}, ${PRAZOS[prazo].frase}. Podem me passar um plano?`;
  }, [tipos, prazo]);

  const alternar = (nome: string) =>
    setTipos((atual) =>
      atual.includes(nome) ? atual.filter((t) => t !== nome) : [...atual, nome],
    );

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } finally {
      setCopiado(true);
      window.setTimeout(() => setCopiado(false), 1800);
    }
  };

  return (
    <section className="contato" id="contato">
      <div className="contato-brilho" aria-hidden="true" />
      <div className="container">
        <div className="contato-grid">
          <div className="contato-chamada">
            <div className="section-eyebrow">
              <span className="n">04</span> — contato
            </div>
            <h2>
              <span className="linha"><span>Bora tirar seu</span></span>
              <span className="linha"><span>projeto do papel?</span></span>
            </h2>
            <p>Monte o recado em dois toques — a gente responde com escopo, prazo e preço.</p>
            <div className="contato-selos">
              <span className="mono"><i className="ponto" />resposta em até 24h</span>
              <span className="mono">orçamento sem compromisso</span>
            </div>
          </div>

          <div className="contato-card">
            <div className="contato-card__brilho" aria-hidden="true" />

            <fieldset className="contato-campo">
              <legend className="contato-campo__rotulo mono">
                o que você precisa
                <span className="contato-campo__conta">
                  {tipos.length === 0
                    ? "nenhum"
                    : tipos.length === 1
                      ? "1 escolhido"
                      : `${tipos.length} escolhidos`}
                </span>
              </legend>
              <div className="contato-chips">
                {TIPOS.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className="contato-chip"
                    aria-pressed={tipos.includes(t)}
                    onClick={() => alternar(t)}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="contato-campo">
              <legend className="contato-campo__rotulo mono">prazo</legend>
              <div className="contato-seg" data-ativo={prazo}>
                <span className="contato-seg__ind" aria-hidden="true" />
                {PRAZOS.map((p, i) => (
                  <button
                    key={p.rotulo}
                    type="button"
                    aria-pressed={prazo === i}
                    onClick={() => setPrazo(i)}
                  >
                    {p.rotulo}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="contato-campo">
              <span className="contato-campo__rotulo mono">seu recado</span>
              <p className="contato-preview mono">{mensagem}</p>
            </div>

            <div className="contato-acoes">
              <a
                className="contato-acoes__wa"
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(mensagem)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Enviar no WhatsApp →
              </a>
              <a
                className="contato-acoes__mail"
                href={`mailto:${EMAIL}?subject=${encodeURIComponent("Projeto — Brothers Tech")}&body=${encodeURIComponent(mensagem)}`}
              >
                Mandar e-mail
              </a>
            </div>

            <div className="contato-rodape">
              <button type="button" className="contato-pill" onClick={copiar}>
                {copiado ? "copiado ✓" : "copiar e-mail"}
              </button>
              <a
                className="contato-pill"
                href="https://www.instagram.com/_brothers.tech"
                target="_blank"
                rel="noopener noreferrer"
              >
                @_brothers.tech
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
