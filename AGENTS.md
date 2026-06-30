# Project Governance

## Owner

This project is owned by Rico Majesty Daniel Mitra.

## Purpose

Native OS is a local-first workspace for solo builders. It turns rough project ideas into GitHub-ready project plans through a structured Project Brief, Agent Workflow, Codex Prompt Generator, Markdown/Obsidian export, Project Log, and GitHub Readiness Score.

Native OS is not an AI agent platform, paid API wrapper, cloud project manager, or hosted user-data service.

## Product Rules

- No paid APIs.
- No OpenAI API.
- No required backend.
- No login.
- No cloud database.
- No user-data upload.
- Store V1 data only in browser `localStorage` under `native-os:v1`.
- Demo data must be fake and clearly labeled.
- Keep GitHub and deployment platforms separate: GitHub is source control and CI; Vercel, Cloudflare Pages, and Netlify are hosting targets.

## Tech Stack

- Next.js with TypeScript
- Tailwind CSS
- Local shadcn-compatible primitives
- Lucide icons
- Vitest and Testing Library
- GitHub Actions
- Free static-compatible deployment targets

## Decision Policy

Agents may make reversible implementation decisions that preserve local-first privacy, deterministic scoring, and the approved IA.

Ask the owner before adding authentication, databases, paid APIs, server-side user storage, analytics, external sync, new major frameworks, or behavior that uploads user data.

## Quality Guardrails

- Domain logic must be pure and tested.
- UI must be accessible, responsive, professional, and non-generic.
- No emoji UI.
- No purple-blue gradient default.
- No generic marketing landing page as the first screen.
- Run lint, typecheck, tests, and production build before completion.
