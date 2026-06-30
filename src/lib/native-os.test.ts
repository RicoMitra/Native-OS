import { describe, expect, it } from "vitest";
import {
  createDemoState,
  generateMarkdownExport,
  generateStagePrompt,
  getActiveProject,
  isValidNativeProjectState,
  scoreGitHubReadiness,
} from "@/lib/native-os";

describe("native os domain", () => {
  it("creates a clearly fake demo project with the expected agent stages", () => {
    const state = createDemoState();
    const project = getActiveProject(state);

    expect(project.brief.name).toBe("Field Notes CRM");
    expect(project.brief.rawIdea).toContain("Fake demo");
    expect(project.workflow.map((stage) => stage.id)).toEqual([
      "planner",
      "builder",
      "critic",
      "docs",
      "review",
    ]);
  });

  it("validates good state and rejects malformed persisted data", () => {
    const state = createDemoState();

    expect(isValidNativeProjectState(state)).toBe(true);
    expect(isValidNativeProjectState({ ...state, version: 2 })).toBe(false);
    expect(isValidNativeProjectState({ ...state, projects: [] })).toBe(false);
    expect(isValidNativeProjectState({ ...state, activeProjectId: "missing" })).toBe(false);
    expect(
      isValidNativeProjectState({
        ...state,
        projects: [{ ...state.projects[0], workflow: [{ id: "unknown" }] }],
      }),
    ).toBe(false);
  });

  it("calculates a transparent 100 point GitHub readiness score", () => {
    const project = getActiveProject(createDemoState());
    const score = scoreGitHubReadiness(project);

    expect(score.maxScore).toBe(100);
    expect(score.factors.map((factor) => factor.maxScore)).toEqual([25, 30, 15, 15, 10, 5]);
    expect(score.totalScore).toBeGreaterThan(0);
    expect(score.totalScore).toBeLessThanOrEqual(100);
    expect(score.factors[0].detail).toContain("brief fields");
  });

  it("generates a stage-specific Codex prompt from current project context", () => {
    const project = getActiveProject(createDemoState());
    const prompt = generateStagePrompt(project, "critic");

    expect(prompt.title).toBe("Critic prompt for Field Notes CRM");
    expect(prompt.generatedPrompt).toContain("You are the Critic agent");
    expect(prompt.generatedPrompt).toContain("No paid APIs");
    expect(prompt.generatedPrompt).toContain("Current checklist");
  });

  it("exports Obsidian-compatible Markdown with brief, workflow, score, prompts, and log", () => {
    const project = getActiveProject(createDemoState());
    const markdown = generateMarkdownExport(project);

    expect(markdown).toContain("# Field Notes CRM");
    expect(markdown).toContain("## Project Brief");
    expect(markdown).toContain("## Agent Workflow");
    expect(markdown).toContain("## GitHub Readiness Score");
    expect(markdown).toContain("## Codex Prompts");
    expect(markdown).toContain("## Project Log");
  });
});
