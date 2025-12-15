type AlertCardProps = {
  title: string;
  description: string;
  severity?: "low" | "medium" | "high";
};

export default function AlertCard({
  title,
  description,
  severity = "medium",
}: AlertCardProps) {
  const color =
    severity === "high"
      ? "border-red-400 bg-red-50"
      : severity === "low"
        ? "border-amber-200 bg-amber-50"
        : "border-amber-300 bg-amber-50";

  return (
    <article
      className={`w-full rounded-xl border px-4 py-3 text-sm shadow-sm ${color}`}
    >
      <h3 className="font-semibold text-zinc-900">{title}</h3>
      <p className="mt-1 text-xs text-zinc-700">{description}</p>
    </article>
  );
}


