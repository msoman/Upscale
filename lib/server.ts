import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
const usage = new Map<string, { count: number; reset: number }>();
export async function authorize(req: NextRequest, kind: "chat" | "image") {
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host"))
    return {
      error: NextResponse.json(
        { error: "Cross-origin requests are not allowed." },
        { status: 403 },
      ),
    };
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL,
    key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!process.env.OPENAI_API_KEY || !url || !key)
    return {
      error: NextResponse.json(
        {
          error:
            "Connect Supabase and add a server-side OPENAI_API_KEY to enable AI. See README for setup.",
        },
        { status: 503 },
      ),
    };
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
  if (!token)
    return {
      error: NextResponse.json(
        { error: "Sign in to use AI features." },
        { status: 401 },
      ),
    };
  const db = createClient(url, key, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const {
    data: { user },
    error,
  } = await db.auth.getUser(token);
  if (error || !user)
    return {
      error: NextResponse.json(
        { error: "Your session expired. Please sign in again." },
        { status: 401 },
      ),
    };
  // Database-backed quotas work across server instances. No service-role key needed.
  const { data: allowed, error: quotaError } = await db.rpc(
    "consume_ai_quota",
    { request_kind: kind },
  );
  if (quotaError)
    return {
      error: NextResponse.json(
        {
          error:
            "AI quota setup is unavailable. Apply the database migration before using AI.",
        },
        { status: 503 },
      ),
    };
  if (!allowed)
    return {
      error: NextResponse.json(
        { error: "Hourly AI limit reached. Please try again later." },
        { status: 429 },
      ),
    };
  // A small per-instance burst guard supplements the shared quota.
  const now = Date.now();
  for (const [k, v] of usage) if (v.reset < now) usage.delete(k);
  const id = `${user.id}:${kind}`;
  const record = usage.get(id) || { count: 0, reset: now + 60000 };
  record.count++;
  usage.set(id, record);
  if (record.count > (kind === "image" ? 3 : 15))
    return {
      error: NextResponse.json(
        { error: "Please slow down and retry in a minute." },
        { status: 429 },
      ),
    };
  return { db, user };
}
export async function readBody(req: NextRequest) {
  const raw = await req.text();
  if (raw.length > 24000) throw new Error("Request is too large.");
  return JSON.parse(raw);
}
export function apiError(error: unknown) {
  console.error(
    "AI request failed",
    error instanceof Error ? error.name : "Unknown error",
  );
  return NextResponse.json(
    {
      error:
        "The AI provider could not complete this request. Check your server configuration, billing and provider availability, then try again.",
    },
    { status: 502 },
  );
}
