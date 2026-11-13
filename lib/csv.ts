type Row = {
  id: string;
  created_at: string;
  respondent_label: string | null;
  answers: Record<string, { chips?: string[]; comment?: string }>;
};

function escapeCsv(value: string): string {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function responsesToCsv(rows: Row[]): string {
  const questionIds = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row.answers ?? {})) {
      questionIds.add(key);
    }
  }
  const sortedIds = [...questionIds].sort();

  const header = ["id", "created_at", "respondent_label", ...sortedIds.flatMap((q) => [`${q}_chips`, `${q}_comment`])];

  const lines = [header.join(",")];
  for (const row of rows) {
    const cells: string[] = [
      escapeCsv(row.id),
      escapeCsv(String(row.created_at)),
      escapeCsv(row.respondent_label ?? ""),
    ];
    for (const q of sortedIds) {
      const a = row.answers?.[q];
      cells.push(escapeCsv((a?.chips ?? []).join(" | ")));
      cells.push(escapeCsv(a?.comment ?? ""));
    }
    lines.push(cells.join(","));
  }
  return lines.join("\n");
}
