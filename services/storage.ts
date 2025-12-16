const HISTORY_KEY = "melytix:history";
const LAST_ANALYSIS_ID_KEY = "melytix:lastAnalysisId";

import type { AnalyzeResponse } from "./analyzeAPI";

export type StoredAnalysisEntry = {
  id: string;
  createdAt: string;
  summary: string;
  source?: {
    currentFileName?: string;
    previousFileName?: string;
    customInstructions?: string;
  };
  result: AnalyzeResponse;
};

function safeParse<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function readHistory(): StoredAnalysisEntry[] {
  if (typeof window === "undefined") return [];
  const parsed = safeParse<StoredAnalysisEntry[]>(window.localStorage.getItem(HISTORY_KEY));
  return Array.isArray(parsed) ? parsed : [];
}

function writeHistory(list: StoredAnalysisEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
}

function setLastAnalysisId(id: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LAST_ANALYSIS_ID_KEY, id);
}

function getLastAnalysisId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LAST_ANALYSIS_ID_KEY);
}

function generateSummary(result: AnalyzeResponse): string {
  // New narrative structure: use overview headline if available
  if (result.overview?.headline) {
    const driversCount = Array.isArray(result.drivers) ? result.drivers.length : 0;
    const recsCount = Array.isArray(result.recommendations)
      ? result.recommendations.length
      : 0;
    const direction = result.overview.direction || "mixed";
    return `${result.overview.headline} (${direction}) • ${driversCount} drivers • ${recsCount} recs`;
  }

  // Fallback for old structure (backward compatibility)
  const alertsCount = Array.isArray((result as any).alerts) ? (result as any).alerts.length : 0;
  const insightsCount = Array.isArray((result as any).insights)
    ? (result as any).insights.length
    : 0;
  const recsCount = Array.isArray(result.recommendations)
    ? result.recommendations.length
    : 0;

  const firstTitle =
    ((result as any).alerts?.[0] as any)?.title ||
    ((result as any).insights?.[0] as any)?.title ||
    (result.recommendations?.[0] as any)?.title;

  const counts = `${alertsCount} alerts • ${insightsCount} insights • ${recsCount} recs`;
  return firstTitle ? `${firstTitle} — ${counts}` : counts;
}

function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function saveAnalysisToHistory(
  result: AnalyzeResponse,
  meta?: { currentFileName?: string; previousFileName?: string; customInstructions?: string },
): StoredAnalysisEntry {
  if (typeof window === "undefined") {
    // If somehow called server-side, just return a synthetic entry
    return {
      id: newId(),
      createdAt: new Date().toISOString(),
      summary: generateSummary(result),
      source: meta,
      result,
    };
  }

  const entry: StoredAnalysisEntry = {
    id: newId(),
    createdAt: new Date().toISOString(),
    summary: generateSummary(result),
    source: meta,
    result,
  };

  const history = readHistory();
  history.unshift(entry);
  writeHistory(history);
  setLastAnalysisId(entry.id);

  return entry;
}

export function getHistoryList(): Array<
  Pick<StoredAnalysisEntry, "id" | "createdAt" | "summary" | "source">
> {
  const history = readHistory();
  return history.map(({ id, createdAt, summary, source }) => ({
    id,
    createdAt,
    summary,
    source,
  }));
}

export function getAnalysisById(id: string): StoredAnalysisEntry | null {
  const history = readHistory();
  return history.find((item) => item.id === id) ?? null;
}

export function getLastAnalysis(): StoredAnalysisEntry | null {
  const history = readHistory();
  if (!history.length) return null;

  const lastId = getLastAnalysisId();
  if (lastId) {
    const byId = history.find((h) => h.id === lastId);
    if (byId) return byId;
  }

  return history[0] ?? null;
}

export function deleteAnalysisById(id: string) {
  if (typeof window === "undefined") return;
  const history = readHistory();
  const next = history.filter((h) => h.id !== id);
  writeHistory(next);
}

export function clearHistory() {
  if (typeof window === "undefined") return;
  writeHistory([]);
  window.localStorage.removeItem(LAST_ANALYSIS_ID_KEY);
}

