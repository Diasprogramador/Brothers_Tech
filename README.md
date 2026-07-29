# Brothers Tech

> Estúdio de dois irmãos que constrói sistemas, apps, sites e softwares sob medida — do primeiro rascunho ao produto no ar.

Site institucional da Brothers Tech: [`brothers-tech.dev`](https://brothers-tech.dev) (em desenvolvimento).
Fundada em **23.07.2026** por Sanderson & Caio, co-fundadores.

---

## Stack

- **React 19** + **TypeScript 6** — componentes funcionais com hooks
- **Vite 8** — build e dev server
- **Framer Motion 12** — animações da Hero, Sobre (scroll-driven), e RevealObserver
- **GSAP 3** + **Lenis** — smooth scroll e timeline do preloader
- **CSS3** com design tokens (variáveis CSS) — mobile-first, breakpoints `380 / 560 / 768 / 860 / 1100 / 1400`
- Fontes via Google Fonts (Space Grotesk / Inter / IBM Plex Mono)
- ESLint + TypeScript strict (`tsc --noEmit` em CI local)

Single-page application com code organization em `/brothers-tech/src/components/<Section>/`.

---

## Como rodar localmente

```bash
# Entrar no diretório da SPA
cd brothers-tech

# Instalar dependências
npm install

# Dev server (hot reload)
npm run dev
# → http://localhost:5173

# Build de produção
npm run build

# Lint
npm run lint
```

Bundle de produção: ~440 kB raw / ~146 kB gzip (single chunk).

---

## Estrutura

```
.
└── brothers-tech/          # SPA React + Vite + TS (fonte de verdade atual)
    ├── public/
    │   ├── assets/         # Avatares, hero-title.png, logos
    │   ├── favicon.svg     # Logo "BTH" otimizado
    │   ├── robots.txt      # SEO
    │   ├── sitemap.xml     # SEO
    │   └── site.webmanifest  # PWA metadata
    ├── src/
    │   ├── App.tsx         # Root: Navbar → Hero → Serviços → Projetos → Sobre → Contato → Footer
    │   ├── main.tsx        # Vite entry
    │   ├── index.css       # Design tokens + globals + reveal animations + about-premium
    │   ├── components/
    │   │   ├── Navbar/         # Header fixo com scroll state + menu mobile
    │   │   ├── Preloader/      # GSAP timeline (BROTHERS → TECH stroke-draw → fill)
    │   │   ├── Hero/           # Hero estática (PNG) + avatares parallax
    │   │   ├── Servicos/       # 4-card grid com reveal on scroll
    │   │   ├── Projetos/       # 3 cases com hover/tap expansion
    │   │   ├── About/          # Scroll-driven sticky + framer-motion (avatar transitions)
    │   │   ├── Contato/        # CTA box em fundo escuro
    │   │   ├── Footer/         # Brand + nav + tag
    │   │   └── CustomCursor/   # Cursor customizado (desktop)
    │   ├── hooks/              # usePreloader, useReveal, useRevealObserver
    │   └── providers/          # SmoothScroll (Lenis)
    └── package.json
```

### Seções do site

| Âncora      | Componente  | Descrição                                            |
| ----------- | ----------- | ---------------------------------------------------- |
| —           | `Preloader` | Animação BROTHERS → TECH em SVG stroke-draw          |
| —           | `Navbar`    | Fixo, com menu mobile fullscreen + ARIA              |
| `#home`     | `Hero`      | Logo PNG + avatares dos fundadores + tags            |
| `#servicos` | `Servicos`  | Grid de 4 frentes (Sistemas, Apps, Sites, Softwares) |
| `#projetos` | `Projetos`  | Grid de 3 cases com hover/tap → reveal detalhes      |
| `#sobre`    | `About`     | Scroll-driven sticky com transição de avatares       |
| `#contato`  | `Contato`   | CTA box em fundo escuro                              |
| —           | `Footer`    | Copyright + nav + tagline                            |

---

## Identidade visual

### Paleta

Tokens CSS definidos em `:root` (`brothers-tech/src/index.css`). As cores da marca são três acentos sobre uma base cinza-quase-branco:

| Token             | Hex       | Uso                            |
| ----------------- | --------- | ------------------------------ |
| `--green`         | `#4F8A66` | Acento principal (Sistemas)    |
| `--green-soft`    | `#6FA889` | Variação clara                 |
| `--orange`        | `#C4723F` | Acento secundário (Apps)       |
| `--orange-soft`   | `#E08C57` | Variação clara                 |
| `--blue`          | `#4068A1` | Acento terciário (Sites)       |
| `--blue-soft`     | `#6A8CC0` | Variação clara                 |
| `--bg`            | `#E8E8E8` | Background geral               |
| `--surface`       | `#F2F2F2` | Superfícies elevadas           |
| `--line`          | `#C0C0C0` | Bordas sutis                   |
| `--ink`           | `#161616` | Texto principal                |
| `--ink-muted`     | `#3F3F3F` | Texto secundário               |
| `--ink-dim`       | `#6B6B6B` | Texto terciário / labels       |
| `--paper`         | `#FFFFFF` | Cards de destaque              |
| `--on-dark`       | `#FFFFFF` | Texto sobre fundo escuro       |
| `--on-dark-muted` | `#C8C8C8` | Texto muted sobre fundo escuro |
| `--on-dark-dim`   | `#8A8A8A` | Labels sobre fundo escuro      |

### Tipografia

- **Display / títulos**: `Space Grotesk` — peso 400/500/600/700
- **Corpo**: `Inter` — peso 400/500/600
- **Mono / labels / eyebrows**: `IBM Plex Mono` — peso 400/500/600

### Espaçamento & raios

- Escala: `--s-1` (4px) → `--s-12` (96px) com progressão geométrica
- Raios: `--r-sm` 8px · `--r-md` 14px · `--r-lg` 20px · `--r-xl` 28px · `--r-pill` 999px

### Movimento

- `--ease-out-expo`: `cubic-bezier(0.16, 1, 0.3, 1)` — entradas de página
- `--ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)` — micro-interações com leve overshoot
- Durações: `--dur-fast` 180ms · `--dur-normal` 320ms · `--dur-slow` 640ms · `--dur-reveal` 900ms
- `prefers-reduced-motion: reduce` desativa reveals e suaviza transições

### Breakpoints mobile-first

```
380px  → safety net (≤380px block em todos componentes)
560px  → tablet pequeno
768px  → tablet
860px  → desktop
1100px → desktop amplo
1400px → telas muito largas (cap de altura em avatares, 4 col em serviços)
```

---

## Co-fundadores

- **Sanderson** — ponte entre o que o cliente precisa e o que é construído; do primeiro papo à entrega final.
- **Caio** — mãos no código: arquitetura, integrações, e a parte técnica que faz tudo funcionar nos bastidores.

Cada projeto passa pelos dois, do escopo ao deploy. Sem camadas, sem intermediários.

---

## Branches

- `main` — produção (estável). Igual à `dev-Sanderson` após merge.
- `dev-Sanderson` — branch do Sanderson (este repo).
- `dev-Caio` — branch do Caio, sincronizada periodicamente com `dev-Sanderson`.

Trabalho novo entra em `dev-*` e só vai para `main` depois de revisão.

---

## Status

- [x] Preloader com stroke-draw animation (GSAP)
- [x] Hero estática + avatares com parallax sutil
- [x] Navbar fixo com scroll state + menu mobile fullscreen + ARIA
- [x] Serviços: grid 4-col responsivo com reveal on scroll
- [x] Projetos: 3 cases com hover/tap expansion revelando tech stack
- [x] Sobre: scroll-driven sticky + transição de avatares (lego / normal / pixel)
- [x] Contato: CTA em fundo escuro com canais de contato
- [x] Mobile-first responsivo (380 / 560 / 768 / 860 / 1100 / 1400)
- [x] SEO: Open Graph + Twitter Card + canonical + robots + sitemap
- [x] PWA: site.webmanifest + favicon.svg
- [x] iOS hardening: safe-area-inset, overscroll-behavior, scroll-padding-top responsivo
- [x] Acessibilidade: ARIA, focus-visible, prefers-reduced-motion, tap targets 44px+

---

## Licença

© 2026 Brothers Tech — todos os direitos reservados.
Construído por dois irmãos, um código de cada vez.
