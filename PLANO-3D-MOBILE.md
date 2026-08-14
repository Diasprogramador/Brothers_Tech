# Brothers Tech — Plano: cenas 3D, animações Awwwards e mobile-first

**Data:** 11/08/2026 · **Branch:** `main` · **Escopo:** `brothers-tech/`

Documento de análise e planejamento. **Nada foi implementado.**

> Nota de contexto: existe um documento com o mesmo nome no projeto `site-ferrorama-3d`.
> São projetos diferentes. Este aqui é o site da empresa.

---

## Parte 1 — Análise do código atual

### 1.1 O que já está bem feito

Este projeto está num nível bem acima do Ferrorama. Vale registrar o que **não** precisa mexer:

- **Já é mobile-first de verdade.** 15 das 20 media queries são `min-width` (a base é o
  celular, o desktop é o incremento). As `max-width` são só ajustes de telas pequenas
  (380px/360px). Essa é a direção certa.
- `npm run build` roda `tsc -b && vite build` — **o TypeScript é verificado**. Build passa.
- `npm run lint` (ESLint 10 + typescript-eslint) passa limpo.
- Menu mobile com `visibility: hidden` quando fechado — os links saem da ordem de foco de
  verdade. Focus trap, ESC, devolução de foco ao burger, `overscroll-behavior: contain`,
  `env(safe-area-inset-*)` e alvos de toque de 44px já estão lá.
- `Projetos.css` já usa `@media (hover: hover) and (pointer: fine)` — o padrão certo.
- `CustomCursor.css` já é gated em `(pointer: fine) and (min-width: 860px)`.
- SEO/meta bem montado: canonical, OG, Twitter Card, manifest, robots, sitemap.
- Skip-link, `prefers-reduced-motion` global, `overflow-x: hidden`, `min-height: 100svh`.

### 1.2 Problemas encontrados

#### 🔴 1 — 1,67 MB baixados no carregamento inicial, quase tudo avatar

Medido na aba de rede, com a página recém-aberta e **sem rolar até o Sobre**:

```
sanderson_avatar_lego.svg    382 KB   ← seção Sobre, invisível no load
caio_avatar_lego.svg         322 KB   ← seção Sobre, invisível no load
sanderson_avatar.svg         196 KB   ← seção Sobre, invisível no load
caio_avatar.svg              184 KB   ← seção Sobre, invisível no load
sanderson_avatar_pixel.svg   160 KB   ← seção Sobre, invisível no load
caio_avatar_pixel.svg        152 KB   ← seção Sobre, invisível no load
sanderson_hero.svg           178 KB
caio_hero.svg                165 KB
                            ───────
                            1,67 MB
```

Os **6 SVGs da seção Sobre (1,36 MB)** são baixados imediatamente, embora o usuário só os
veja depois de rolar mais da metade do site. Nenhum tem `loading="lazy"`.

SVG de 382 KB não é desenho vetorial — é imagem rasterizada convertida em vetor
(auto-trace), com dezenas de milhares de nós de path. É o pior dos dois mundos: o peso de
um bitmap **e** o custo de renderização de um vetor complexo. Num Android intermediário
isso trava a rolagem na seção Sobre, porque o navegador rasteriza 6 SVGs pesados a cada
mudança de opacidade/escala.

#### 🔴 2 — Imagens de projeto de 1,3–1,5 MB cada

```
projeto_cri-arte.png          1,49 MB
projeto_caio-portifolio.png   1,44 MB
projeto_biblioteca-monsa.png  1,28 MB
```

São `loading="lazy"` (bom), mas continuam sendo **4,02 MB de PNG** para três miniaturas.
Sem WebP/AVIF, sem `srcset`, sem redimensionamento. `public/assets/` tem 6,32 MB no total.

#### 🟠 3 — O override mobile do Sobre não funciona (bug confirmado)

`src/index.css:521` tenta congelar a animação do avatar no celular:

```css
.about-avatar-box {
  opacity: 1 !important;
  scale: 1 !important;      /* ← no-op */
}
```

Mas o Framer Motion escreve **`transform: scale(...)`**, não a propriedade `scale`. São
propriedades CSS diferentes. Verificado no navegador com a página aberta abaixo de 900px:

```
inline style     : "z-index: 1; opacity: 0; transform: scale(0.95);"
opacity computado: "1"                          ← o !important funcionou
scale computado  : "1"                          ← propriedade errada, sem efeito
transform computado: "matrix(0.95, 0, 0, 0.95, 0, 0)"   ← a escala continua aplicada
```

Ou seja: o `opacity` foi neutralizado, o `scale` não. O avatar continua sendo escalado pelo
scroll no celular, contra a intenção explícita do código. A correção é
`transform: none !important`.

Isso também é um sinal de que **o comportamento mobile dessa seção nunca foi verificado**.

#### 🟠 4 — A seção Sobre é a única parte desktop-first do site

Todo o resto do CSS é `min-width`. O Sobre é `@media (max-width: 900px)` com nove
`!important` desfazendo o layout de desktop. É justamente a seção mais importante para o
pedido (os avatares) e a única construída ao contrário.

No desktop ela usa `height: 500vh` + `position: sticky` para o scroll-telling. No celular
tudo isso é desligado (`height: auto !important`) e a seção vira uma lista estática — a
experiência boa **só existe no desktop**, que é o oposto do objetivo.

#### 🟠 5 — Não existe `<h1>` em lugar nenhum

`grep -rn "<h1" src/` retorna vazio. O título do Hero é uma **imagem PNG**
(`hero-title.png`) com `alt="Brothers Tech"`.

Para um site de estúdio que depende de ser achado no Google, não ter `<h1>` é perda direta
de ranqueamento. (O único `<h1>` do projeto está dentro do `<noscript>`.)

#### 🟠 6 — Três assets referenciados no HTML não existem

`index.html` e `site.webmanifest` apontam para arquivos que não estão em `public/`:

| Referência | Onde | Existe? |
|---|---|---|
| `/assets/og-image.png` | `og:image`, `twitter:image` | ❌ |
| `/favicon.png` | `<link rel="alternate icon">` | ❌ |
| `/apple-touch-icon.png` | `<link rel="apple-touch-icon">`, manifest | ❌ |

Consequência prática: **o link compartilhado no WhatsApp/Instagram/LinkedIn não mostra
imagem de preview.** Para um site cujo canal principal é o cliente recebendo o link no
celular, isso custa caro.

#### 🟡 7 — 7 dos 9 hooks são código morto

Só `useReveal` e `usePreloader` são importados. Nenhum `.tsx` importa:

```
useRevealObserver   (duplicata literal de useReveal)
useHeroParallax     (o Hero reimplementou o parallax inline)
useCustomCursor     (CustomCursor.tsx não usa)
useHeaderScroll     (Navbar.tsx reimplementou inline)
useMobileMenu       (Navbar.tsx reimplementou inline)
useSmoothScroll     (SmoothScroll.tsx usa Lenis direto)
useReducedMotion    (ninguém usa — ver item 8)
```

Some-se a isso: a pasta `src/styles/` (`index.css` + `tokens.css`, 202 linhas) **não é
importada por ninguém** — `main.tsx` importa `src/index.css`, que é outro arquivo. E
`avatar-caio-clean.png` + `avatar-sanderson-clean.png` (645 KB) não são referenciados.

#### 🟡 8 — `prefers-reduced-motion` não cobre o Framer Motion

O bloco global em `src/index.css:226` zera `animation-duration` e `transition-duration`,
o que resolve as animações **de CSS**. Mas as animações do Sobre são inline via
`useScroll`/`useTransform` do Framer Motion — JavaScript, não CSS. Elas continuam rodando.

O hook `useReducedMotion` existe e resolveria isso, mas é código morto (item 7). A forma
idiomática é `<MotionConfig reducedMotion="user">` na raiz.

#### 🟡 9 — Lenis roda no toque também

`SmoothScroll.tsx` instancia o Lenis com `touchMultiplier: 1.5` para todos os dispositivos.
Rolagem suavizada por JS em celular briga com o scroll nativo: perde o momentum do sistema,
adiciona latência ao dedo e conflita com `overscroll-behavior`. A prática comum em sites
premiados é manter o Lenis só em ponteiro fino.

#### ⚪ 10 — Observações menores

- `useBuildFounderAnims` é chamado duas vezes explicitamente (ok), mas o nome sugere hook
  genérico; se algum dia virar `.map()` sobre `FOUNDERS`, quebra as regras de hooks.
- `About.tsx:88` tem um comentário `// (mid removed — was unused)` — resíduo de edição.
- `.about-bg-text` usa `font-size: 25vw` com `white-space: nowrap`; em telas largas o texto
  "BROTHERS TECH" transborda (é `overflow: hidden` no pai, então só corta — intencional,
  mas frágil).

---

## Parte 2 — Estratégia

### 2.1 A ideia central

O site já tem o conceito certo e uma execução boa. O problema é que **a melhor parte dele
só existe no desktop** e **ela pesa 1,4 MB**.

A proposta não é adicionar efeito novo por cima — é **transformar o conceito que já existe
(lego → normal → pixel) na peça 3D central do site**, e fazer isso valer no celular.

Hoje: 6 SVGs de 1,36 MB fazendo cross-fade de opacidade.
Proposta: **dois personagens 3D low-poly** que transitam entre os três estilos de verdade —
geometria lego (blocos), geometria "normal" (suave), geometria pixel (voxel) — dirigidos
pelo scroll, com idle animado e reação ao toque.

Por que isso é a jogada certa aqui:

1. **Resolve o peso.** Dois GLB com Draco/meshopt ficam em ~300–600 KB *no total*, contra
   1,36 MB de SVG — e são carregados sob demanda, não no load inicial.
2. **É o efeito Awwwards de verdade.** Morph de geometria dirigido por scroll é exatamente
   a linguagem desses sites, e ninguém consegue copiar isso de um template.
3. **Reaproveita a identidade que já existe.** Lego/normal/pixel é ideia de vocês e já está
   nos assets — vira 3D, não vira outra coisa.
4. **Funciona no celular.** Um `<canvas>` com dois personagens low-poly é mais barato que
   rasterizar 6 SVGs auto-traced a cada quadro de scroll.

### 2.2 Orçamento de performance (a régua)

Alvo: **Android intermediário em 4G** — é como quase todo cliente de vocês vai abrir.

| Métrica | Hoje | Meta |
|---|---|---|
| Bytes no load inicial | **1,67 MB** + 146 kB JS | < 400 kB total |
| JS inicial (gzip) | 146 kB | < 140 kB (+ chunk 3D sob demanda < 200 kB) |
| `public/assets/` total | 6,32 MB | < 1,5 MB |
| LCP mobile | a medir | < 2,5 s |
| FPS na cena 3D | — | 60 alvo / 30 piso |
| Lighthouse mobile | a medir | ≥ 90 Performance / ≥ 95 A11y |

**Níveis de aparelho** (`lib/desempenho.ts`, a criar): `hardwareConcurrency`,
`deviceMemory`, `(pointer: coarse)` + custo do primeiro quadro → `alto` / `médio` / `baixo`,
controlando dpr, sombras, pós-processamento e se os personagens animam ou ficam em pose.

### 2.3 O que entra e o que não entra no celular

**Entra:** morph 3D dirigido por scroll · revelação de texto por linha · seções fixadas ·
contadores · grão · `clip-path` em imagem · feedback de toque (`whileTap`).

**Fica só no desktop:** cursor customizado (já está gated ✅) · botões magnéticos ·
Lenis (item 9) · parallax de mouse (já está gated ✅) · pós-processamento.

---

## Parte 3 — Avatares

### 3.1 O ponto de partida é bom

Diferente do outro projeto, aqui **os avatares já existem e já animam**: 3 estilos por
fundador, transicionando ao longo do scroll. O conceito está pronto e é bom. O que falta é
(a) peso, (b) funcionar no celular, (c) serem *animados* de verdade e não cross-fade de
imagens estáticas.

### 3.2 Caminho recomendado, em duas etapas

**Etapa A — resgate rápido (sem 3D, ~2 dias).** Entrega valor antes de qualquer modelagem:

1. Otimizar os 6 SVGs (SVGO + simplificação de path). Auto-trace costuma cair 60–80%.
   Se não cair o suficiente, converter para **AVIF/WebP** — são imagens rasterizadas
   disfarçadas de vetor, então o formato certo é raster.
2. `loading="lazy"` + `decoding="async"` nos 6 avatares do Sobre.
3. Corrigir o `transform: none !important` (item 3) e reescrever a seção como mobile-first.
4. Dar ao celular uma versão real do scroll-telling: sticky + `svh`, em vez de desligar tudo.

Só isso já tira ~1,2 MB do load inicial e faz a seção existir no celular.

**Etapa B — os personagens 3D (~6–8 dias).** O diferencial:

5. Modelar Caio e Sanderson em low-poly, nas três variantes (lego / normal / voxel), com
   contagem de vértices compatível entre elas para permitir morph.
6. React Three Fiber + `useScroll` → progresso do morph e da câmera.
7. Idle sutil (respiração, piscar) e reação ao toque/cursor.
8. Degradação: no nível `baixo`, pose estática renderizada uma vez (ou fallback para os
   AVIF da Etapa A).

**Sobre Rive:** alternativa legítima à Etapa B se vocês preferirem 2D — máquina de estados,
personagem reagindo a scroll/toque, ~100 kB de runtime. Mais barato de produzir que 3D,
menos impressionante. Decisão de vocês (pergunta 3 abaixo).

---

## Parte 4 — Plano de execução

### Fase 0 — Correções e limpeza ⏱️ ~1 dia
1. Gerar `og-image.png` (1200×630), `favicon.png`, `apple-touch-icon.png` (item 6) — **maior
   retorno por esforço do documento inteiro**: é o preview do link no WhatsApp.
2. Corrigir `scale: 1 !important` → `transform: none !important` (item 3).
3. `<h1>` real no Hero (pode ficar visualmente escondido atrás da imagem, ou substituir a
   imagem por texto com webfont — ver pergunta 2).
4. Apagar os 7 hooks mortos, a pasta `src/styles/` e os 2 PNGs `-clean` (645 KB).
5. `<MotionConfig reducedMotion="user">` na raiz (item 8).
6. Lenis só em `(pointer: fine)` (item 9).

### Fase 1 — Peso ⏱️ ~1–2 dias
7. Otimizar/converter os 6 avatares do Sobre + 2 do Hero (item 1).
8. Converter os 3 PNGs de projeto para AVIF/WebP com `srcset` (item 2).
9. `loading="lazy"` no que está fora da primeira dobra.
10. Medir com Lighthouse mobile e travar o orçamento da tabela 2.2.

### Fase 2 — Sobre mobile-first ⏱️ ~2 dias
11. Reescrever a seção Sobre começando pelo celular (item 4), com scroll-telling real em
    telas pequenas usando `100svh`.
12. Sistema de revelação único, com fallback (se o observer não disparar em 2s, revela).

### Fase 3 — Personagens 3D ⏱️ ~6–8 dias
13. `lib/desempenho.ts` (níveis).
14. R3F + chunk sob demanda, montando só quando a seção se aproxima.
15. Morph lego → normal → voxel dirigido por scroll.
16. Idle + reação ao toque; degradação por nível.

### Fase 4 — Camada Awwwards ⏱️ ~2–3 dias
17. Revelação de texto por linha, `clip-path` em imagens, contadores, grão.
18. `whileTap` em tudo que é clicável.
19. Guardar os `:hover` restantes (23 regras, só `Projetos.css` está protegido).

### Fase 5 — Verificação ⏱️ ~1 dia
20. Lighthouse mobile com throttling 4G.
21. Aparelho real (Android intermediário + iPhone).
22. A11y: movimento reduzido, foco, contraste, leitor de tela.

---

## Parte 5 — Perguntas antes de começar

Nenhuma bloqueia a Fase 0. As três primeiras bloqueiam a Fase 3.

1. **Modelagem 3D:** vocês têm alguém que modela, ou eu construo os personagens
   proceduralmente em código (geometria low-poly gerada, sem software de modelagem)?
2. **`hero-title.png`:** posso trocar por texto real com webfont (melhor SEO, escala melhor
   no celular, ~9 KB a menos), ou a arte do título é intocável?
3. **3D vs Rive:** personagens 3D (mais impressionante, mais caro) ou personagem 2D animado
   com Rive (mais rápido de produzir)?
4. **`og-image.png`:** vocês têm arte pronta, ou eu gero a partir do logo + avatares?
5. **Fotos:** os avatares atuais são ilustrações. Quer manter só ilustração ou entra foto
   real em algum ponto?

---

## Resumo

| Fase | Dias | Ganho principal |
|---|---|---|
| 0 — Correções e limpeza | ~1 | preview de link volta a funcionar; SEO; bug do mobile |
| 1 — Peso | ~1–2 | 1,67 MB → ~400 kB no load inicial |
| 2 — Sobre mobile-first | ~2 | a melhor seção passa a existir no celular |
| 3 — Personagens 3D | ~6–8 | o diferencial |
| 4 — Camada Awwwards | ~2–3 | acabamento |
| 5 — Verificação | ~1 | garantia |

**Total: ~13–17 dias.** As Fases 0 e 1 somam ~3 dias, não dependem de nenhuma decisão de
vocês, e já resolvem os dois problemas que mais custam cliente hoje: o link sem preview e
1,67 MB baixados antes de qualquer coisa aparecer.
