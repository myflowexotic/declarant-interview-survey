import { sql } from "@/lib/db";
import { responsesToCsv } from "@/lib/csv";
import { requireExportAccess } from "@/lib/export-auth";

type ResponseRow = {
  id: string;
  created_at: string;
  respondent_label: string | null;
  answers: Record<string, { chips?: string[]; comment?: string }>;
};

export async function GET(request: Request) {
  const denied = await requireExportAccess(request);
  if (denied) return denied;

  const url = new URL(request.url);
  const format = url.searchParams.get("format") ?? "json";

  const rows = await sql<ResponseRow>(
    "select id, created_at, respondent_label, answers from responses order by created_at desc",
  );

  if (format === "csv") {
    const csv = responsesToCsv(rows);
    return new Response(csv, {
      headers: {
        "content-type": "text/csv; charset=utf-8",
        "content-disposition": 'attachment; filename="declarant-survey-responses.csv"',
        "cache-control": "private, no-store",
      },
    });
  }

  return Response.json(rows, {
    headers: {
      "cache-control": "private, no-store",
      "content-disposition": 'attachment; filename="declarant-survey-responses.json"',
    },
  });
}
