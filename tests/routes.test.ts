import { test } from "node:test";
import assert from "node:assert/strict";
import { NextRequest } from "next/server";
import { authorize, readBody } from "../lib/server";

test("AI routes reject cross-origin requests before authentication or provider calls", async () => {
  const req = new NextRequest("http://localhost:3000/api/coach", {
    method: "POST",
    headers: { host: "127.0.0.1:3000", origin: "https://untrusted.example" },
  });
  const result = await authorize(req, "chat");
  assert.equal(result.error?.status, 403);
});
test("same-origin IP requests pass the origin guard and show missing setup honestly", async () => {
  const saved = process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_API_KEY;
  try {
    const req = new NextRequest("http://localhost:3000/api/coach", {
      method: "POST",
      headers: { host: "127.0.0.1:3000", origin: "http://127.0.0.1:3000" },
    });
    const result = await authorize(req, "chat");
    assert.equal(result.error?.status, 503);
    assert.match((await result.error!.json()).error, /Connect Supabase/);
  } finally {
    if (saved !== undefined) process.env.OPENAI_API_KEY = saved;
  }
});
test("request body reader rejects oversized and malformed JSON", async () => {
  await assert.rejects(
    () =>
      readBody(
        new NextRequest("http://localhost/api/coach", {
          method: "POST",
          body: "x".repeat(24001),
        }),
      ),
    /too large/,
  );
  await assert.rejects(() =>
    readBody(
      new NextRequest("http://localhost/api/coach", {
        method: "POST",
        body: "{",
      }),
    ),
  );
});
