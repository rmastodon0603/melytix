"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import OverviewSection from "../../../components/OverviewSection";
import DriverCard from "../../../components/DriverCard";
import RecommendationCardNew from "../../../components/RecommendationCardNew";
import {
  type AnalyzeResponse,
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

  // Check if this is the new narrative structure
  const isNewStructure = analysis && "overview" in analysis && "drivers" in analysis;

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

        {analysis && isNewStructure ? (
          <div className="space-y-8">
            {/* Context Section (Custom Instructions) */}
            {(entry?.source?.customInstructions || analysis.meta?.customInstructions) && (
              <section>
                <details className="group rounded-lg border border-zinc-200 bg-white">
                  <summary className="cursor-pointer px-4 py-3 text-xs font-semibold uppercase tracking-wide text-zinc-700 hover:bg-zinc-50">
                    Context used for analysis
                  </summary>
                  <div className="border-t border-zinc-200 px-4 py-3">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">
                      {entry?.source?.customInstructions || analysis.meta?.customInstructions}
                    </p>
                  </div>
                </details>
              </section>
            )}

            {/* Overview Section */}
            {analysis.overview && (
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
                    Overview
                  </h2>
                  <CopyJsonButton data={analysis} />
                </div>
                <OverviewSection overview={analysis.overview} />
              </section>
            )}

            {/* Drivers Section */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700 mb-3">
                Why It Happened
              </h2>
              {Array.isArray(analysis.drivers) && analysis.drivers.length > 0 ? (
                <div className="space-y-3">
                  {analysis.drivers.map((driver, index) => (
                    <DriverCard key={index} driver={driver} />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500">
                  No drivers identified in this analysis.
                </p>
              )}
            </section>

            {/* Recommendations Section */}
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700 mb-3">
                Recommendations
              </h2>
              {Array.isArray(analysis.recommendations) &&
              analysis.recommendations.length > 0 ? (
                <div className="space-y-3">
                  {analysis.recommendations.map((rec, index) => (
                    <RecommendationCardNew
                      key={index}
                      recommendation={rec}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-xs text-zinc-500">
                  No recommendations were generated.
                </p>
              )}
            </section>
          </div>
        ) : analysis ? (
          // Fallback for old structure (backward compatibility)
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-sm text-amber-800">
            This analysis uses an older format. Please run a new analysis to see the updated narrative structure.
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



