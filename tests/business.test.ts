import { test } from "node:test";
import assert from "node:assert/strict";
import { businessContext, validatePrompt } from "../lib/business";
test("business context includes relevant profile fields, excluding UI preferences and unknown fields", () => {
  const context = JSON.parse(
    businessContext({
      name: "Bloom",
      audience: "Gardeners",
      brandColor: "#fff",
      appearance: "dark",
    }),
  );
  assert.deepEqual(context, { name: "Bloom", audience: "Gardeners" });
});
test("AI input validation rejects empty, oversized and non-string inputs", () => {
  assert.equal(validatePrompt("  "), false);
  assert.equal(validatePrompt("a".repeat(4001)), false);
  assert.equal(validatePrompt({ message: "hi" }), false);
  assert.equal(validatePrompt("Plan my next week"), true);
});
