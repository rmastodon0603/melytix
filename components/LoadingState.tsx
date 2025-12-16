export default function LoadingState() {
  return (
    <div className="flex w-full items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
      <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-400 border-t-transparent" />
      <span>Analyzing your data, this may take a few seconds…</span>
    </div>
  );
}



