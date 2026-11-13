export async function POST() {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return Response.json(
    { ok: true },
    {
      headers: {
        "set-cookie": `declarant_survey_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure}`,
      },
    },
  );
}
