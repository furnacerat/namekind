import { env } from "cloudflare:workers";
import { names as nameDatabase } from "../../name-data";

const MAX_CANDIDATES = 15;
const MAX_BODY_BYTES = 24_000;
const VISITOR_HOURLY_LIMIT = 3;
const VISITOR_DAILY_LIMIT = 10;
const GLOBAL_DAILY_LIMIT = 500;
const COOLDOWN_SECONDS = 30;

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const url = new URL(request.url);
  if (!origin) return false;
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1") return true;
  try { return new URL(origin).host === url.host; } catch { return false; }
}

async function visitorHash(request: Request) {
  const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";
  const agent = (request.headers.get("user-agent") || "unknown").slice(0, 160);
  const day = new Date().toISOString().slice(0,10);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`namekind:${day}:${ip}:${agent}`));
  return Array.from(new Uint8Array(digest)).map(byte => byte.toString(16).padStart(2,"0")).join("");
}

async function reserveAiCall(request: Request) {
  const db = env.DB;
  if (!db) return { allowed: false, reason: "AI protection is unavailable" };
  const now = Math.floor(Date.now() / 1000);
  const hourAgo = now - 3600;
  const dayAgo = now - 86400;
  const hash = await visitorHash(request);
  const [recent, hourly, daily, global] = await Promise.all([
    db.prepare("SELECT MAX(created_at) AS value FROM ai_usage WHERE visitor_hash = ?").bind(hash).first<{value:number|null}>(),
    db.prepare("SELECT COUNT(*) AS value FROM ai_usage WHERE visitor_hash = ? AND created_at >= ?").bind(hash, hourAgo).first<{value:number}>(),
    db.prepare("SELECT COUNT(*) AS value FROM ai_usage WHERE visitor_hash = ? AND created_at >= ?").bind(hash, dayAgo).first<{value:number}>(),
    db.prepare("SELECT COUNT(*) AS value FROM ai_usage WHERE created_at >= ?").bind(dayAgo).first<{value:number}>(),
  ]);
  if (recent?.value && now - recent.value < COOLDOWN_SECONDS) return { allowed:false, reason:"Please wait a moment before refining again" };
  if ((hourly?.value || 0) >= VISITOR_HOURLY_LIMIT) return { allowed:false, reason:"Hourly AI limit reached" };
  if ((daily?.value || 0) >= VISITOR_DAILY_LIMIT) return { allowed:false, reason:"Daily AI limit reached" };
  if ((global?.value || 0) >= GLOBAL_DAILY_LIMIT) return { allowed:false, reason:"Today’s AI refinement budget is complete" };
  await db.prepare("INSERT INTO ai_usage (visitor_hash, created_at) VALUES (?, ?)").bind(hash, now).run();
  if (Math.random() < .02) await db.prepare("DELETE FROM ai_usage WHERE created_at < ?").bind(dayAgo - 86400).run();
  return { allowed:true, reason:"" };
}

export async function POST(request: Request) {
  if (!sameOrigin(request)) return json({ error: "Request origin not allowed" }, 403);
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) return json({ error: "Request too large" }, 413);
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return json({ error: "AI refinement unavailable" }, 503);

  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ error: "Invalid request" }, 400); }
  const supplied = Array.isArray(body.candidates) ? body.candidates.slice(0, MAX_CANDIDATES) : [];
  const allowedByName = new Map(nameDatabase.map(item => [item.name, item]));
  const candidates = supplied.map(item => allowedByName.get((item as {name?:string})?.name || "")).filter(Boolean);
  if (candidates.length < 5 || new Set(candidates.map(item => item!.name)).size !== candidates.length) return json({ error: "Invalid candidates" }, 400);

  let reservation: {allowed:boolean;reason:string};
  try { reservation = await reserveAiCall(request); } catch { return json({ error: "AI protection is unavailable" }, 503); }
  if (!reservation.allowed) return json({ error: reservation.reason }, 429);

  const compactProfile = {
    preferences: body.answers,
    reactions: body.buckets,
    nicknamePreference: typeof body.nickname === "string" ? body.nickname.slice(0,50) : "No preference",
    surnameProvided: Boolean(body.surname),
    personalSignals: typeof body.details === "object" && body.details ? body.details : {},
  };
  const allowedNames = candidates.map(candidate => candidate!.name);
  const candidateData = candidates.map(candidate => ({name:candidate!.name,origin:candidate!.origin,meaning:candidate!.meaning,tags:candidate!.tags}));
  const prompt = `You are the final ranking layer for a baby-name discovery experience. The deterministic engine has already narrowed the database. Select and order exactly five names from the supplied candidates—never invent a name. Favor the profile, learn gently from reactions, and keep the set varied in sound and origin. Return only JSON in this exact shape: {"names":["Name 1","Name 2","Name 3","Name 4","Name 5"]}.\n\nProfile: ${JSON.stringify(compactProfile).slice(0,8000)}\nCandidates: ${JSON.stringify(candidateData)}`;

  try {
    const upstream = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "gpt-5-mini", input: prompt, max_output_tokens: 220 }),
    });
    if (!upstream.ok) return json({ error: "AI refinement unavailable" }, 502);
    const result = await upstream.json() as { output_text?: string; output?: Array<{content?: Array<{text?: string}>}> };
    const text = result.output_text || result.output?.flatMap(o => o.content || []).map(c => c.text || "").join("") || "";
    const parsed = JSON.parse(text.replace(/^```json\s*|\s*```$/g, "")) as {names?: string[]};
    const names = (parsed.names || []).filter(name => allowedNames.includes(name));
    if (names.length < 5) throw new Error("Invalid ranking");
    return json({ names: names.slice(0,5) });
  } catch {
    return json({ error: "AI refinement unavailable" }, 502);
  }
}
