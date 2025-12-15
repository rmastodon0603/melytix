import type { AnalysisItem } from "../services/analyzeAPI";

type RecommendationCardProps = {
  item: AnalysisItem;
};

export default function RecommendationCard({ item }: RecommendationCardProps) {
  const { title, details, impact = "medium" } = item;

  const badgeColor =
    impact === "high"
      ? "bg-emerald-600 text-white"
      : impact === "low"
        ? "bg-zinc-100 text-zinc-700"
        : "bg-emerald-100 text-emerald-700";

  return (
    <article className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-zinc-900 text-sm md:text-base">
          {title || "Recommendation"}
        </h3>
        <span className={`rounded-full px-2 py-0.5 text-[10px] ${badgeColor}`}>
          Impact: {impact}
        </span>
      </div>
      {details && (
        <p className="mt-2 text-xs md:text-sm leading-relaxed text-zinc-600">
          {details}
        </p>
      )}
    </article>
  );
}

