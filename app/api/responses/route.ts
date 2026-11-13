import { randomUUID } from "node:crypto";
import { sql } from "@/lib/db";

export async function POST(request: Request) {
  let body: { respondent_label?: string | null; answers?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Неверный формат данных" }, { status: 400 });
  }

  const answers = body.answers;
  if (!answers || typeof answers !== "object") {
    return Response.json({ error: "Нет ответов" }, { status: 400 });
  }

  const id = randomUUID();
  const label = typeof body.respondent_label === "string" ? body.respondent_label.slice(0, 200) : null;

  await sql(
    "insert into responses (id, respondent_label, answers) values ($1, $2, $3::jsonb)",
    [id, label, JSON.stringify(answers)],
  );

  return Response.json({ ok: true, id });
}
