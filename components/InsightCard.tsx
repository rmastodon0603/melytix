type InsightCardProps = {
  title: string;
  metric?: string;
  description: string;
};

export default function InsightCard({
  title,
  metric,
  description,
}: InsightCardProps) {
  return (
    <article className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-semibold text-zinc-900">{title}</h3>
        {metric && (
          <span className="text-xs font-medium text-emerald-600">
            {metric}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs text-zinc-600">{description}</p>
    </article>
  );
}


