"use client";
import { useState } from "react";
import Link from "next/link";
import { Send, Sparkles, Trash2 } from "lucide-react";
import { Heading, Setup, Empty } from "@/components/common";
import { useBusiness } from "@/components/provider";
import { Button } from "@/components/ui/button";
import { useStoredState } from "@/lib/use-stored-state";
type Message = { role: "user" | "assistant"; content: string };
export default function Coach() {
  const { business, token } = useBusiness();
  const [messages, setMessages] = useStoredState<Message[]>(
    "upscale-chat",
    [],
    true,
  );
  const [prompt, setPrompt] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || busy) return;
    setBusy(true);
    setError("");
    const content = prompt.trim();
    try {
      const access = await token();
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access ? { Authorization: `Bearer ${access}` } : {}),
        },
        body: JSON.stringify({
          message: content,
          history: messages.slice(-10),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const next: Message[] = [
        ...messages,
        { role: "user", content },
        { role: "assistant", content: data.reply },
      ];
      setMessages(next);
      setPrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to connect.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="CLARITY MEETS AMBITION"
        title="Your strategic sidekick."
        description="Big questions. Practical answers. A coach that knows your business."
      />
      <Setup>
        AI requires Supabase sign-in, a saved cloud business profile, and a
        server-side OpenAI key. Conversations stay in this tab; your messages
        and saved profile are sent to OpenAI when you ask.
      </Setup>
      <div className="chat-layout">
        <section className="panel chat">
          <div className="panel-title">
            <h3>
              <Sparkles size={17} /> UPSCALE coach
            </h3>
            <button
              aria-label="Clear conversation"
              className="icon-button"
              onClick={() => {
                setMessages([]);
              }}
            >
              <Trash2 size={15} />
            </button>
          </div>
          <div className="messages" aria-live="polite">
            {messages.length === 0 ? (
              <>
                <Empty title="Let’s make your next move a great one.">
                  Ask for a growth strategy, a weekly plan, or a fresh
                  perspective on your business.
                </Empty>
                <div className="prompt-chips">
                  {[
                    "Create a 30-day growth strategy",
                    "Build my weekly action plan",
                    "Help me reach my ideal customers",
                  ].map((p) => (
                    <button key={p} onClick={() => setPrompt(p)}>
                      {p} ↗
                    </button>
                  ))}
                </div>
              </>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`message ${m.role}`}>
                  <small>{m.role === "user" ? "YOU" : "UPSCALE COACH"}</small>
                  {m.content}
                </div>
              ))
            )}
            {busy && (
              <p className="notice" role="status">
                Your coach is thinking…
              </p>
            )}
          </div>
          {error && (
            <p role="alert" className="notice">
              {error} <Link href="/login">Sign in →</Link>
            </p>
          )}
          <form className="chat-form" onSubmit={send}>
            <textarea
              aria-label="Message your business coach"
              placeholder="What’s on your mind?"
              maxLength={4000}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <Button disabled={busy || !prompt.trim()}>
              <Send size={16} /> Send
            </Button>
          </form>
          <p
            className="tiny muted"
            style={{ margin: "12px 0 0", letterSpacing: 0 }}
          >
            AI can make mistakes. Review recommendations before making business
            decisions.
          </p>
        </section>
        <aside className="panel">
          <div className="panel-title">
            <h3>Your business context</h3>
          </div>
          {[
            ["Business", business.name],
            ["Industry", business.industry],
            ["Audience", business.audience],
            ["Budget", business.budget],
            ["Goals", business.goals],
          ].map(([label, value]) => (
            <div className="context-item" key={label}>
              <small>{label.toUpperCase()}</small>
              <p>{value || "Not added yet"}</p>
            </div>
          ))}
          <Link
            href="/settings"
            className="btn btn-outline"
            style={{ marginTop: 20 }}
          >
            Edit business details ↗
          </Link>
        </aside>
      </div>
    </>
  );
}
