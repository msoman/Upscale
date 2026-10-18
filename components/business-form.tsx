"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBusiness } from "./provider";
import { Business } from "@/lib/business";
import { Button } from "./ui/button";
import { getSupabase } from "@/lib/supabase";
const fields: [keyof Business, string, string][] = [
  ["name", "Company name", "e.g. Bloom & Co."],
  ["industry", "Industry", "e.g. Sustainable homeware"],
  ["audience", "Target audience", "Who are you here for?"],
  ["budget", "Monthly marketing budget", "e.g. $500–$1,000"],
  ["location", "Location", "City, country or online"],
  ["website", "Website", "https://yourbusiness.com"],
  ["social", "Social links", "Instagram, LinkedIn, TikTok…"],
];
export function BusinessForm({ onboarding = false }: { onboarding?: boolean }) {
  const { business, save, ready, notice, user } = useBusiness();
  const [edited, setEdited] = useState<Business | null>(null);
  const draft = edited ?? business;
  const setDraft = setEdited;
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      await save(draft);
      setMessage("Saved.");
      if (onboarding) router.push("/dashboard");
    } catch {
      setMessage(
        "Browser storage is unavailable. Please allow site storage and try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <form className="panel" onSubmit={submit}>
      <div className="panel-title">
        <h3>
          {onboarding ? "Tell us your story" : "Business profile & brand"}
        </h3>
        <span className="tiny muted">
          {user ? "ACCOUNT SYNC" : "BROWSER STORAGE"}
        </span>
      </div>
      <div className="form-grid">
        {fields.map(([key, label, placeholder]) => (
          <label key={key}>
            {label}
            <input
              required={key === "name"}
              maxLength={500}
              value={draft[key]}
              placeholder={placeholder}
              onChange={(e) => setDraft({ ...draft, [key]: e.target.value })}
            />
          </label>
        ))}
        <label className="wide">
          Your goals
          <textarea
            value={draft.goals}
            maxLength={2000}
            placeholder="Where would you like your business to be in the next 6 months?"
            onChange={(e) => setDraft({ ...draft, goals: e.target.value })}
          />
        </label>
        {!onboarding && (
          <>
            <label>
              Brand color
              <input
                type="color"
                value={draft.brandColor}
                onChange={(e) =>
                  setDraft({ ...draft, brandColor: e.target.value })
                }
              />
            </label>
            <label>
              Typography
              <select
                value={draft.font}
                onChange={(e) => setDraft({ ...draft, font: e.target.value })}
              >
                <option value="sans-serif">Modern sans</option>
                <option value="Georgia, serif">Editorial serif</option>
                <option value="monospace">Studio mono</option>
              </select>
            </label>
            <label>
              Appearance
              <select
                value={draft.appearance}
                onChange={(e) =>
                  setDraft({ ...draft, appearance: e.target.value })
                }
              >
                <option value="dark">Midnight</option>
                <option value="light">Daylight</option>
              </select>
            </label>
          </>
        )}
      </div>
      <div className="form-actions">
        <Button disabled={busy || !ready}>
          {busy
            ? "Saving…"
            : onboarding
              ? "Create my workspace →"
              : "Save changes"}
        </Button>
        <span className="notice" role="status">
          {notice || message}
        </span>
        {user && (
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              await getSupabase()?.auth.signOut();
              router.push("/login");
            }}
          >
            Sign out
          </Button>
        )}
      </div>
      <p className="tiny muted" style={{ marginTop: 20, letterSpacing: 0 }}>
        Your profile provides context to your AI coach. Local mode stores a copy
        on this device. Signed-in profiles sync to Supabase.
      </p>
    </form>
  );
}
