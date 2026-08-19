const MAX_CANDIDATES = 15;

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return Response.json({ error: "AI refinement unavailable" }, { status: 503 });

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({ error: "Invalid request" }, { status: 400 }); }
  const candidates = Array.isArray(body.candidates) ? body.candidates.slice(0, MAX_CANDIDATES) : [];
  if (candidates.length < 5) return Response.json({ error: "Not enough candidates" }, { status: 400 });

  const compactProfile = {
    preferences: body.answers,
    reactions: body.buckets,
    nicknamePreference: body.nickname,
    surnameProvided: Boolean(body.surname),
  };
  const allowedNames = candidates.map((candidate: unknown) => (candidate as {name?:string}).name).filter(Boolean);
  const prompt = `You are the final ranking layer for a baby-name discovery experience. The deterministic engine has already narrowed the database. Select and order exactly five names from the supplied candidates—never invent a name. Favor the profile, learn gently from reactions, and keep the set varied in sound and origin. Return only JSON in this exact shape: {"names":["Name 1","Name 2","Name 3","Name 4","Name 5"]}.\n\nProfile: ${JSON.stringify(compactProfile)}\nCandidates: ${JSON.stringify(candidates)}`;

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-5-mini", input: prompt, max_output_tokens: 220 }),
    });
    if (!upstream.ok) return Response.json({ error: "AI refinement unavailable" }, { status: 502 });
    const result = await upstream.json() as { output_text?: string; output?: Array<{content?: Array<{text?: string}>}> };
    const text = result.output_text || result.output?.flatMap(o => o.content || []).map(c => c.text || "").join("") || "";
    const parsed = JSON.parse(text.replace(/^```json\s*|\s*```$/g, "")) as {names?: string[]};
    const names = (parsed.names || []).filter(name => allowedNames.includes(name));
    if (names.length < 5) throw new Error("Invalid ranking");
    return Response.json({ names: names.slice(0,5) });
  } catch {
    return Response.json({ error: "AI refinement unavailable" }, { status: 502 });
  }
}
