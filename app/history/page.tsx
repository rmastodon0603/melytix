"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getHistoryList,
  type StoredAnalysisEntry,
} from "../../services/storage";

export default function HistoryPage() {
  const [history, setHistory] = useState<
    Array<Pick<StoredAnalysisEntry, "id" | "createdAt" | "summary" | "source">>
  >([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const items = getHistoryList();
    setHistory(items);
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen w-full bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Analysis History
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            Your past Google Ads analyses, stored locally on this device.
          </p>
        </header>

        {!loaded ? (
          <p className="text-sm text-zinc-500">Loading history…</p>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-6 text-sm text-zinc-600">
            No history yet. Run an analysis first.
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white text-sm">
            <table className="min-w-full divide-y divide-zinc-200">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
                    Date
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
                    Summary
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
                    Files
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
                    Notes
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-zinc-700">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {history.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 align-top text-xs text-zinc-700">
                      {new Date(item.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 align-top text-xs text-zinc-700">
                      {item.summary}
                    </td>
                    <td className="px-4 py-2 align-top text-[11px] text-zinc-500">
                      {item.source?.currentFileName || item.source?.previousFileName
                        ? `${item.source?.currentFileName ?? "current"} vs ${item.source?.previousFileName ?? "previous"}`
                        : "—"}
                    </td>
                    <td className="px-4 py-2 align-top text-xs text-zinc-500">
                      {item.source?.customInstructions ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-700">
                          Has notes
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-2 align-top text-xs text-emerald-700">
                      <Link
                        href={`/results/${item.id}`}
                        className="font-medium underline-offset-4 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

