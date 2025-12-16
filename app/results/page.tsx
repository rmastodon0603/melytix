"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { getLastAnalysis } from "../../services/storage";

export default function ResultsPage() {
  const router = useRouter();

  useEffect(() => {
    const last = getLastAnalysis();
    if (last?.id) {
      router.replace(`/results/${last.id}`);
    }
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 py-10">
      <div className="rounded-xl border border-dashed border-zinc-300 bg-white px-6 py-8 text-sm text-zinc-600">
        Loading last analysis…
      </div>
    </main>
  );
}

