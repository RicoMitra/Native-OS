import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, beforeEach, vi } from "vitest";
import { NativeOsWorkspace } from "@/components/native-os-workspace";
import { STORAGE_KEY } from "@/lib/native-os";

Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe("NativeOsWorkspace", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.clearAllMocks();
  });

  it("edits the project brief and persists it locally", async () => {
    render(<NativeOsWorkspace />);

    const name = await screen.findByLabelText(/Project name/i);
    fireEvent.change(name, { target: { value: "Offline Launch Kit" } });

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain("Offline Launch Kit");
    });
  });

  it("updates workflow checks and readiness progress", async () => {
    render(<NativeOsWorkspace />);

    const riskCheck = await screen.findByLabelText(/Risks listed/i);
    fireEvent.click(riskCheck);

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain('"checked":true');
    });
    expect(screen.getByText(/workflow checks complete/i)).toBeInTheDocument();
  });

  it("copies generated Codex prompt text", async () => {
    render(<NativeOsWorkspace />);

    fireEvent.click(await screen.findByRole("button", { name: /Copy prompt/i }));

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expect.stringContaining("You are the Planner agent"));
    });
  });

  it("adds a project log entry", async () => {
    render(<NativeOsWorkspace />);

    fireEvent.change(await screen.findByLabelText(/^Title$/i), { target: { value: "Reviewed IA" } });
    fireEvent.change(await screen.findByLabelText(/^Body$/i), { target: { value: "Navigation and readiness factors checked." } });
    fireEvent.click(screen.getByRole("button", { name: /Add log entry/i }));

    expect(await screen.findByText("Reviewed IA")).toBeInTheDocument();
    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain("Reviewed IA");
    });
  });

  it("resets to a blank project without touching other storage keys", async () => {
    window.localStorage.setItem("stock-portfolio-dashboard:v1", "keep");
    render(<NativeOsWorkspace />);

    fireEvent.click(await screen.findByRole("button", { name: /Blank project/i }));

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEY)).toContain('"projects"');
    });
    expect(window.localStorage.getItem("stock-portfolio-dashboard:v1")).toBe("keep");
  });
});
