import type { AnalysisItem } from "../services/analyzeAPI";

type InsightCardProps = {
  item: AnalysisItem;
};

export default function InsightCard({ item }: InsightCardProps) {
  const { title, details, metric } = item;

  return (
    <article className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold text-zinc-900 text-sm md:text-base">
          {title || "Insight"}
        </h3>
        {metric && (
          <span className="text-xs font-medium text-emerald-600">{metric}</span>
        )}
      </div>
      {details && (
        <p className="mt-2 text-xs md:text-sm leading-relaxed text-zinc-600">
          {details}
        </p>
      )}
    </article>
  );
}

