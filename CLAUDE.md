# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Idioma

O projeto é todo em português: comentários, mensagens de commit, textos de UI e até
identificadores no código das cenas (`aplicar`, `cena`, `trava01`, `suave`, `trecho`,
`palco`, `veu`). Escreva novo código no mesmo idioma.

## Comandos

O código-fonte fica em `brothers-tech/` — **todos os comandos npm rodam de lá**, não da raiz.

```bash
cd brothers-tech
npm install
npm run dev      # Vite dev server → http://localhost:5173
npm run build    # tsc -b && vite build (o TypeScript é verificado no build)
npm run lint     # ESLint 10 + typescript-eslint
npm run preview  # serve o dist/
```

**Não existe suíte de testes.** A verificação antes de considerar algo pronto é
`npm run build` (que inclui a checagem de tipos) e `npm run lint`, ambos passando limpos.
Mudança visual precisa ser conferida no navegador, incluindo largura de celular.

## Arquitetura

SPA React 19 sem roteador, servida com Vite. `App.tsx` compõe as seções numa ordem fixa
(Navbar → Hero → Serviços → Projetos → Sobre → Contato → Footer) e a navegação é por
âncoras (`#home`, `#servicos`, `#projetos`, `#sobre`, `#contato`). Cada componente vive em
`src/components/<Secao>/` com o CSS ao lado, importado pelo próprio `.tsx`. Não há backend:
o Contato monta um texto e usa deep links `wa.me`/`mailto:` para WhatsApp e e-mail — nada é
enviado por API própria.

### Cenas fixadas (scroll-telling)

É o mecanismo central do site e o que exige ler mais de um arquivo para entender:

- `src/styles/cenas.css` define a base compartilhada: `.cena` é uma seção alta
  (250vh–350vh) e `.cena__palco` é um `position: sticky` de 100vh dentro dela. A rolagem
  dentro da seção alta vira o tempo da animação.
- `src/hooks/useCenaFixada.ts` recebe um ref da seção e uma função `aplicar(p)`, chamada a
  cada quadro com o progresso `0..1`. Um único `requestAnimationFrame` por cena, ligado e
  desligado por `IntersectionObserver` — a cena fora da tela não gasta quadro.
- `aplicar` só pode escrever `transform`, `opacity`, `filter` e `clip-path` diretamente no
  DOM via refs. Nada que gere layout. Veja `Hero.tsx` como referência: o cabeçalho do
  componente documenta as faixas de progresso de cada movimento.
- Os utilitários de curva (`trava01`, `suave`, `trecho`) vêm do mesmo módulo do hook.
- O hook só adiciona a classe `cena--pronta` **depois** de montar. Enquanto ela não existe,
  o CSS mostra o conteúdo em fluxo normal — falha de script nunca deixa tela preta.
- `prefers-reduced-motion` desliga o loop, aplica o estado final uma vez e transforma cada
  palco em bloco normal.
- Componentes que usam o hook: `Hero.tsx`, `Servicos.tsx`, `Projetos.tsx` e
  `About/AboutContent.tsx` (os dois avatares dos fundadores, lado a lado).

### Regra de compatibilidade de CSS (não quebre isto)

Aprendida com dois bugs em Motorola/WebView antigo (commits `a843e7d` e `90be176`): uma
unidade não suportada dentro de `clamp()` faz o navegador **descartar a declaração
inteira** — o padding vai a zero, a seção colapsa e a tela fica preta.

Portanto: a base usa apenas `px`, `%`, `vw` e `vh`. `svh`, `cqh`/`cqw` e container queries
entram **somente** dentro de `@supports`, como melhoria opcional. Breakpoints via `@media`,
não via container query na camada base. `color-mix()` também é evitado pelo mesmo motivo
(ver comentário no topo de `Contato.tsx`, que pré-calcula as variantes translúcidas de cada
cor em vez de gerar via `color-mix()`).

A `.scroll-progress` em `index.css` é a exceção que ainda não segue essa regra: usa
`animation-timeline: scroll(root)`, uma scroll-driven animation nativa sem fallback nem
`@supports`. Em navegador sem suporte a `animation-timeline` a regra é ignorada e a barra
simplesmente não anima (fica com `scaleX(0)`) — não colapsa layout, mas é um ponto a
revisar se decidir dar suporte formal a navegadores mais antigos.

### Animação: três bibliotecas com papéis distintos

- **Rolagem/cenas** — código próprio (`useCenaFixada`), sem biblioteca.
- **Framer Motion** — usado no About. `App.tsx` envolve tudo em
  `<MotionConfig reducedMotion="user">` porque animações via `useScroll`/`useTransform`
  rodam em JS e escapam do bloco global `@media (prefers-reduced-motion: reduce)` do
  `index.css`, que só zera CSS.
- **GSAP** — só a timeline do preloader (`components/Preloader/preloaderAnimation.ts`).
- **Lenis** (`providers/SmoothScroll.tsx`) — smooth scroll ligado apenas em
  `(pointer: fine) and (min-width: 860px)` e desligado com movimento reduzido. No toque,
  suavizar por JS mata o momentum nativo; mesmo critério usado pelo `CustomCursor`.

### Reveal on scroll

Sistema separado das cenas: classes `.reveal`, `.reveal-left`, `.reveal-right`,
`.reveal-scale` no markup; `useReveal(mainRef)` (chamado uma vez em `App.tsx`) adiciona
`.in` quando o elemento entra na viewport. Atraso individual por `data-delay` em ms.

### Carregamento

- `usePreloader` controla `isPreloading`; o conteúdo só ganha opacidade depois.
- O About é code-split (`React.lazy`) e o chunk só é pedido quando a seção se aproxima
  (`rootMargin: 600px`), com timeout de 3s como rede de segurança para aba em segundo
  plano. Motivo: os SVGs/AVIFs de avatar são pesados e travavam o main thread no mount.

### Design tokens

Tudo em `:root` no `src/index.css` — cores, escala de espaçamento (`--s-1`…`--s-12`),
raios, easings e durações. Não escreva hex ou ms solto em CSS de componente; use os
tokens. Layout é mobile-first com breakpoints `380 / 560 / 768 / 860 / 1100 / 1400`.

## Documentos do repositório

- `README.md` — paleta completa com hex e uso de cada token, tipografia, easings, mapa das
  seções e convenção de branches. Consulte antes de introduzir cor ou fonte nova.
- `PLANO-3D-MOBILE.md` — documento de análise datado de 11/08/2026 que se declara não
  implementado. **Está parcialmente desatualizado**: as cenas fixadas descritas nele já
  foram implementadas depois. Use como diagnóstico de peso de assets (SVGs de avatar de
  ~1,36 MB, PNGs de projeto de ~4 MB em `public/assets/`), não como estado atual do código
  — hoje esses assets já foram convertidos para `.avif` e estão bem mais leves.

## Branches

`main` é produção. Trabalho novo entra em `dev-Sanderson` ou `dev-Caio` e só vai para
`main` depois de revisão.
