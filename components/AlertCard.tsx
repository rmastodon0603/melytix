import type { AnalysisItem } from "../services/analyzeAPI";

type AlertCardProps = {
  item: AnalysisItem;
};

export default function AlertCard({ item }: AlertCardProps) {
  const { title, details, level } = item;

  // Map logical level to visual severity
  const severity: "low" | "medium" | "high" =
    level === "critical" ? "high" : level === "positive" ? "low" : "medium";

  const color =
    severity === "high"
      ? "border-red-400 bg-red-50"
      : severity === "low"
        ? "border-emerald-200 bg-emerald-50"
        : "border-amber-300 bg-amber-50";

  return (
    <article
      className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm ${color}`}
    >
      <h3 className="font-semibold text-zinc-900 text-sm md:text-base">
        {title || "Alert"}
      </h3>
      {details && (
        <p className="mt-2 text-xs md:text-sm leading-relaxed text-zinc-700">
          {details}
        </p>
      )}
    </article>
  );
}

