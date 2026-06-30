# Testing

Native OS uses automated checks and browser verification before handoff.

## Commands

Run from `native-os/`:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Automated Coverage

The current test suite covers:

- Fake demo state creation
- State validation and malformed state rejection
- GitHub readiness scoring
- Stage-aware Codex prompt generation
- Obsidian-compatible Markdown export
- Project Brief editing and local persistence
- Agent Workflow checklist updates
- Prompt copy flow
- Project Log entry creation
- Reset behavior that does not touch unrelated storage keys

## Browser QA Checklist

Before public deployment:

- Open local app in a browser.
- Verify desktop layout.
- Verify mobile layout.
- Edit Project Brief.
- Update one checklist item.
- Copy a generated Codex prompt.
- Add a Project Log entry.
- Review Markdown export.
- Check browser console for errors.
- Confirm no unintended horizontal overflow on mobile.

## Current Known Result

Latest verified command results are tracked in the private Obsidian handoff notes and should be refreshed before public release.
