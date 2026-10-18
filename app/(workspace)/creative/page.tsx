"use client";
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect, useCallback } from "react";
import { Sparkles, Image as ImageIcon } from "lucide-react";
import { Heading, Setup, Empty } from "@/components/common";
import { useBusiness } from "@/components/provider";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
export default function Creative() {
  const { token, user } = useBusiness();
  const [kind, setKind] = useState("Social post");
  const [prompt, setPrompt] = useState("");
  const [size, setSize] = useState("1024x1024");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [image, setImage] = useState("");
  const [history, setHistory] = useState<{ name: string; url: string }[]>([]);
  const load = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return;
    const {
      data: { user },
    } = await sb.auth.getUser();
    if (!user) return;
    const { data } = await sb.storage
      .from("creative-assets")
      .list(user.id, {
        limit: 12,
        sortBy: { column: "created_at", order: "desc" },
      });
    if (data) {
      const items = await Promise.all(
        data
          .filter((i) => i.id)
          .map(async (i) => {
            const { data } = await sb.storage
              .from("creative-assets")
              .createSignedUrl(`${user.id}/${i.name}`, 3600);
            return { name: i.name, url: data?.signedUrl || "" };
          }),
      );
      setHistory(items.filter((i) => i.url));
    }
  }, []);
  useEffect(() => {
    void Promise.resolve().then(load);
  }, [load, user]);
  async function generate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setNotice("");
    try {
      const access = await token();
      const res = await fetch("/api/images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(access ? { Authorization: `Bearer ${access}` } : {}),
        },
        body: JSON.stringify({ prompt: `Create a ${kind}. ${prompt}`, size }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImage(data.image);
      setNotice(
        data.warning ||
          "Image generated and saved to your private asset library.",
      );
      void load();
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Generation failed.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <Heading
        eyebrow="MAKE SOMETHING WORTH NOTICING"
        title="Your ideas. Beautifully brought to life."
        description="From the first spark to your next brand moment. This is your creative playground."
      />
      <Setup>
        Real image generation uses OpenAI and may incur API charges. Connect
        Supabase, sign in, and configure OPENAI_API_KEY to create. No sample
        images are presented as generated work.
      </Setup>
      <div className="studio-layout">
        <form className="panel stack" onSubmit={generate}>
          <div className="panel-title">
            <h3>
              <Sparkles size={17} /> Create a new visual
            </h3>
          </div>
          <label>What are we making?</label>
          <div className="segment">
            {["Logo", "Social post", "Poster", "Marketing image"].map((k) => (
              <button
                key={k}
                type="button"
                className={kind === k ? "selected" : ""}
                onClick={() => setKind(k)}
              >
                {k}
              </button>
            ))}
          </div>
          <label>
            Your creative direction
            <textarea
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={3500}
              placeholder="A minimalist poster for a sustainable coffee shop. Warm earth tones, editorial composition, soft morning light…"
              style={{ minHeight: 180 }}
            />
          </label>
          <label>
            Canvas size
            <select value={size} onChange={(e) => setSize(e.target.value)}>
              <option value="1024x1024">Square · 1:1</option>
              <option value="1024x1536">Portrait · 2:3</option>
              <option value="1536x1024">Landscape · 3:2</option>
            </select>
          </label>
          <Button disabled={busy || !prompt.trim()}>
            <Sparkles size={16} />
            {busy ? "Creating your image…" : "Generate image"}
          </Button>
          <p className="notice" role="status">
            {notice}
          </p>
        </form>
        <div>
          <section className="panel">
            <div className="panel-title">
              <h3>
                <ImageIcon size={17} /> Your creative canvas
              </h3>
              <span className="tiny muted">
                {image ? "GENERATED WITH OPENAI" : "READY WHEN YOU ARE"}
              </span>
            </div>
            {image ? (
              <div className="image-result">
                <img src={image} alt={prompt} />
                <a href={image} download="upscale-creative.png">
                  Download PNG ↓
                </a>
              </div>
            ) : (
              <Empty title="A blank canvas. Endless possibilities.">
                Describe your vision to create your first visual. Generated
                images will appear here.
              </Empty>
            )}
          </section>
          <section className="panel history">
            <div className="panel-title">
              <h3>Private asset library</h3>
              <button className="btn btn-ghost" onClick={() => void load()}>
                Refresh
              </button>
            </div>
            {history.length ? (
              <div className="preview-grid">
                {history.map((i) => (
                  <div className="image-result" key={i.name}>
                    <img
                      src={i.url}
                      alt="Previously generated business creative"
                    />
                    <a href={i.url} target="_blank" rel="noreferrer">
                      Open original ↗
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="muted">
                {user
                  ? "No saved images yet."
                  : "Sign in to view your private cloud assets."}
              </p>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
