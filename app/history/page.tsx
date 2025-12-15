"use client";

import { useEffect, useState } from "react";
import { loadHistory, type StoredReport } from "../../services/storage";

export default function HistoryPage() {
  const [history, setHistory] = useState<StoredReport[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const items = loadHistory();
    setHistory(items);
    setLoaded(true);
  }, []);

  return (
    <main className="min-h-screen w-full bg-zinc-50 px-4 py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-zinc-900">
            Reports History
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            A simple list of your past Google Ads analyses.
          </p>
        </header>

        {!loaded ? (
          <p className="text-sm text-zinc-500">Loading history…</p>
        ) : history.length === 0 ? (
          <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-4 py-6 text-sm text-zinc-600">
            No history yet.
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

