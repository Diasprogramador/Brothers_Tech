---
name: commit-current
description: Commit the current working tree state as a single conventional commit on the current branch. Use when the user asks for "um commit", "somente um commit", "salva o estado atual", "commit agora", "faz um commit pra mim", or any phrasing that means "checkpoint my current work onto the current branch". Do NOT use when the user wants to merge, rebase, push, or amend.
version: 1.0.0
license: MIT
platforms: [windows, linux, macos]
---

# Commit Current State

The user wants one commit on the current branch capturing the working tree state. They say things like "Quero que voce faça somente um commit de como esta o projeto atual", "Quero fazer um commit de agora", "Quero que voce faça um commit para mim por favor, somente o commit". Treat this as a deliberate save-state, not a feature commit.

## Procedure

1. **Confirm the branch is correct** before staging. The user usually names the branch explicitly ("na branch consolidate-v1", "minha branch dev-Sanderson"). If they did not, run `git branch --show-current` and report it in the commit message preamble so they can verify.
2. **Inspect the diff before staging** so the commit message reflects reality:
   - `git status --short`
   - `git diff --stat` (or `git diff --cached --stat` if anything is already staged)
3. **Do NOT push.** The user repeatedly asks for "somente o commit" — pushing is not in scope. If pushing seems required, ask first.
4. **Stage everything tracked + new files** the user clearly wants in this checkpoint:
   - `git add -A` if the user said "todo o estado atual" / "como esta o projeto atual" / "de agora"
   - `git add <specific-paths>` if the user named files
   - If untracked files are clearly throwaway (logs, build output, scratch), do not stage them. When in doubt, list the would-be staged set and ask.
5. **Compose the commit message** following the project's existing conventional-commits style. Examples from this repo's history:
   - `chore: consolidate project structure in consolidate-v1`
   - `fix(responsive): mobile-first refinements across all components`
   - `feat: port brothers-tech (React+Vite+TS) consolidated components into dev-Sanderson`
   - When the request is purely a checkpoint, default to `chore: snapshot current state on <branch>` and add a body listing the major files changed if more than ~5 files moved.
6. **Commit with a single command.** Windows PowerShell does not support `&&` — use `;` for chaining or invoke `git commit` directly.
   - `git commit -m "<subject>" -m "<body>"`
7. **Report back** with the resulting commit hash (`git log -1 --format='%h %s'`) and a short summary of what landed. Do NOT propose next steps unless the user explicitly asks.

## Stopping conditions

- User explicitly named a branch that is NOT the current branch → ask before switching (do not auto-checkout; this is a save, not a navigation).
- Working tree is clean (nothing to commit) → report `nothing to commit, working tree clean` and stop. Do not create empty commits.
- A pre-commit hook fails → fix only the obvious formatting/lint issue. Do NOT use `--no-verify` unless the user explicitly says so. Do NOT amend an existing commit.
- More than one untracked tree looks like it should be separate commits → ask the user to scope it before staging everything.

## Project-specific guardrails (from `MEMORY.md`)

- The user works on `dev-Sanderson`. Default branches they reference: `consolidate-v1`, `dev-Sanderson`, `dev-Caio`, `main`.
- Never force-push, never amend, never skip hooks unless explicitly asked.
- Single commit per request — do not split into multiple commits.
