import type { Driver } from "../services/analyzeAPI";

type DriverCardProps = {
  driver: Driver;
};

export default function DriverCard({ driver }: DriverCardProps) {
  const levelLabels: Record<string, string> = {
    account: "Account",
    campaign: "Campaign",
    ad_group: "Ad Group",
    ad: "Ad",
    geo: "Geography",
    device: "Device",
  };

  return (
    <article className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-4 text-sm shadow-sm">
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-zinc-900">{driver.title}</h3>
          <p className="mt-1 text-xs leading-relaxed text-zinc-600">
            {driver.what_changed}
          </p>
        </div>

        {driver.where && (
          <div className="rounded-md bg-zinc-50 px-2 py-1.5 text-xs">
            <span className="font-medium text-zinc-700">Where: </span>
            <span className="text-zinc-600">
              {levelLabels[driver.where.level] || driver.where.level} —{" "}
              {driver.where.name}
            </span>
          </div>
        )}

        {Array.isArray(driver.evidence) && driver.evidence.length > 0 && (
          <div className="space-y-2">
            <div className="text-xs font-medium text-zinc-700">Evidence:</div>
            <div className="space-y-1.5">
              {driver.evidence.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-3 rounded-md bg-zinc-50 px-2 py-1.5 text-xs"
                >
                  <div className="flex-1">
                    <span className="font-medium text-zinc-700">
                      {item.metric}:
                    </span>{" "}
                    <span className="text-zinc-600">
                      {String(item.previous)} → {String(item.current)}
                    </span>
                    {item.notes && (
                      <div className="mt-0.5 text-zinc-500">{item.notes}</div>
                    )}
                  </div>
                  <div
                    className={`shrink-0 font-medium ${
                      String(item.delta_pct).startsWith("-")
                        ? "text-red-600"
                        : String(item.delta_pct).startsWith("+") ||
                            parseFloat(String(item.delta_pct)) > 0
                          ? "text-emerald-600"
                          : "text-zinc-600"
                    }`}
                  >
                    {String(item.delta_pct).startsWith("-") ||
                    String(item.delta_pct).startsWith("+")
                      ? item.delta_pct
                      : `+${item.delta_pct}`}
                    %
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {driver.why_hypothesis && (
          <div className="rounded-md border-l-2 border-amber-300 bg-amber-50 px-3 py-2 text-xs">
            <div className="font-medium text-amber-900">Hypothesis:</div>
            <div className="mt-0.5 leading-relaxed text-amber-800">
              {driver.why_hypothesis}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

