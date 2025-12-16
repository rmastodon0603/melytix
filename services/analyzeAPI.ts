import {
  saveAnalysisToHistory,
  type StoredAnalysisEntry,
} from "./storage";

export type AnalysisItem = {
  title: string;
  details?: string;
  level?: string;
  impact?: string;
  metric?: string;
  // Allow additional fields without breaking
  [key: string]: unknown;
};

export type AnalyzeResponse = {
  insights: AnalysisItem[];
  alerts: AnalysisItem[];
  recommendations: AnalysisItem[];
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

