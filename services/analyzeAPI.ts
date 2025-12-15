import { appendReport, saveLastAnalysis } from "./storage";

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
): Promise<AnalyzeResponse> {
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

  // Persist last analysis using storage service
  saveLastAnalysis(data);

  // Also append a simple history entry
  try {
    const alertsCount = Array.isArray(data.alerts) ? data.alerts.length : 0;
    const insightsCount = Array.isArray(data.insights)
      ? data.insights.length
      : 0;
    const recsCount = Array.isArray(data.recommendations)
      ? data.recommendations.length
      : 0;

    const summary = `${alertsCount} alerts, ${insightsCount} insights, ${recsCount} recommendations`;
    const raw: any = data.raw ?? {};

    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : String(Date.now());

    appendReport({
      id,
      createdAt: new Date().toISOString(),
      fileName: raw.currentFileName ?? undefined,
      summary,
      result: data,
    });
  } catch {
    // history is a best-effort feature; ignore failures
  }

  return data;
}

