const HISTORY_KEY = "melytix:history";
const LAST_ANALYSIS_KEY = "melytix:last-analysis";

export type StoredReport = {
  id: string;
  createdAt: string;
  fileName?: string;
  summary: string;
  // Optional reference to full analysis result
  result?: unknown;
};

// Local storage helper for history
export function loadHistory(): StoredReport[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredReport[];
  } catch {
    return [];
  }
}

export function saveHistory(history: StoredReport[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function appendReport(report: StoredReport) {
  const history = loadHistory();
  history.unshift(report);
  saveHistory(history);
}

// "Last analysis" helpers
export function saveLastAnalysis(result: unknown) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    LAST_ANALYSIS_KEY,
    JSON.stringify({
      savedAt: new Date().toISOString(),
      result,
    }),
  );
}

export function loadLastAnalysis():
  | { savedAt: string; result: unknown }
  | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LAST_ANALYSIS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as { savedAt: string; result: unknown };
  } catch {
    return null;
  }
}

