"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getHistoryList } from "../services/storage";

const navItems = [
  { label: "Upload", href: "/" },
  { label: "Results", href: "/results" },
  { label: "History", href: "/history" },
];

export default function Sidebar() {
  const [recent, setRecent] = useState<
    Array<{ id: string; summary: string }> | null
  >(null);

  useEffect(() => {
    const list = getHistoryList()
      .slice(0, 5)
      .map((item) => ({ id: item.id, summary: item.summary }));
    setRecent(list);
  }, []);

  return (
    <aside className="flex h-full flex-col px-4 py-6 text-sm text-zinc-800">
      <div className="mb-6 flex items-center gap-2 text-lg font-semibold text-emerald-700">
        Melytix
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-md px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {recent && recent.length > 0 && (
        <div className="mt-8 space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Recent analyses
          </h3>
          <div className="space-y-1">
            {recent.map((item) => (
              <Link
                key={item.id}
                href={`/results/${item.id}`}
                className="block rounded-md px-3 py-2 text-xs text-zinc-700 hover:bg-zinc-100"
                title={item.summary}
              >
                {item.summary.slice(0, 60)}
                {item.summary.length > 60 ? "…" : ""}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}


