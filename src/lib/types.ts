export type AgentStage = "planner" | "builder" | "critic" | "docs" | "review";

export type ChecklistItem = {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  evidence: string;
};

export type WorkflowStage = {
  id: AgentStage;
  title: string;
  purpose: string;
  notes: string;
  checklist: ChecklistItem[];
};

export type ProjectBrief = {
  name: string;
  tagline: string;
  rawIdea: string;
  targetUser: string;
  problem: string;
  goals: string;
  nonGoals: string;
  constraints: string;
  techStack: string;
  deploymentTarget: string;
  successCriteria: string;
};

export type PromptDraft = {
  stage: AgentStage;
  title: string;
  generatedPrompt: string;
  lastGeneratedAt: string;
};

export type ProjectLogType = "decision" | "blocker" | "change" | "review" | "deploy";

export type ProjectLogEntry = {
  id: string;
  type: ProjectLogType;
  title: string;
  body: string;
  createdAt: string;
};

export type NativeProject = {
  id: string;
  brief: ProjectBrief;
  workflow: WorkflowStage[];
  prompts: PromptDraft[];
  log: ProjectLogEntry[];
  createdAt: string;
  updatedAt: string;
};

export type NativeProjectState = {
  version: 1;
  activeProjectId: string;
  projects: NativeProject[];
};

export type ReadinessFactor = {
  id: string;
  label: string;
  score: number;
  maxScore: number;
  detail: string;
};

export type ReadinessScore = {
  totalScore: number;
  maxScore: 100;
  label: "Draft" | "Working" | "Repository-ready";
  factors: ReadinessFactor[];
};
