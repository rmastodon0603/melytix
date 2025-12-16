// Parsing .csv / .xls into JSON
// NOTE: This is a minimal placeholder implementation. For production use,
// consider using a library like PapaParse (CSV) and SheetJS (XLS/XLSX).

export type ParsedRow = Record<string, string | number | null>;

export function parseCSV(text: string, delimiter = ","): ParsedRow[] {
  const [headerLine, ...rows] = text.split(/\r?\n/).filter(Boolean);
  if (!headerLine) return [];

  const headers = headerLine.split(delimiter).map((h) => h.trim());

  return rows.map((row) => {
    const values = row.split(delimiter);
    const record: ParsedRow = {};

    headers.forEach((header, index) => {
      const raw = values[index]?.trim() ?? "";
      const num = Number(raw);
      record[header] = raw === "" ? null : isNaN(num) ? raw : num;
    });

    return record;
  });
}




