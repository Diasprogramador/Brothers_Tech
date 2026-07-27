# Brothers Tech

> Estúdio de dois irmãos que constrói sistemas, apps, sites e softwares sob medida — do primeiro rascunho ao produto no ar.

Site institucional da Brothers Tech: [`brothers-tech.dev`](https://brothers-tech.dev) (em desenvolvimento).
Fundada em **23.07.2026** por Sanderson & Caio, co-fundadores.

---

## Stack

- **HTML5** semântico
- **CSS3** com design tokens (variáveis CSS) — mobile-first, responsivo até ~1140px
- **JavaScript** vanilla (ES2020+, sem libs externas, sem build step)
- Fontes via Google Fonts (Space Grotesk / Inter / IBM Plex Mono)
- Hospedagem recomendada: qualquer static host (GitHub Pages, Netlify, Vercel, Cloudflare Pages)

Sem React, sem bundler, sem dependências. O site abre direto do `index.html`.

---

## Como rodar localmente

Nenhum setup necessário.

```bash
# Opção 1 — abrir direto no navegador
open index.html         # macOS
xdg-open index.html     # Linux
start index.html        # Windows

# Opção 2 — servidor estático (recomendado, evita CORS em alguns navegadores)
python -m http.server 8080
# ou
npx serve .
```

Depois: <http://localhost:8080>

---

## Estrutura

```
.
├── index.html               # Markup das seções (Home, Serviços, Projetos, Sobre, Contato)
├── style.css                # Design tokens + componentes + animações
├── script.js                # Header scroll, menu mobile, IntersectionObserver (reveal)
├── assets/
│   ├── logo.svg             # Logo principal
│   ├── avatar_Sanderson.svg # Avatar SVG (sobre)
│   ├── avatar_Caio.svg      # Avatar SVG (sobre)
│   ├── avatar_2_*.svg       # Avatares "sticker" do hero
│   ├── avatar-*-clean.png   # Avatares PNG com alpha (rembg)
│   └── avatar-*.png         # Avatares PNG originais
└── base_para_preloader/     # Referência antiga em React (marcada para remoção)
```

### Seções do site

| Âncora       | Seção   | Conteúdo                                             |
|--------------|---------|------------------------------------------------------|
| `#home`      | Hero    | Headline, sub, avatares dos fundadores, tags          |
| `#servicos`  | Serviços | 4 frentes: Sistemas, Apps, Sites, Softwares          |
| `#projetos`  | Projetos | Grid de cases (placeholders — "em breve")            |
| `#sobre`     | Sobre   | Cards dos fundadores + história + tag de fundação    |
| `#contato`   | Contato | CTA, e-mail, WhatsApp, canais                         |

---

## Identidade visual

### Paleta

Tokens CSS definidos em `:root` (`style.css`). As cores da marca são três acentos sobre uma base cinza-quase-branco:

| Token            | Hex       | Uso                                       |
|------------------|-----------|-------------------------------------------|
| `--green`        | `#4F8A66` | Acento principal (hero, tag "Sistemas")   |
| `--green-soft`   | `#6FA889` | Variação clara                            |
| `--orange`       | `#C4723F` | Acento secundário (tag "Apps")            |
| `--orange-soft`  | `#E08C57` | Variação clara                            |
| `--blue`         | `#4068A1` | Acento terciário (tag "Sites")            |
| `--blue-soft`    | `#6A8CC0` | Variação clara                            |
| `--bg`           | `#E8E8E8` | Background geral                          |
| `--surface`      | `#F2F2F2` | Superfícies elevadas                      |
| `--line`         | `#C0C0C0` | Bordas sutis                              |
| `--ink`          | `#161616` | Texto principal                           |
| `--ink-muted`    | `#3F3F3F` | Texto secundário                          |
| `--ink-dim`      | `#6B6B6B` | Texto terciário / labels                  |
| `--paper`        | `#FFFFFF` | Cards de destaque                         |
| `--on-dark`      | `#FFFFFF` | Texto sobre fundo escuro                  |
| `--on-dark-muted`| `#C8C8C8` | Texto muted sobre fundo escuro            |
| `--on-dark-dim`  | `#8A8A8A` | Labels sobre fundo escuro                 |

### Tipografia

- **Display / títulos**: `Space Grotesk` — `Space Grotesk`, sans-serif
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

---

## Co-fundadores

- **Sanderson** — ponte entre o que o cliente precisa e o que é construído; do primeiro papo à entrega final.
- **Caio** — mãos no código: arquitetura, integrações, e a parte técnica que faz tudo funcionar nos bastidores.

Cada projeto passa pelos dois, do escopo ao deploy. Sem camadas, sem intermediários.

---

## Branches

- `main` — produção (estável)
- `dev-Sanderson` — branch de Sanderson (este repo)
- `dev-Caio` — branch do Caio

Trabalho novo entra em `dev-*` e só vai para `main` depois de merge de ambos os lados e revisão.

---

## Status

- [x] Estrutura base (HTML + CSS + JS fragmentados)
- [x] Hero, Serviços, Projetos, Sobre, Contato
- [x] Header com scroll state + menu mobile acessível (ARIA, ESC, focus trap)
- [x] IntersectionObserver para reveals
- [x] Avatares com chroma-key / alpha nativo
- [x] Mobile-first + acessibilidade (`prefers-reduced-motion`, ARIA)
- [ ] **Preloader GSAP** — em produção pelo dev-Caio; será mergeado em `dev-Sanderson` em commit futuro. Implementação original (React) preservada em `base_para_preloader/`.

---

## Licença

© 2026 Brothers Tech — todos os direitos reservados.
Construído por dois irmãos, um código de cada vez.
