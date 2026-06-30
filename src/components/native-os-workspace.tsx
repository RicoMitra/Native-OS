"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BookOpenText,
  CheckCircle2,
  Clipboard,
  Download,
  FileText,
  Gauge,
  GitBranch,
  History,
  LayoutDashboard,
  ListChecks,
  Plus,
  RotateCcw,
  TerminalSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AGENT_STAGES,
  clearNativeProjectState,
  createDemoState,
  createEmptyProject,
  generateMarkdownExport,
  generateStagePrompt,
  getActiveProject,
  loadNativeProjectState,
  saveNativeProjectState,
  scoreGitHubReadiness,
} from "@/lib/native-os";
import type { AgentStage, ChecklistItem, NativeProject, NativeProjectState, ProjectBrief, ProjectLogType } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "brief", label: "Project Brief", icon: BookOpenText },
  { id: "workflow", label: "Agent Workflow", icon: ListChecks },
  { id: "prompts", label: "Codex Prompts", icon: TerminalSquare },
  { id: "export", label: "Markdown Export", icon: FileText },
  { id: "log", label: "Project Log", icon: History },
] as const;

const BRIEF_FIELDS: Array<{ key: keyof ProjectBrief; label: string; multiline?: boolean }> = [
  { key: "name", label: "Project name" },
  { key: "tagline", label: "Tagline" },
  { key: "rawIdea", label: "Raw idea", multiline: true },
  { key: "targetUser", label: "Target user", multiline: true },
  { key: "problem", label: "Problem", multiline: true },
  { key: "goals", label: "Goals", multiline: true },
  { key: "nonGoals", label: "Non-goals", multiline: true },
  { key: "constraints", label: "Constraints", multiline: true },
  { key: "techStack", label: "Tech stack", multiline: true },
  { key: "deploymentTarget", label: "Deployment target", multiline: true },
  { key: "successCriteria", label: "Success criteria", multiline: true },
];

const stageColor: Record<AgentStage, string> = {
  planner: "bg-[#daf2e7] text-[#185346]",
  builder: "bg-[#dfeaf7] text-[#254a6f]",
  critic: "bg-[#f4e0d8] text-[#844332]",
  docs: "bg-[#eee7d0] text-[#6d5a25]",
  review: "bg-[#e3e4f3] text-[#3f456f]",
};

function sectionTitle(label: string, title: string, body: string) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#5c7f72]">{label}</p>
      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-[#16221f]">{title}</h2>
      <p className="mt-2 max-w-[65ch] text-sm leading-6 text-[#5c6c67]">{body}</p>
    </div>
  );
}

function Panel({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"section">) {
  return (
    <section
      className={cn(
        "rounded-[22px] border border-[#d2ded8] bg-[#f8fbf8]/90 shadow-[0_24px_70px_rgba(39,66,57,0.09)] backdrop-blur",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-[#60746d]">{label}</span>
      {children}
    </label>
  );
}

function getStageProgress(project: NativeProject, stage: AgentStage) {
  const workflow = project.workflow.find((item) => item.id === stage);
  const total = workflow?.checklist.length ?? 0;
  const done = workflow?.checklist.filter((item) => item.checked).length ?? 0;
  return { total, done, percentage: total ? Math.round((done / total) * 100) : 0 };
}

function useWorkspaceState() {
  const [state, setState] = useState<NativeProjectState>(() => createDemoState());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadNativeProjectState();
    const frame = window.requestAnimationFrame(() => {
      if (saved) setState(saved);
      setHydrated(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (hydrated) saveNativeProjectState(state);
  }, [hydrated, state]);

  return { state, setState, hydrated };
}

export function NativeOsWorkspace() {
  const { state, setState, hydrated } = useWorkspaceState();
  const [activeStage, setActiveStage] = useState<AgentStage>("planner");
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [logDraft, setLogDraft] = useState<{ type: ProjectLogType; title: string; body: string }>({
    type: "decision",
    title: "",
    body: "",
  });
  const project = getActiveProject(state);
  const readiness = useMemo(() => scoreGitHubReadiness(project), [project]);
  const activePrompt = useMemo(() => generateStagePrompt(project, activeStage), [project, activeStage]);
  const markdown = useMemo(() => generateMarkdownExport(project), [project]);
  const allItems = project.workflow.flatMap((stage) => stage.checklist);
  const completedItems = allItems.filter((item) => item.checked).length;
  const projectProgress = allItems.length ? Math.round((completedItems / allItems.length) * 100) : 0;

  const updateProject = (updater: (project: NativeProject) => NativeProject) => {
    setState((current) => ({
      ...current,
      projects: current.projects.map((item) =>
        item.id === current.activeProjectId ? { ...updater(item), updatedAt: new Date().toISOString() } : item,
      ),
    }));
  };

  const updateBrief = (key: keyof ProjectBrief, value: string) => {
    updateProject((current) => ({ ...current, brief: { ...current.brief, [key]: value } }));
  };

  const updateChecklist = (stageId: AgentStage, itemId: string, patch: Partial<ChecklistItem>) => {
    updateProject((current) => ({
      ...current,
      workflow: current.workflow.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              checklist: stage.checklist.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
            }
          : stage,
      ),
    }));
  };

  const updateStageNotes = (stageId: AgentStage, notes: string) => {
    updateProject((current) => ({
      ...current,
      workflow: current.workflow.map((stage) => (stage.id === stageId ? { ...stage, notes } : stage)),
    }));
  };

  const resetDemo = () => {
    clearNativeProjectState();
    setState(createDemoState());
    setActiveStage("planner");
  };

  const createBlank = () => {
    const project = createEmptyProject();
    clearNativeProjectState();
    setState({ version: 1, activeProjectId: project.id, projects: [project] });
    setActiveStage("planner");
  };

  const copyText = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    setCopyStatus(`${label} copied locally.`);
    window.setTimeout(() => setCopyStatus(null), 1800);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${project.brief.name || "native-os-project"}.md`.replace(/[^\w.-]+/g, "-");
    link.click();
    URL.revokeObjectURL(url);
  };

  const addLogEntry = () => {
    if (!logDraft.title.trim() || !logDraft.body.trim()) return;
    updateProject((current) => ({
      ...current,
      log: [
        {
          id: typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `log-${Date.now()}`,
          type: logDraft.type,
          title: logDraft.title.trim(),
          body: logDraft.body.trim(),
          createdAt: new Date().toISOString(),
        },
        ...current.log,
      ],
    }));
    setLogDraft({ type: "decision", title: "", body: "" });
  };

  return (
    <main className="min-h-[100dvh] overflow-x-hidden text-[#182421]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[270px] border-r border-[#d2ded8] bg-[#10241f] px-5 py-6 text-[#edf7f2] lg:block">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-[16px] bg-[#37a987] text-[#09201a]">
            <GitBranch className="size-5" />
          </div>
          <div>
            <p className="text-lg font-semibold tracking-[-0.035em]">Native OS</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-[#8db0a4]">Local builder</p>
          </div>
        </div>
        <nav className="mt-10 space-y-1" aria-label="Workspace sections">
          {NAV.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="flex min-h-11 items-center gap-3 rounded-[14px] px-3 text-sm text-[#bfd3cc] transition hover:bg-white/[0.07] hover:text-white">
              <item.icon className="size-4 text-[#70c8ad]" />
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-8 rounded-[18px] border border-white/10 bg-white/[0.05] p-4">
          <p className="text-sm font-semibold">Local-first boundary</p>
          <p className="mt-2 text-xs leading-5 text-[#a9c1b9]">No login, paid API, backend requirement, cloud database, analytics, or user upload. Data stays in this browser.</p>
        </div>
      </aside>

      <div className="lg:pl-[270px]">
        <header className="sticky top-0 z-20 border-b border-[#d2ded8] bg-[#eef3ef]/85 px-4 py-4 backdrop-blur md:px-8">
          <div className="mx-auto flex max-w-[1480px] flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c7f72]">Fake demo workspace</p>
              <h1 className="text-2xl font-semibold tracking-[-0.045em] md:text-4xl">{project.brief.name || "Untitled local project"}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="secondary" onClick={createBlank}><Plus className="size-4" /> Blank project</Button>
              <Button variant="secondary" onClick={resetDemo}><RotateCcw className="size-4" /> Load fake demo</Button>
              <Button onClick={downloadMarkdown}><Download className="size-4" /> Download Markdown</Button>
            </div>
          </div>
        </header>

        <div className="mx-auto max-w-[1480px] px-4 py-6 md:px-8 md:py-8">
          <section id="overview" className="scroll-mt-24">
            <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
              <Panel className="p-6 md:p-8">
                {sectionTitle("Workspace overview", "From rough idea to GitHub-ready", "Native OS tracks the minimum information a solo builder needs before handing work to Codex, GitHub, and a deployment target.")}
                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[18px] border border-[#d2ded8] bg-[#eef7f2] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#60746d]">Project progress</p>
                    <p className="mt-4 text-4xl font-semibold tracking-[-0.055em]">{projectProgress}%</p>
                    <p className="mt-1 text-sm text-[#60746d]">{completedItems}/{allItems.length} workflow checks complete</p>
                  </div>
                  <div className="rounded-[18px] border border-[#d2ded8] bg-[#eef7f2] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#60746d]">Readiness score</p>
                    <p className="mt-4 text-4xl font-semibold tracking-[-0.055em]">{readiness.totalScore}</p>
                    <p className="mt-1 text-sm text-[#60746d]">/100 {readiness.label}</p>
                  </div>
                  <div className="rounded-[18px] border border-[#d2ded8] bg-[#eef7f2] p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#60746d]">Project log</p>
                    <p className="mt-4 text-4xl font-semibold tracking-[-0.055em]">{project.log.length}</p>
                    <p className="mt-1 text-sm text-[#60746d]">local timeline entries</p>
                  </div>
                </div>
                <div className="mt-7 space-y-3">
                  {AGENT_STAGES.map((stage) => {
                    const progress = getStageProgress(project, stage);
                    return (
                      <div key={stage} className="grid gap-3 rounded-[16px] border border-[#d2ded8] bg-[#fbfdfb] p-4 md:grid-cols-[130px_1fr_60px] md:items-center">
                        <span className={cn("w-fit rounded-full px-3 py-1 text-xs font-semibold", stageColor[stage])}>{stage}</span>
                        <div className="h-2 overflow-hidden rounded-full bg-[#dbe5df]">
                          <div className="h-full rounded-full bg-[#37a987]" style={{ width: `${progress.percentage}%` }} />
                        </div>
                        <span className="text-sm font-semibold">{progress.done}/{progress.total}</span>
                      </div>
                    );
                  })}
                </div>
              </Panel>
              <Panel className="p-6 md:p-8">
                <div className="flex items-center gap-3">
                  <div className="grid size-11 place-items-center rounded-[16px] bg-[#daf2e7] text-[#185346]"><Gauge className="size-5" /></div>
                  <div>
                    <h2 className="text-xl font-semibold tracking-[-0.035em]">GitHub readiness</h2>
                    <p className="text-sm text-[#60746d]">Transparent scoring from visible project data.</p>
                  </div>
                </div>
                <div className="mt-6 space-y-4">
                  {readiness.factors.map((factor) => (
                    <div key={factor.id}>
                      <div className="flex items-center justify-between gap-3 text-sm">
                        <span className="font-medium">{factor.label}</span>
                        <span className="font-mono text-xs">{factor.score}/{factor.maxScore}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#dbe5df]">
                        <div className="h-full rounded-full bg-[#123c35]" style={{ width: `${(factor.score / factor.maxScore) * 100}%` }} />
                      </div>
                      <p className="mt-1 text-xs leading-5 text-[#60746d]">{factor.detail}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </section>

          <Panel id="brief" className="mt-5 scroll-mt-24 p-6 md:p-8">
            {sectionTitle("Project brief", "Define the build before building", "These fields drive prompts, Markdown export, and readiness scoring. Keep them concrete enough for another agent to execute.")}
            <div className="mt-7 grid gap-4 md:grid-cols-2">
              {BRIEF_FIELDS.map((field) => (
                <Field key={field.key} label={field.label}>
                  {field.multiline ? (
                    <Textarea value={project.brief[field.key]} onChange={(event) => updateBrief(field.key, event.target.value)} />
                  ) : (
                    <Input value={project.brief[field.key]} onChange={(event) => updateBrief(field.key, event.target.value)} />
                  )}
                </Field>
              ))}
            </div>
          </Panel>

          <Panel id="workflow" className="mt-5 scroll-mt-24 p-6 md:p-8">
            {sectionTitle("Agent workflow", "Planner, Builder, Critic, Docs, Review", "Each stage has checklist evidence and notes. The workflow is fixed so progress stays easy to compare across projects.")}
            <div className="mt-7 grid gap-4 lg:grid-cols-[260px_1fr]">
              <div className="space-y-2">
                {project.workflow.map((stage) => (
                  <button
                    key={stage.id}
                    onClick={() => setActiveStage(stage.id)}
                    className={cn("w-full rounded-[16px] border p-4 text-left transition duration-200 active:scale-[0.99]", activeStage === stage.id ? "border-[#37a987] bg-[#eef8f3]" : "border-[#d2ded8] bg-[#fbfdfb] hover:bg-[#f0f7f3]")}
                  >
                    <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", stageColor[stage.id])}>{stage.title}</span>
                    <p className="mt-3 text-sm leading-5 text-[#60746d]">{stage.purpose}</p>
                  </button>
                ))}
              </div>
              <div className="rounded-[18px] border border-[#d2ded8] bg-[#fbfdfb] p-5">
                {project.workflow.filter((stage) => stage.id === activeStage).map((stage) => (
                  <div key={stage.id}>
                    <h3 className="text-xl font-semibold tracking-[-0.035em]">{stage.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-[#60746d]">{stage.purpose}</p>
                    <div className="mt-5 space-y-3">
                      {stage.checklist.map((item) => (
                        <div key={item.id} className="rounded-[16px] border border-[#d2ded8] bg-[#f7fbf8] p-4">
                          <label className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              checked={item.checked}
                              onChange={(event) => updateChecklist(stage.id, item.id, { checked: event.target.checked })}
                              className="mt-1 size-5 rounded border-[#9fb4ac] accent-[#37a987]"
                            />
                            <span>
                              <span className="block text-sm font-semibold">{item.label}</span>
                              <span className="mt-1 block text-xs leading-5 text-[#60746d]">{item.description}</span>
                            </span>
                          </label>
                          <Input className="mt-3" placeholder="Evidence or note" value={item.evidence} onChange={(event) => updateChecklist(stage.id, item.id, { evidence: event.target.value })} />
                        </div>
                      ))}
                    </div>
                    <Field label="Stage notes">
                      <Textarea value={stage.notes} onChange={(event) => updateStageNotes(stage.id, event.target.value)} />
                    </Field>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          <div className="mt-5 grid gap-5 xl:grid-cols-2">
            <Panel id="prompts" className="scroll-mt-24 p-6 md:p-8">
              {sectionTitle("Codex prompt generator", "Stage-aware handoff prompts", "Prompts are deterministic text generated from local state. Nothing is sent to an API.")}
              <div className="mt-6 flex flex-wrap gap-2">
                {AGENT_STAGES.map((stage) => (
                  <Button key={stage} variant={activeStage === stage ? "primary" : "secondary"} size="sm" onClick={() => setActiveStage(stage)}>
                    {stage}
                  </Button>
                ))}
              </div>
              <div className="mt-5 rounded-[18px] border border-[#d2ded8] bg-[#0f211d] p-4 text-[#eaf7f2]">
                <p className="font-semibold">{activePrompt.title}</p>
                <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap font-mono text-xs leading-5 text-[#c7ddd5]">{activePrompt.generatedPrompt}</pre>
              </div>
              <Button className="mt-4" onClick={() => void copyText(activePrompt.generatedPrompt, "Prompt")}><Clipboard className="size-4" /> Copy prompt</Button>
            </Panel>

            <Panel id="export" className="scroll-mt-24 p-6 md:p-8">
              {sectionTitle("Markdown / Obsidian export", "One portable project note", "Export includes the brief, workflow, readiness score, generated prompts, and project log.")}
              <div className="mt-5 rounded-[18px] border border-[#d2ded8] bg-[#fbfdfb] p-4">
                <pre className="max-h-[520px] overflow-auto whitespace-pre-wrap font-mono text-xs leading-5 text-[#33413d]">{markdown}</pre>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button onClick={downloadMarkdown}><Download className="size-4" /> Download .md</Button>
                <Button variant="secondary" onClick={() => void copyText(markdown, "Markdown")}><Clipboard className="size-4" /> Copy Markdown</Button>
              </div>
            </Panel>
          </div>

          <Panel id="log" className="mt-5 scroll-mt-24 p-6 md:p-8">
            {sectionTitle("Project log", "Decisions, blockers, changes, reviews, deploy notes", "The log keeps important context inside the local project state and Markdown export.")}
            <div className="mt-7 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[18px] border border-[#d2ded8] bg-[#fbfdfb] p-5">
                <Field label="Log type">
                  <select
                    className="min-h-11 w-full rounded-[14px] border border-[#cbd8d2] bg-[#fbfdfb] px-3 text-sm outline-none focus:border-[#37a987] focus:ring-2 focus:ring-[#37a987]/20"
                    value={logDraft.type}
                    onChange={(event) => setLogDraft((draft) => ({ ...draft, type: event.target.value as ProjectLogType }))}
                  >
                    <option value="decision">Decision</option>
                    <option value="blocker">Blocker</option>
                    <option value="change">Change</option>
                    <option value="review">Review</option>
                    <option value="deploy">Deploy</option>
                  </select>
                </Field>
                <Field label="Title">
                  <Input value={logDraft.title} onChange={(event) => setLogDraft((draft) => ({ ...draft, title: event.target.value }))} />
                </Field>
                <Field label="Body">
                  <Textarea value={logDraft.body} onChange={(event) => setLogDraft((draft) => ({ ...draft, body: event.target.value }))} />
                </Field>
                <Button onClick={addLogEntry} disabled={!logDraft.title.trim() || !logDraft.body.trim()}><Plus className="size-4" /> Add log entry</Button>
              </div>
              <div className="space-y-3">
                {project.log.map((entry) => (
                  <article key={entry.id} className="rounded-[18px] border border-[#d2ded8] bg-[#fbfdfb] p-5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-[#e5efe9] px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-[#34554b]">{entry.type}</span>
                      <time className="text-xs text-[#60746d]">{new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.createdAt))}</time>
                    </div>
                    <h3 className="mt-3 font-semibold">{entry.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#60746d]">{entry.body}</p>
                  </article>
                ))}
                {project.log.length === 0 && (
                  <div className="rounded-[18px] border border-dashed border-[#b9cac2] bg-[#fbfdfb] p-8 text-center">
                    <CheckCircle2 className="mx-auto size-8 text-[#37a987]" />
                    <p className="mt-3 text-sm font-semibold">No local log entries yet</p>
                    <p className="mt-1 text-xs text-[#60746d]">Add decisions, blockers, review notes, or deployment notes as the project matures.</p>
                  </div>
                )}
              </div>
            </div>
          </Panel>

          <footer className="mt-8 flex flex-col justify-between gap-3 border-t border-[#d2ded8] py-6 text-xs text-[#60746d] md:flex-row">
            <p>Native OS stores data locally under <code className="font-mono">native-os:v1</code>. Hydrated: {hydrated ? "yes" : "no"}.</p>
            <p>{copyStatus ?? "No external API calls are required for core workflows."}</p>
          </footer>
        </div>
      </div>
    </main>
  );
}
