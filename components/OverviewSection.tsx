import type { Overview, KeyChange } from "../services/analyzeAPI";

type OverviewSectionProps = {
  overview: Overview;
};

export default function OverviewSection({ overview }: OverviewSectionProps) {
  const directionColors = {
    up: "text-emerald-600 bg-emerald-50 border-emerald-200",
    down: "text-red-600 bg-red-50 border-red-200",
    flat: "text-zinc-600 bg-zinc-50 border-zinc-200",
    mixed: "text-amber-600 bg-amber-50 border-amber-200",
  };

  const directionLabels = {
    up: "↑ Improved",
    down: "↓ Declined",
    flat: "→ Flat",
    mixed: "↕ Mixed",
  };

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-zinc-900">
            {overview.headline}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-700">
            {overview.summary}
          </p>
        </div>
        <div
          className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium ${directionColors[overview.direction] || directionColors.mixed}`}
        >
          {directionLabels[overview.direction] || "Mixed"}
        </div>
      </div>

      {Array.isArray(overview.key_changes) &&
      overview.key_changes.length > 0 ? (
        <div className="rounded-lg border border-zinc-200 bg-white">
          <div className="border-b border-zinc-200 bg-zinc-50 px-4 py-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-700">
              Key Changes
            </h3>
          </div>
          <div className="divide-y divide-zinc-100">
            {overview.key_changes.map((change: KeyChange, index: number) => (
              <div key={index} className="px-4 py-3 text-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="font-medium text-zinc-900">
                      {change.metric}
                    </div>
                    <div className="mt-1 text-xs text-zinc-600">
                      {change.interpretation}
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-xs text-zinc-500">
                      {String(change.previous)} → {String(change.current)}
                    </div>
                    <div
                      className={`mt-0.5 text-xs font-medium ${
                        String(change.delta_pct).startsWith("-")
                          ? "text-red-600"
                          : String(change.delta_pct).startsWith("+") ||
                              parseFloat(String(change.delta_pct)) > 0
                            ? "text-emerald-600"
                            : "text-zinc-600"
                      }`}
                    >
                      {String(change.delta_pct).startsWith("-") ||
                      String(change.delta_pct).startsWith("+")
                        ? change.delta_pct
                        : `+${change.delta_pct}`}
                      %
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

