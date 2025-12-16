"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import AlertCard from "../../../components/AlertCard";
import InsightCard from "../../../components/InsightCard";
import RecommendationCard from "../../../components/RecommendationCard";
import {
  type AnalyzeResponse,
  type AnalysisItem,
} from "../../../services/analyzeAPI";
import {
  getAnalysisById,
  type StoredAnalysisEntry,
} from "../../../services/storage";

function formatDate(value: string) {
  const date = new Date(value);
  return isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function ResultsByIdPage() {
  const params = useParams<{ id: string }>();
  const id = useMemo(() => (Array.isArray(params?.id) ? params.id[0] : params?.id), [params]);

  const [entry, setEntry] = useState<StoredAnalysisEntry | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!id) return;
    const found = getAnalysisById(id);
    setEntry(found ?? null);
    setLoaded(true);
  }, [id]);

  const analysis: AnalyzeResponse | null = entry?.result ?? null;

  return (
    <main className="min-h-screen w-full bg-zinc-50 px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-zinc-900">
            Analysis Results
          </h1>
          {entry ? (
            <p className="text-xs md:text-sm text-zinc-600">
              {formatDate(entry.createdAt)}
              {entry.source?.currentFileName || entry.source?.previousFileName
                ? ` • ${entry.source?.currentFileName ?? "current"} vs ${entry.source?.previousFileName ?? "previous"}`
                : ""}
            </p>
          ) : (
            <p className="text-sm text-zinc-600">
              {loaded
                ? "Analysis not found. Please run a new analysis."
                : "Loading analysis..."}
            </p>
          )}
        </header>

        {loaded && !analysis ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-6 text-sm text-zinc-600">
            Analysis not found. Please run a new analysis.
          </div>
        ) : null}

        {analysis ? (
          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
                  Alerts
                </h2>
                <CopyJsonButton data={analysis} />
              </div>
              {Array.isArray(analysis.alerts) && analysis.alerts.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {analysis.alerts.map((alert: AnalysisItem, index: number) => (
                    <AlertCard
                      key={(alert as any).id ?? alert.title ?? index}
                      item={alert}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs text-zinc-500">
                  No alerts detected in this analysis.
                </p>
              )}
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
                Insights
              </h2>
              {Array.isArray(analysis.insights) &&
              analysis.insights.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {analysis.insights.map(
                    (insight: AnalysisItem, index: number) => (
                      <InsightCard
                        key={(insight as any).id ?? insight.title ?? index}
                        item={insight}
                      />
                    ),
                  )}
                </div>
              ) : (
                <p className="mt-2 text-xs text-zinc-500">
                  No insights generated for this analysis.
                </p>
              )}
            </section>

            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
                Recommendations
              </h2>
              {Array.isArray(analysis.recommendations) &&
              analysis.recommendations.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {analysis.recommendations.map(
                    (rec: AnalysisItem, index: number) => (
                      <RecommendationCard
                        key={(rec as any).id ?? rec.title ?? index}
                        item={rec}
                      />
                    ),
                  )}
                </div>
              ) : (
                <p className="mt-2 text-xs text-zinc-500">
                  No recommendations were generated.
                </p>
              )}
            </section>
          </div>
        ) : null}
      </div>
    </main>
  );
}

function CopyJsonButton({ data }: { data: AnalyzeResponse }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy JSON", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="text-xs font-medium text-emerald-700 underline-offset-4 hover:underline"
    >
      {copied ? "Copied" : "Copy JSON"}
    </button>
  );
}


