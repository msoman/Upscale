"use client";
import { useState } from "react";
import { Monitor, Smartphone, Save, Download } from "lucide-react";
import { Heading, Setup } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useStoredState } from "@/lib/use-stored-state";
type Draft = {
  template: string;
  name: string;
  headline: string;
  description: string;
  cta: string;
  color: string;
};
const initial: Draft = {
  template: "editorial",
  name: "Your brand",
  headline: "Good things start with a little intention.",
  description:
    "Thoughtfully made. Beautifully simple. Discover something that feels a little more like you.",
  cta: "Explore our collection",
  color: "#72634e",
};
export default function Website() {
  const [saved, setSaved] = useStoredState<Draft>("upscale-website", initial);
  const [edited, setEdited] = useState<Draft | null>(null);
  const draft = edited ?? saved;
  const setDraft = setEdited;
  const [mobile, setMobile] = useState(false);
  const [notice, setNotice] = useState("");
  function save() {
    try {
      setSaved(draft);
      setNotice("Website draft saved on this browser.");
    } catch {
      setNotice("Browser storage unavailable.");
    }
  }
  function exportDraft() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "upscale-website-draft.json";
    a.click();
    URL.revokeObjectURL(url);
    setNotice("Draft exported as JSON. This is not a deployed website.");
  }
  return (
    <>
      <Heading
        eyebrow="YOUR CORNER OF THE INTERNET"
        title="A beautiful beginning for your brand."
        description="Start with a template. Make it unmistakably yours."
        action={
          <Button onClick={save}>
            <Save size={15} /> Save draft
          </Button>
        }
      />
      <Setup>
        Website drafts are saved locally. The preview is interactive with
        editable content and screen sizes. Hosting, custom domains, and live
        deployment are not implemented.
      </Setup>
      <div className="studio-layout">
        <section className="panel stack">
          <label>
            Choose your starting point
            <select
              value={draft.template}
              onChange={(e) => setDraft({ ...draft, template: e.target.value })}
            >
              <option value="editorial">The Editorial · warm & timeless</option>
              <option value="modern">The Studio · clean & modern</option>
              <option value="bold">The Bold · bright & confident</option>
            </select>
          </label>
          {(
            [
              ["name", "Brand name"],
              ["headline", "Hero headline"],
              ["description", "Description"],
              ["cta", "Button text"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              {label}
              {key === "description" ? (
                <textarea
                  value={draft[key]}
                  maxLength={700}
                  onChange={(e) =>
                    setDraft({ ...draft, [key]: e.target.value })
                  }
                />
              ) : (
                <input
                  value={draft[key]}
                  maxLength={200}
                  onChange={(e) =>
                    setDraft({ ...draft, [key]: e.target.value })
                  }
                />
              )}
            </label>
          ))}
          <label>
            Accent color
            <input
              type="color"
              value={draft.color}
              onChange={(e) => setDraft({ ...draft, color: e.target.value })}
            />
          </label>
          <Button variant="outline" onClick={exportDraft}>
            <Download size={15} /> Export draft JSON
          </Button>
          <p className="notice" role="status">
            {notice}
          </p>
        </section>
        <section>
          <div className="panel-title">
            <span className="tiny muted">
              RESPONSIVE PREVIEW · TEMPLATE CONTENT
            </span>
            <div className="segment">
              <button
                aria-label="Desktop preview"
                className={!mobile ? "selected" : ""}
                onClick={() => setMobile(false)}
              >
                <Monitor size={16} />
              </button>
              <button
                aria-label="Mobile preview"
                className={mobile ? "selected" : ""}
                onClick={() => setMobile(true)}
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>
          <div className="website-preview">
            <div
              className={`site ${draft.template}`}
              style={{ maxWidth: mobile ? 360 : "100%" }}
            >
              <header>
                <strong>{draft.name}</strong>
                <span>Est. {new Date().getFullYear()}</span>
              </header>
              <div className="site-body">
                <small>THOUGHTFULLY MADE. JUST FOR YOU.</small>
                <h2>{draft.headline}</h2>
                <p>{draft.description}</p>
                <button
                  style={{ background: draft.color }}
                  onClick={() =>
                    setNotice(
                      "Preview button selected. Link destinations can be implemented in a future publishing integration.",
                    )
                  }
                >
                  {draft.cta} ↗
                </button>
                <div className="site-features">
                  <div>Made with intention</div>
                  <div>Inspired by you</div>
                  <div>A little extraordinary</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
