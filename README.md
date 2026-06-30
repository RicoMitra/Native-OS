# Native OS

Native OS is a local-first project planning workspace for solo builders. It helps convert an early project idea into a structured, GitHub-ready working brief through project documentation, agent-style checklists, deterministic readiness scoring, and Markdown export.

The project is designed as a professional portfolio application: practical, privacy-preserving, inspectable, and deployable without paid infrastructure.

## Problem Solved

Solo builders often move between rough notes, chat prompts, repository tasks, and deployment checklists without a single source of truth. Native OS provides a compact workspace for organizing that transition before a project is published to GitHub or deployed to a hosting provider.

It focuses on the handoff layer between idea and implementation:

- What is the project?
- What has been decided?
- What should Codex work on next?
- Is the repository ready for GitHub?
- What should be exported to an Obsidian or Markdown workflow?

## Core Features

- **Project Brief**: structured fields for name, tagline, raw idea, target user, problem, goals, non-goals, constraints, tech stack, deployment target, and success criteria.
- **Agent Workflow**: fixed Planner, Builder, Critic, Docs, and Review stages with checklist evidence and stage notes.
- **Codex Prompt Generator**: deterministic stage-aware prompts generated from the local project state.
- **Markdown / Obsidian Export**: a portable Markdown document containing the brief, workflow, score, prompts, and project log.
- **Project Log**: local timeline entries for decisions, blockers, changes, review notes, and deployment notes.
- **GitHub Readiness Score**: transparent 100-point scoring based on visible project data, not AI judgment.
- **Fake Demo Project**: clearly labeled sample content for onboarding and tests.

## Local-First Architecture

Native OS is intentionally simple and private:

- No paid API
- No OpenAI API
- No login
- No required backend
- No cloud database
- No analytics provider
- No user-data upload
- No server-side project storage

Version 1 stores all project data in browser `localStorage` under:

```text
native-os:v1
```

All calculations, prompt generation, Markdown export, checklist updates, and log entries run in the browser.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Local shadcn-compatible UI primitives
- Lucide icons
- Vitest
- Testing Library
- ESLint
- GitHub Actions

## Repository Structure

```text
native-os/
  AGENTS.md
  DECISIONS.md
  DEPLOYMENT.md
  PRIVACY.md
  PROJECT_CONTEXT.md
  README.md
  TESTING.md
  src/
    app/
    components/
    lib/
```

Core domain logic lives in `src/lib/native-os.ts`. The main browser workspace is implemented in `src/components/native-os-workspace.tsx`.

## Run Locally

Prerequisites:

- Node.js 22.13 or newer
- pnpm

```bash
pnpm install
pnpm dev
```

Open:

```text
http://localhost:3000
```

If another app already uses port 3000:

```bash
pnpm dev -- --port 3001
```

## Quality Checks

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

The test suite covers domain validation, readiness scoring, prompt generation, Markdown export, local persistence behavior, checklist interaction, log creation, and reset behavior.

## Privacy Note

Native OS does not require user accounts, credentials, environment variables, external APIs, or cloud storage. Project content remains in the current browser unless the user manually copies, downloads, commits, or shares exported Markdown.

See [PRIVACY.md](./PRIVACY.md) for the full privacy model.

## Limitations

- Data is device/browser-local. It does not sync across browsers or machines.
- Clearing browser storage removes saved project data.
- V1 supports one active local project state at a time in the main UI.
- Markdown export is text-based; screenshot capture is manual.
- The GitHub Readiness Score measures repository-preparation signals only. It does not evaluate business viability, design quality, or market fit.

## Roadmap

- Multiple saved local projects in the UI.
- Import Markdown back into a project state.
- IndexedDB option for larger local workspaces.
- More granular readiness factors for documentation and release preparation.
- Optional local-only templates for common project types.
- Screenshot capture workflow for README assets.

## Deployment Note

GitHub and Vercel must remain separate:

- **GitHub**: source control, README, docs, pull requests, CI.
- **Vercel**: hosting and deployment only.

When deploying this repository to Vercel, set the Vercel root directory to:

```text
native-os
```

Do not deploy from the repository root if this project lives inside a larger workspace.

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment preparation details.

Production deployment:

```text
https://native-os-eight.vercel.app
```

## Suggested GitHub Metadata

Repository description:

```text
Local-first solo-builder workspace for project briefs, agent workflows, Codex prompts, Obsidian export, and GitHub readiness scoring.
```

Topics:

```text
nextjs, typescript, tailwindcss, local-first, productivity, developer-tools, codex, obsidian, markdown, portfolio-project
```
