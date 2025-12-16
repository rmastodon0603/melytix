import type { Recommendation } from "../services/analyzeAPI";

type RecommendationCardNewProps = {
  recommendation: Recommendation;
};

export default function RecommendationCardNew({
  recommendation,
}: RecommendationCardNewProps) {
  const priorityColors = {
    high: "bg-red-600 text-white",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-zinc-100 text-zinc-700",
  };

  const priorityLabels = {
    high: "High",
    medium: "Medium",
    low: "Low",
  };

  return (
    <article className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-4 text-sm shadow-sm">
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="flex-1 font-semibold text-zinc-900">
            {recommendation.title}
          </h3>
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityColors[recommendation.priority] || priorityColors.medium}`}
          >
            {priorityLabels[recommendation.priority] || "Medium"}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-zinc-600">
          {recommendation.rationale}
        </p>

        {Array.isArray(recommendation.actions) &&
        recommendation.actions.length > 0 ? (
          <div className="space-y-1.5">
            <div className="text-xs font-medium text-zinc-700">Actions:</div>
            <ul className="ml-4 list-disc space-y-1 text-xs text-zinc-600">
              {recommendation.actions.map((action, idx) => (
                <li key={idx} className="leading-relaxed">
                  {action}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {recommendation.expected_impact && (
          <div className="rounded-md bg-emerald-50 px-3 py-2 text-xs">
            <div className="font-medium text-emerald-900">
              Expected Impact:
            </div>
            <div className="mt-0.5 leading-relaxed text-emerald-800">
              {recommendation.expected_impact}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

