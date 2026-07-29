---
name: vanilla-react-port
description: Port a section of the vanilla root landing page (index.html / style.css / script.js) into a React component under brothers-tech/src/components/<Section>/, preserving visual and behavioral fidelity. Use when the user says "esteja fiel a como esta o index.html style.css e script.js da raiz", "porta o <X> do script.js", "transcreva para react", "componente <X> precisa ser fiel à versão vanilla", or when starting one of the "Passo N" port steps for Hero/Navbar/Services/Projects/About/Contact/Footer. Do NOT use for the preloader (it has its own SVG-stroke-draw pattern in Preloader.tsx) or for new features.
version: 1.0.0
license: MIT
platforms: [windows, linux, macos]
---

# Vanilla → React Port-Fidelity

This project migrated a landing page from vanilla HTML/CSS/JS to React. The root `index.html`, `style.css`, and `script.js` are the **source of truth** — the React tree under `brothers-tech/src/components/` is a port, not a redesign. The user expressed this explicitly: "a parte /brothers-tech esteja fiel a como esta o index.html style.css e script.js da raiz" (recorded in `MEMORY.md` "Port strategy: vanilla is source of truth").

This skill codifies the per-section port workflow that produced the existing components (Navbar, useReveal, Hero, CustomCursor, Servicos, Projetos, Sobre, Contato, Footer) and any future section ports.

## Inputs (gather before editing)

1. The vanilla source — `index.html`, `style.css`, `script.js` at repo root. Read them in full if you have not in this session.
2. The target React location — `brothers-tech/src/components/<Section>/`. Confirm it exists; if not, create the folder with `index.ts` + `<Section>.tsx` + `<Section>.css`.
3. The `tsconfig.app.json` setting `verbatimModuleSyntax: true` — every type-only import MUST use the `type` modifier (e.g. `import { useEffect, type ReactNode } from "react"`).

## Procedure (per section)

1. **Open the vanilla `<section>` / `<element>` block** in `index.html`. Note its `class` names, its data attributes, and its parent container. These are the contract.
2. **Open the matching vanilla CSS block** in `style.css`. Note the design tokens used (CSS variables from `:root`), the responsive breakpoints at the bottom (560/768/860/1100), and any `clamp()` values.
3. **Open `script.js`** and grep for the section's class name or `data-*` attribute. Port the JS handler logic verbatim into the React component's `useEffect`/event handler. Common mappings:
   - `DOMContentLoaded` → `useEffect(() => {...}, [])`
   - `window.addEventListener('scroll', ...)` → `useEffect` with scroll listener; remember to remove the listener in cleanup
   - `IntersectionObserver` → wrap as a custom hook (`useReveal` already exists — reuse it instead of writing a new observer)
   - `requestAnimationFrame` focus deferral → keep the `requestAnimationFrame` call verbatim
4. **Author the TSX** with co-located CSS:
   - One `<Section>.tsx` exporting the default component
   - One `<Section>.css` next to it (not in `index.css`) for section-specific styles
   - Global shared UI classes (`.btn-primary`, `.btn-ghost`, etc.) belong in `brothers-tech/src/index.css`, not in the section CSS
5. **Preserve every className verbatim** from the vanilla HTML. Do not rename `.hero-content` to `.wrapper` — the design tokens and downstream selectors depend on the original names.
6. **Preserve responsive rules verbatim.** The vanilla `style.css` carries `@media (min-width: 560/768/860/1100)` blocks at the bottom of each section's rule — copy them into the section's `<Section>.css` in the same order.
7. **Add the mobile-first safety block** (`@media (max-width: 380px)`) if the section's CSS does not already have one. This is the project convention — section padding shrinks, card padding drops one step on the spacing scale, heading font-sizes get a tighter `clamp()`, decorative max-heights get capped. See `mobile-first-responsive-audit` skill for the full audit pass.
8. **Add the iOS hardening touches** to `index.css` (one-time per section):
   - Responsive `scroll-padding-top` (56px mobile / 60px tablet / 64px desktop) if the section is a scroll target
   - `padding-top: calc(env(safe-area-inset-top, 0) + <existing>)` for any full-height hero/section under a transparent navbar
9. **Validate TypeScript:** run `cd brothers-tech; npx tsc --noEmit -p tsconfig.app.json` from `brothers-tech/`. PowerShell uses `;` not `&&`. Pre-existing errors in files NOT in your edit set are not yours to fix.
10. **Commit** using the `commit-current` pattern — one conventional commit per port step. Suggested prefix: `feat(<section>): port from vanilla root`.

## Stopping conditions

- Vanilla HTML/CSS/JS does not contain the section at all → ask the user whether they want a clean React implementation (not a port) or to first add it to the vanilla root.
- The vanilla CSS relies on `position: absolute` inside a parent that does not exist in the React tree yet → port the parent first, then re-anchor the child.
- The vanilla JS handler uses a library (lenis, GSAP) — confirm the library is in `brothers-tech/package.json` before importing. The current project uses `lenis` for smooth scroll and `gsap` for the preloader only.
- You find yourself wanting to "improve" the vanilla source's design choices → STOP. The user wants fidelity. Note the discrepancy in the commit message body if it's a real divergence, but do not silently redesign.

## Output

After the port, the section should render identically to the vanilla version on a fresh load (modulo the preloader). Verify by opening the React build, comparing section by section against the root `index.html` rendered in a separate tab if needed.

## Related skills

- `mobile-first-responsive-audit` — runs after this skill to audit every component for the ≤380px + 560/768/860/1100/1400 ladder.
- `commit-current` — use this for the per-step commit.
