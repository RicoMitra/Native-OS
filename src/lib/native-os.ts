import type {
  AgentStage,
  ChecklistItem,
  NativeProject,
  NativeProjectState,
  ProjectBrief,
  ProjectLogEntry,
  PromptDraft,
  ReadinessFactor,
  ReadinessScore,
  WorkflowStage,
} from "@/lib/types";

export const STORAGE_KEY = "native-os:v1";

export const AGENT_STAGES: AgentStage[] = ["planner", "builder", "critic", "docs", "review"];

const STAGE_TITLES: Record<AgentStage, string> = {
  planner: "Planner",
  builder: "Builder",
  critic: "Critic",
  docs: "Docs",
  review: "Review",
};

const now = () => new Date().toISOString();

const createChecklistItem = (
  id: string,
  label: string,
  description: string,
  checked = false,
  evidence = "",
): ChecklistItem => ({ id, label, description, checked, evidence });

export function createDefaultWorkflow(): WorkflowStage[] {
  return [
    {
      id: "planner",
      title: "Planner",
      purpose: "Turn a rough idea into a clear product brief and buildable scope.",
      notes: "Lock the project intent before implementation starts.",
      checklist: [
        createChecklistItem("planner-brief", "Project brief drafted", "Problem, target user, goals, non-goals, and constraints are written.", true, "Fake demo brief is complete."),
        createChecklistItem("planner-scope", "MVP scope defined", "The first release avoids paid APIs, login, cloud storage, and backend requirements.", true, "Scope excludes integrations."),
        createChecklistItem("planner-risks", "Risks listed", "Known blockers and assumptions are visible before build work.", false),
      ],
    },
    {
      id: "builder",
      title: "Builder",
      purpose: "Create the app structure, local data model, core workflows, and verification path.",
      notes: "Implementation work should stay local-first and reversible.",
      checklist: [
        createChecklistItem("builder-structure", "Repository structure planned", "Folders, scripts, and local-only data boundaries are identified.", true, "Next.js + localStorage only."),
        createChecklistItem("builder-tests", "Test plan listed", "Domain and UI checks are documented before coding.", false),
        createChecklistItem("builder-deploy", "Static deployment path noted", "Free deployment targets are named without adding cloud data services.", false),
      ],
    },
    {
      id: "critic",
      title: "Critic",
      purpose: "Review the plan and build for unclear scope, weak evidence, generic UX, and hidden data risks.",
      notes: "The critic should challenge vague claims before GitHub handoff.",
      checklist: [
        createChecklistItem("critic-privacy", "Privacy reviewed", "No paid API, login, backend, upload, analytics, or cloud database dependency exists.", true, "Local-only constraint visible."),
        createChecklistItem("critic-ux", "UX reviewed", "The workspace is informative, professional, and non-generic.", false),
        createChecklistItem("critic-readiness", "Readiness score inspected", "Score factors are deterministic and visible.", false),
      ],
    },
    {
      id: "docs",
      title: "Docs",
      purpose: "Prepare project documentation for GitHub readers and future agent sessions.",
      notes: "Docs explain the product, local setup, constraints, and deployment separation.",
      checklist: [
        createChecklistItem("docs-readme", "README outline ready", "Purpose, features, stack, setup, checks, and deployment are documented.", true, "Fake demo README outline."),
        createChecklistItem("docs-decisions", "Decision log ready", "Important product and technical decisions are recorded.", true, "Local-first decision exists."),
        createChecklistItem("docs-obsidian", "Obsidian export ready", "Current state can be exported to Markdown.", false),
      ],
    },
    {
      id: "review",
      title: "Review",
      purpose: "Confirm the project is GitHub-ready before deployment or public sharing.",
      notes: "Review checks are separate from deployment platforms.",
      checklist: [
        createChecklistItem("review-ci", "CI checks identified", "Lint, typecheck, tests, and build are listed as blockers.", true, "Quality scripts named."),
        createChecklistItem("review-github", "GitHub readiness checked", "Repo hygiene, README, license intent, and PR path are reviewed.", false),
        createChecklistItem("review-deploy", "Deployment notes separated", "Vercel, Cloudflare, or Netlify are hosting targets, not source control.", true, "GitHub and deploy targets separated."),
      ],
    },
  ];
}

export function createDemoState(): NativeProjectState {
  const timestamp = "2026-06-30T09:00:00.000Z";
  const brief: ProjectBrief = {
    name: "Field Notes CRM",
    tagline: "A local-first workspace for turning client notes into a clean solo-operator pipeline.",
    rawIdea:
      "Fake demo: a lightweight CRM for a freelance studio that organizes rough call notes, next actions, and project handoffs without accounts or cloud sync.",
    targetUser: "A solo consultant who wants one private browser workspace before opening GitHub issues.",
    problem: "Ideas and client notes are scattered across notebooks, chat drafts, and repo TODOs.",
    goals: "Clarify scope, track project readiness, produce prompts, and export Markdown for Obsidian.",
    nonGoals: "No paid APIs, OpenAI API, login, backend requirement, cloud database, user upload, or automated client messaging.",
    constraints: "All user data stays in localStorage on the current browser. Demo data is fake.",
    techStack: "Next.js, TypeScript, Tailwind CSS, localStorage, Vitest, GitHub Actions.",
    deploymentTarget: "Free static-compatible hosting on Vercel, Cloudflare Pages, or Netlify. GitHub remains separate source control.",
    successCriteria: "A project can move through Planner, Builder, Critic, Docs, and Review with a prompt, Markdown export, log, and readiness score.",
  };
  const project: NativeProject = {
    id: "field-notes-crm-demo",
    brief,
    workflow: createDefaultWorkflow(),
    prompts: [],
    log: [
      {
        id: "log-demo-1",
        type: "decision",
        title: "Keep the workspace local-first",
        body: "The fake demo project uses only browser storage and avoids accounts, paid APIs, backend requirements, and cloud databases.",
        createdAt: timestamp,
      },
      {
        id: "log-demo-2",
        type: "review",
        title: "Separate GitHub from deployment",
        body: "GitHub is treated as source control and CI. Vercel, Cloudflare, and Netlify are optional hosting targets.",
        createdAt: timestamp,
      },
    ],
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  return { version: 1, activeProjectId: project.id, projects: [project] };
}

export function getActiveProject(state: NativeProjectState): NativeProject {
  return state.projects.find((project) => project.id === state.activeProjectId) ?? state.projects[0];
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isAgentStage = (value: unknown): value is AgentStage =>
  typeof value === "string" && AGENT_STAGES.includes(value as AgentStage);

function isValidChecklistItem(value: unknown): value is ChecklistItem {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.label === "string" &&
    typeof value.description === "string" &&
    typeof value.checked === "boolean" &&
    typeof value.evidence === "string"
  );
}

function isValidWorkflowStage(value: unknown): value is WorkflowStage {
  if (!isRecord(value)) return false;
  return (
    isAgentStage(value.id) &&
    typeof value.title === "string" &&
    typeof value.purpose === "string" &&
    typeof value.notes === "string" &&
    Array.isArray(value.checklist) &&
    value.checklist.every(isValidChecklistItem)
  );
}

function isValidBrief(value: unknown): value is ProjectBrief {
  if (!isRecord(value)) return false;
  const keys: Array<keyof ProjectBrief> = [
    "name",
    "tagline",
    "rawIdea",
    "targetUser",
    "problem",
    "goals",
    "nonGoals",
    "constraints",
    "techStack",
    "deploymentTarget",
    "successCriteria",
  ];
  return keys.every((key) => typeof value[key] === "string");
}

function isValidLogEntry(value: unknown): value is ProjectLogEntry {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    ["decision", "blocker", "change", "review", "deploy"].includes(String(value.type)) &&
    typeof value.title === "string" &&
    typeof value.body === "string" &&
    typeof value.createdAt === "string"
  );
}

function isValidPromptDraft(value: unknown): value is PromptDraft {
  if (!isRecord(value)) return false;
  return (
    isAgentStage(value.stage) &&
    typeof value.title === "string" &&
    typeof value.generatedPrompt === "string" &&
    typeof value.lastGeneratedAt === "string"
  );
}

function isValidProject(value: unknown): value is NativeProject {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    isValidBrief(value.brief) &&
    Array.isArray(value.workflow) &&
    value.workflow.length === AGENT_STAGES.length &&
    value.workflow.every(isValidWorkflowStage) &&
    Array.isArray(value.prompts) &&
    value.prompts.every(isValidPromptDraft) &&
    Array.isArray(value.log) &&
    value.log.every(isValidLogEntry) &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string"
  );
}

export function isValidNativeProjectState(value: unknown): value is NativeProjectState {
  if (!isRecord(value)) return false;
  if (value.version !== 1 || typeof value.activeProjectId !== "string" || !Array.isArray(value.projects)) {
    return false;
  }
  if (value.projects.length < 1 || !value.projects.every(isValidProject)) return false;
  return value.projects.some((project) => project.id === value.activeProjectId);
}

export function loadNativeProjectState(): NativeProjectState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    return isValidNativeProjectState(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function saveNativeProjectState(state: NativeProjectState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // The workspace remains usable if browser storage is unavailable or full.
  }
}

export function clearNativeProjectState() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Reset in-memory state even when browser storage cannot be modified.
  }
}

const nonEmptyBriefFields = (brief: ProjectBrief) =>
  Object.values(brief).filter((value) => value.trim().length > 0).length;

const allChecklistItems = (project: NativeProject) =>
  project.workflow.flatMap((stage) => stage.checklist);

const completeItems = (project: NativeProject) =>
  allChecklistItems(project).filter((item) => item.checked).length;

const proportionalScore = (value: number, maxValue: number, weight: number) =>
  maxValue === 0 ? 0 : Math.round((value / maxValue) * weight);

const hasText = (value: string) => value.trim().length > 0;

export function scoreGitHubReadiness(project: NativeProject): ReadinessScore {
  const briefTotal = Object.keys(project.brief).length;
  const briefComplete = nonEmptyBriefFields(project.brief);
  const items = allChecklistItems(project);
  const completed = completeItems(project);
  const docsReady = [
    project.brief.techStack,
    project.brief.deploymentTarget,
    project.brief.successCriteria,
    project.workflow.find((stage) => stage.id === "docs")?.notes ?? "",
  ].filter(hasText).length;
  const githubReady = [
    project.brief.name,
    project.brief.constraints,
    project.workflow.find((stage) => stage.id === "review")?.checklist.find((item) => item.id === "review-ci")?.checked ? "ci" : "",
    project.workflow.find((stage) => stage.id === "review")?.checklist.find((item) => item.id === "review-github")?.checked ? "github" : "",
  ].filter(Boolean).length;
  const deployReady = [
    project.brief.deploymentTarget.includes("Vercel") || project.brief.deploymentTarget.includes("Cloudflare") || project.brief.deploymentTarget.includes("Netlify"),
    project.brief.deploymentTarget.includes("GitHub"),
  ].filter(Boolean).length;
  const logHygiene = project.log.length > 0 ? 5 : 0;

  const factors: ReadinessFactor[] = [
    {
      id: "brief",
      label: "Project Brief completeness",
      score: proportionalScore(briefComplete, briefTotal, 25),
      maxScore: 25,
      detail: `${briefComplete}/${briefTotal} brief fields are filled.`,
    },
    {
      id: "workflow",
      label: "Agent workflow completion",
      score: proportionalScore(completed, items.length, 30),
      maxScore: 30,
      detail: `${completed}/${items.length} checklist items are complete.`,
    },
    {
      id: "docs",
      label: "Documentation readiness",
      score: proportionalScore(docsReady, 4, 15),
      maxScore: 15,
      detail: `${docsReady}/4 documentation signals are present.`,
    },
    {
      id: "github",
      label: "GitHub setup readiness",
      score: proportionalScore(githubReady, 4, 15),
      maxScore: 15,
      detail: `${githubReady}/4 GitHub readiness signals are present.`,
    },
    {
      id: "deploy",
      label: "Deployment notes readiness",
      score: proportionalScore(deployReady, 2, 10),
      maxScore: 10,
      detail: `${deployReady}/2 deployment separation signals are present.`,
    },
    {
      id: "log",
      label: "Review and log hygiene",
      score: logHygiene,
      maxScore: 5,
      detail: project.log.length > 0 ? `${project.log.length} log entries recorded.` : "No log entries recorded.",
    },
  ];
  const totalScore = factors.reduce((total, factor) => total + factor.score, 0);

  return {
    totalScore,
    maxScore: 100,
    label: totalScore >= 85 ? "Repository-ready" : totalScore >= 50 ? "Working" : "Draft",
    factors,
  };
}

export function generateStagePrompt(project: NativeProject, stage: AgentStage): PromptDraft {
  const stageData = project.workflow.find((item) => item.id === stage);
  const currentChecklist = stageData?.checklist
    .map((item) => `- [${item.checked ? "x" : " "}] ${item.label}: ${item.description}${item.evidence ? ` Evidence: ${item.evidence}` : ""}`)
    .join("\n") ?? "";
  const title = `${STAGE_TITLES[stage]} prompt for ${project.brief.name || "Untitled Project"}`;
  const generatedPrompt = [
    `You are the ${STAGE_TITLES[stage]} agent for ${project.brief.name || "Untitled Project"}.`,
    "",
    "Project brief:",
    `Name: ${project.brief.name}`,
    `Tagline: ${project.brief.tagline}`,
    `Raw idea: ${project.brief.rawIdea}`,
    `Target user: ${project.brief.targetUser}`,
    `Problem: ${project.brief.problem}`,
    `Goals: ${project.brief.goals}`,
    `Non-goals: ${project.brief.nonGoals}`,
    `Constraints: ${project.brief.constraints}`,
    `Tech stack: ${project.brief.techStack}`,
    `Deployment target: ${project.brief.deploymentTarget}`,
    `Success criteria: ${project.brief.successCriteria}`,
    "",
    "Current checklist:",
    currentChecklist,
    "",
    "Instruction:",
    `Work only on the ${STAGE_TITLES[stage]} stage. Keep the project local-first. No paid APIs, no OpenAI API, no login, no required backend, no cloud database, and no user-data upload.`,
  ].join("\n");

  return { stage, title, generatedPrompt, lastGeneratedAt: now() };
}

const line = (label: string, value: string) => `- **${label}:** ${value || "Not specified"}`;

export function generateMarkdownExport(project: NativeProject): string {
  const readiness = scoreGitHubReadiness(project);
  const prompts = AGENT_STAGES.map((stage) => generateStagePrompt(project, stage));
  const workflow = project.workflow
    .map((stage) => {
      const items = stage.checklist
        .map((item) => `- [${item.checked ? "x" : " "}] **${item.label}** - ${item.description}${item.evidence ? ` (${item.evidence})` : ""}`)
        .join("\n");
      return `### ${stage.title}\n${stage.purpose}\n\n${items}\n\nNotes: ${stage.notes || "None"}`;
    })
    .join("\n\n");
  const log = project.log
    .map((entry) => `- **${entry.type.toUpperCase()} | ${entry.title}** (${entry.createdAt})\n  ${entry.body}`)
    .join("\n");
  const promptText = prompts
    .map((prompt) => `### ${prompt.title}\n\n\`\`\`text\n${prompt.generatedPrompt}\n\`\`\``)
    .join("\n\n");

  return [
    `# ${project.brief.name || "Untitled Project"}`,
    "",
    project.brief.tagline,
    "",
    "## Project Brief",
    line("Raw idea", project.brief.rawIdea),
    line("Target user", project.brief.targetUser),
    line("Problem", project.brief.problem),
    line("Goals", project.brief.goals),
    line("Non-goals", project.brief.nonGoals),
    line("Constraints", project.brief.constraints),
    line("Tech stack", project.brief.techStack),
    line("Deployment target", project.brief.deploymentTarget),
    line("Success criteria", project.brief.successCriteria),
    "",
    "## Agent Workflow",
    workflow,
    "",
    "## GitHub Readiness Score",
    `Score: ${readiness.totalScore}/${readiness.maxScore} (${readiness.label})`,
    "",
    readiness.factors.map((factor) => `- ${factor.label}: ${factor.score}/${factor.maxScore} - ${factor.detail}`).join("\n"),
    "",
    "## Codex Prompts",
    promptText,
    "",
    "## Project Log",
    log || "No log entries yet.",
    "",
  ].join("\n");
}

export function createEmptyProject(): NativeProject {
  const timestamp = now();
  return {
    id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `project-${Date.now()}`,
    brief: {
      name: "",
      tagline: "",
      rawIdea: "",
      targetUser: "",
      problem: "",
      goals: "",
      nonGoals: "No paid APIs, no OpenAI API, no login, no required backend, no cloud database, and no user-data upload.",
      constraints: "Local-first. Store data in localStorage on the current browser.",
      techStack: "Next.js, TypeScript, Tailwind CSS, localStorage, Vitest.",
      deploymentTarget: "GitHub for source control and CI. Vercel, Cloudflare Pages, or Netlify for free hosting.",
      successCriteria: "",
    },
    workflow: createDefaultWorkflow().map((stage) => ({
      ...stage,
      checklist: stage.checklist.map((item) => ({ ...item, checked: false, evidence: "" })),
    })),
    prompts: [],
    log: [],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}
