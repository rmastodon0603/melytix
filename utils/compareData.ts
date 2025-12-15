// Comparison of two metric datasets

export type MetricPoint = {
  metric: string;
  value: number;
};

export type MetricDiff = {
  metric: string;
  baseline: number | null;
  current: number | null;
  delta: number | null;
  deltaPercent: number | null;
};

export function compareData(
  baseline: MetricPoint[],
  current: MetricPoint[],
): MetricDiff[] {
  const baselineMap = new Map(baseline.map((m) => [m.metric, m.value]));
  const currentMap = new Map(current.map((m) => [m.metric, m.value]));

  const metrics = new Set([
    ...Array.from(baselineMap.keys()),
    ...Array.from(currentMap.keys()),
  ]);

  const results: MetricDiff[] = [];

  metrics.forEach((metric) => {
    const b = baselineMap.get(metric) ?? null;
    const c = currentMap.get(metric) ?? null;

    const delta =
      b !== null && c !== null
        ? Number((c - b).toFixed(4))
        : null;
    const deltaPercent =
      b !== null && c !== null && b !== 0
        ? Number((((c - b) / b) * 100).toFixed(2))
        : null;

    results.push({
      metric,
      baseline: b,
      current: c,
      delta,
      deltaPercent,
    });
  });

  return results;
}


