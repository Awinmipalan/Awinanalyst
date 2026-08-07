export interface NumericProfile {
  count: number;
  missing: number;
  mean: number;
  median: number;
  min: number;
  max: number;
  stdDev: number;
  outliers: number;
}

export interface ColumnProfile {
  name: string;
  type: "numeric" | "date" | "boolean" | "categorical" | "text" | "empty";
  count: number;
  missing: number;
  missingRate: number;
  unique: number;
  uniqueRate: number;
  numeric?: NumericProfile;
  topValues?: Array<{ value: string; count: number }>;
}

export interface Correlation {
  columnA: string;
  columnB: string;
  coefficient: number;
}

export interface DatasetProfile {
  rowCount: number;
  columnCount: number;
  duplicateRows: number;
  columns: ColumnProfile[];
  correlations: Correlation[];
}

const isMissing = (value: unknown) =>
  value === null || value === undefined || (typeof value === "string" && value.trim() === "");

const toNumber = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const n = Number(value.replace(/,/g, ""));
    return Number.isFinite(n) ? n : null;
  }
  return null;
};

const round = (n: number, digits = 4) => Math.round(n * 10 ** digits) / 10 ** digits;

const percentile = (sorted: number[], p: number) => {
  if (!sorted.length) return 0;
  const index = (sorted.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sorted[lower];
  return sorted[lower] + (sorted[upper] - sorted[lower]) * (index - lower);
};

const looksLikeDate = (values: unknown[]) => {
  const candidates = values.filter(v => !isMissing(v)).filter(v =>
    typeof v === "string" && !/^\d+(\.\d+)?$/.test(v)
  );
  if (candidates.length < 3) return false;
  const parsed = candidates.filter(v => !Number.isNaN(Date.parse(v as string)));
  return parsed.length / candidates.length >= 0.8;
};

const numericStats = (values: number[]): NumericProfile => {
  const sorted = [...values].sort((a, b) => a - b);
  const count = sorted.length;
  const mean = values.reduce((sum, n) => sum + n, 0) / count;
  const variance = count > 1
    ? values.reduce((sum, n) => sum + (n - mean) ** 2, 0) / (count - 1)
    : 0;
  const q1 = percentile(sorted, 0.25);
  const q3 = percentile(sorted, 0.75);
  const iqr = q3 - q1;
  return {
    count,
    missing: 0,
    mean: round(mean),
    median: round(percentile(sorted, 0.5)),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    stdDev: round(Math.sqrt(variance)),
    outliers: values.filter(n => n < q1 - 1.5 * iqr || n > q3 + 1.5 * iqr).length
  };
};

const pearson = (a: number[], b: number[]) => {
  const n = Math.min(a.length, b.length);
  if (n < 3) return null;
  const x = a.slice(0, n);
  const y = b.slice(0, n);
  const meanX = x.reduce((s, v) => s + v, 0) / n;
  const meanY = y.reduce((s, v) => s + v, 0) / n;
  let numerator = 0, denomX = 0, denomY = 0;
  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }
  const denominator = Math.sqrt(denomX * denomY);
  return denominator === 0 ? null : round(numerator / denominator);
};

export function profileDataset(dataset: Record<string, unknown>[], columns: string[]): DatasetProfile {
  const profiles: ColumnProfile[] = [];
  const numericColumns: Array<{ name: string; values: number[] }> = [];

  for (const name of columns) {
    const raw = dataset.map(row => row?.[name]);
    const present = raw.filter(v => !isMissing(v));
    const missing = raw.length - present.length;
    const numericValues = present.map(toNumber).filter((v): v is number => v !== null);
    const numericRate = present.length ? numericValues.length / present.length : 0;
    const uniqueValues = new Set(present.map(String));
    const counts = new Map<string, number>();
    present.forEach(value => counts.set(String(value), (counts.get(String(value)) || 0) + 1));

    let type: ColumnProfile["type"] = "text";
    if (!present.length) type = "empty";
    else if (numericRate >= 0.9) type = "numeric";
    else if (looksLikeDate(present)) type = "date";
    else if (present.every(v => typeof v === "boolean")) type = "boolean";
    else if (uniqueValues.size <= Math.min(30, Math.max(10, dataset.length * 0.1))) type = "categorical";

    const profile: ColumnProfile = {
      name,
      type,
      count: present.length,
      missing,
      missingRate: dataset.length ? round(missing / dataset.length) : 0,
      unique: uniqueValues.size,
      uniqueRate: dataset.length ? round(uniqueValues.size / dataset.length) : 0
    };

    if (type === "numeric") {
      const stats = numericStats(numericValues);
      stats.missing = missing;
      profile.numeric = stats;
      numericColumns.push({ name, values: numericValues });
    }
    if (type === "categorical" || type === "boolean") {
      profile.topValues = [...counts.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([value, count]) => ({ value, count }));
    }
    profiles.push(profile);
  }

  const seen = new Map<string, number>();
  dataset.forEach(row => {
    const key = JSON.stringify(row);
    seen.set(key, (seen.get(key) || 0) + 1);
  });
  const duplicateRows = [...seen.values()]
    .filter(count => count > 1)
    .reduce((sum, count) => sum + count - 1, 0);

  const correlations: Correlation[] = [];
  for (let i = 0; i < numericColumns.length; i++) {
    for (let j = i + 1; j < numericColumns.length; j++) {
      const coefficient = pearson(numericColumns[i].values, numericColumns[j].values);
      if (coefficient !== null && Math.abs(coefficient) >= 0.3) {
        correlations.push({ columnA: numericColumns[i].name, columnB: numericColumns[j].name, coefficient });
      }
    }
  }
  correlations.sort((a, b) => Math.abs(b.coefficient) - Math.abs(a.coefficient));

  return {
    rowCount: dataset.length,
    columnCount: columns.length,
    duplicateRows,
    columns: profiles,
    correlations: correlations.slice(0, 10)
  };
}
