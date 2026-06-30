# Project Context

## Product Summary

Native OS is an IA-first local workspace for solo builders. It helps a builder capture a rough idea, turn it into a structured project brief, walk it through Planner, Builder, Critic, Docs, and Review stages, generate Codex prompts, export Markdown for Obsidian, keep a local project log, and measure GitHub readiness.

## Primary User

A solo builder who works locally, uses Codex for project execution, keeps notes in Obsidian or Markdown, and wants a clean path from idea to GitHub-ready repository without cloud accounts or paid APIs.

## Core Capabilities

- Project Brief editor
- Fixed five-stage Agent Workflow
- Stage-aware Codex Prompt Generator
- Markdown and Obsidian export
- Project Log for decisions, blockers, changes, review notes, and deploy notes
- Deterministic GitHub Readiness Score
- Fake demo project
- Local reset and blank project actions

## Data Flow

1. Capture project brief, checklist, notes, and logs in the browser.
2. Validate the versioned state shape.
3. Persist state in `localStorage`.
4. Derive progress, prompts, Markdown, and readiness score from local state.
5. Present derived values in the UI.

No core workflow sends user data to a server.

## Readiness Score

The score is deterministic and transparent:

- Project Brief completeness: 25
- Agent workflow completion: 30
- Documentation readiness: 15
- GitHub setup readiness: 15
- Deployment notes readiness: 10
- Review/log hygiene: 5

The score measures GitHub-readiness signals only. It does not judge product quality or business success.

## UI Direction

The interface should feel like a professional native workstation: organized, informative, dense enough for real work, and visually distinct from generic AI dashboards. Avoid marketing-page structure, emoji icons, and purple-blue gradients.
