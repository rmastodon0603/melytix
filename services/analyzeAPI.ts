import {
  saveAnalysisToHistory,
  type StoredAnalysisEntry,
} from "./storage";

// New narrative structure types
export type KeyChange = {
  metric: string;
  current: string | number;
  previous: string | number;
  delta_abs: string | number;
  delta_pct: string | number;
  interpretation: string;
};

export type Overview = {
  headline: string;
  summary: string;
  direction: "up" | "down" | "flat" | "mixed";
  key_changes: KeyChange[];
};

export type EvidenceItem = {
  metric: string;
  current: string | number;
  previous: string | number;
  delta_pct: string | number;
  notes: string;
};

export type Driver = {
  title: string;
  what_changed: string;
  evidence: EvidenceItem[];
  where: {
    level: "account" | "campaign" | "ad_group" | "ad" | "geo" | "device";
    name: string;
  };
  why_hypothesis: string;
};

export type Recommendation = {
  title: string;
  rationale: string;
  actions: string[];
  expected_impact: string;
  priority: "high" | "medium" | "low";
};

export type AnalyzeResponse = {
  overview: Overview;
  drivers: Driver[];
  recommendations: Recommendation[];
  raw?: {
    currentFileName?: string;
    previousFileName?: string;
    [key: string]: unknown;
  };
};

export type RunAnalysisInput = {
  current: File;
  previous: File;
};

// Logic for calling /api/analyze with FormData
export async function runAnalysis(
  input: RunAnalysisInput,
): Promise<StoredAnalysisEntry> {
  // Use FormData to send raw files to the backend
  const formData = new FormData();
  formData.append("current", input.current);
  formData.append("previous", input.previous);

  const res = await fetch("/api/analyze", {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Failed to analyze dataset");
  }

  const data = (await res.json()) as AnalyzeResponse;

  // Persist to history (also sets lastAnalysisId)
  const entry = saveAnalysisToHistory(data, {
    currentFileName: (data.raw as any)?.currentFileName,
    previousFileName: (data.raw as any)?.previousFileName,
  });

  return entry;
}

