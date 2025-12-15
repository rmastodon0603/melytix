"use client";

import AlertCard from "../../components/AlertCard";
import InsightCard from "../../components/InsightCard";
import RecommendationCard from "../../components/RecommendationCard";
import { AnalyzeResponse } from "../../services/analyzeAPI";
import { loadLastAnalysis } from "../../services/storage";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const [analysis, setAnalysis] = useState<AnalyzeResponse | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = loadLastAnalysis();
    if (stored && stored.result) {
      setAnalysis(stored.result as AnalyzeResponse);
    }
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen w-full bg-zinc-50 px-4 py-10">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Analysis Results
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            A summary of alerts, insights and recommendations from your last
            Google Ads analysis.
          </p>
        </header>

        {!loaded ? (
          <p className="text-sm text-zinc-500">Loading last analysis…</p>
        ) : !analysis ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-6 text-sm text-zinc-600">
            No analysis found. Please run an analysis from the main page.
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-700">
                Alerts
              </h2>
              {Array.isArray(analysis.alerts) && analysis.alerts.length > 0 ? (
                <div className="mt-3 space-y-3">
                  {analysis.alerts.map((alert: any) => (
                    <AlertCard
                      key={alert.id ?? alert.title}
                      title={alert.title}
                      description={alert.description}
                      severity={alert.severity}
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
                  {analysis.insights.map((insight: any) => (
                    <InsightCard
                      key={insight.id ?? insight.title}
                      title={insight.title}
                      metric={insight.metric}
                      description={insight.description}
                    />
                  ))}
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
                  {analysis.recommendations.map((rec: any) => (
                    <RecommendationCard
                      key={rec.id ?? rec.title}
                      title={rec.title}
                      description={rec.description}
                      impact={rec.impact}
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-xs text-zinc-500">
                  No recommendations were generated.
                </p>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

