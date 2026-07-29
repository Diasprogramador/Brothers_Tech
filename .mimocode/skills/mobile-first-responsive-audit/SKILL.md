---
name: mobile-first-responsive-audit
description: Audit every component CSS in brothers-tech/src/components/<Section>/ for the project-standard mobile-first responsive ladder: a downward @media (max-width: 380px) safety block AND an upward min-width ladder (560 / 768 / 860 / 1100 / 1400) matching the vanilla style.css breakpoint set. Use when the user says "o site precisa ser o mais responsivo possivel", "dando a maior preferencia para dispositivos mobile", "mobile-first", "revisao de responsividade", "ainda tem que revisar ... a parte de style", or when finishing any "Passo N" port step. Do NOT use for the preloader (single-screen, no responsive ladder needed).
version: 1.0.0
license: MIT
platforms: [windows, linux, macos]
---

# Mobile-First Responsive Audit

This project treats mobile as the primary design target — the user said "quero que esse site seje o mais responsivo possivel, dando a maior preferencia para dispositivos mobile (mobile-first), sabendo que a maioria do seu uso vai ser em dispositivos moveis" (recorded in `MEMORY.md` and confirmed across commit `11664b3` "fix(navbar): full mobile-first responsiveness overhaul" + commit `8c2620a` "fix(responsive): mobile-first refinements across all components").

The audit codifies two complementary block patterns that EVERY component CSS in `/brothers-tech/src/components/` must carry:

1. **Downward safety block** at the very bottom: `@media (max-width: 380px) { ... }`. Targets iPhone SE 1st/2nd gen, Galaxy Fold cover, and other ultra-narrow viewports.
2. **Upward ladder** (only if the section actually needs it): `@media (min-width: 560)`, `(min-width: 768)`, `(min-width: 860)`, `(min-width: 1100)`, and optionally `(min-width: 1400)` for huge monitors.

## When to run

- After a port step (per the `vanilla-react-port` skill) — audit that one section's CSS.
- As a sweep across all components — typically done as a dedicated commit (e.g., `8c2620a`) before declaring a section "done".
- When adding a new component — write the section CSS with both blocks from the start.

## Procedure

### 1. Inventory the components

```bash
ls brothers-tech/src/components
```

For each component folder, identify:
- The `.tsx` file (mostly for context — CSS is the audit target)
- The `.css` file (the audit subject)
- Any `index.ts` re-exports

Skip: `Preloader/` (single-screen pre-hydration overlay, no responsive ladder needed), shared/global files (`index.css`, `App.css`).

### 2. For each component CSS, apply the downward safety block

At the very bottom of the file, after any existing `@media (min-width: ...)` rules, add a single `@media (max-width: 380px) { ... }` block. The pattern (from `MEMORY.md` "`<380px` safety net convention"):

```css
@media (max-width: 380px) {
  /* section padding shrinks (drop one step on the spacing scale) */
  .<section> { padding: clamp(2rem, 8vw, 2.5rem) clamp(0.75rem, 4vw, 1rem); }
  /* card/inner padding drops one step */
  .<section>-card { padding: clamp(0.75rem, 3vw, 1rem); }
  /* heading clamps tighten */
  .<section>-title { font-size: clamp(1.5rem, 7vw, 1.875rem); }
  /* decorative max-heights get capped to avoid overgrowth */
  .<section>-decor { max-height: 200px; }
}
```

Apply only the rules that are relevant to the section. Decorative-only sections (e.g., a pure-text footer) skip the height cap.

### 3. Verify the upward ladder

For each component CSS, check the existing `@media (min-width: ...)` blocks against the vanilla `style.css` ladder for the matching section. The expected ladder: **560 / 768 / 860 / 1100**. If a section already has these (because the port was faithful), do not add duplicates — just confirm presence. If a section is missing one or more, port the corresponding block from the vanilla `style.css` for that section.

The optional **1400 cap block** is for decorative art that `clamp()` would overgrow on 4K/ultrawide. Apply only if the section has a `clamp(min, vh-based, max)` pattern that is not already capped.

### 4. Apply the iOS hardening touches (in `index.css`, not per-section)

One-time edits to `brothers-tech/src/index.css`:

```css
html { scroll-padding-top: 56px; }
@media (min-width: 768px) { html { scroll-padding-top: 60px; } }
@media (min-width: 1100px) { html { scroll-padding-top: 64px; } }
body { overscroll-behavior-y: none; -webkit-tap-highlight-color: transparent; }
```

If the section is a full-height hero under a transparent navbar, add to its `<Section>.css` (not `index.css`):

```css
.<hero> { padding-top: calc(env(safe-area-inset-top, 0) + <existing-value>); }
```

### 5. Validate TypeScript

```powershell
cd brothers-tech; npx tsc --noEmit -p tsconfig.app.json
```

PowerShell uses `;` not `&&`. Pure CSS edits do not introduce TS errors — this step exists so a stray unrelated edit doesn't slip through.

### 6. Commit per pass

Use the `commit-current` pattern. Suggested message style: `fix(responsive): mobile-first refinements across <list-of-sections>` for a sweep, or `fix(<section>): mobile-first responsive coverage` for a single-section audit.

## Stopping conditions

- A component CSS already has a downward + upward ladder that matches the project convention → no edit needed; note "already covered" in the audit summary.
- The Preloader/ directory appears in the inventory → skip it (single-screen pre-hydration overlay, no responsive ladder needed).
- A section has unique layout that the standard ladder does not fit (e.g., a horizontal scroll gallery) → note the deviation in the commit message and leave it as-is rather than forcing the ladder.
- The vanilla `style.css` does not contain the section → the React component is the original source. Apply the ladder anyway using conservative defaults from the design tokens in `:root`.

## Output

After the audit:
- Every non-Preloader component CSS has a `@media (max-width: 380px)` block.
- Every non-Preloader component CSS has at least the 560/768/1100 ladder (860 and 1400 are optional, depending on section complexity).
- `index.css` carries the responsive `scroll-padding-top`, `overscroll-behavior-y: none`, and `-webkit-tap-highlight-color: transparent`.
- One conventional commit, ready for the user's review.
