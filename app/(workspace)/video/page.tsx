"use client";
import { useState } from "react";
import { Clapperboard, Play, Save, Trash2 } from "lucide-react";
import { Heading, Setup } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useStoredState } from "@/lib/use-stored-state";
type Project = {
  id: string;
  prompt: string;
  format: string;
  duration: string;
  scenes: string[];
  date: string;
};
export default function Video() {
  const [prompt, setPrompt] = useState("");
  const [format, setFormat] = useState("9:16 · Vertical");
  const [duration, setDuration] = useState("15 seconds");
  const [scenes, setScenes] = useState(["", "", ""]);
  const [projects, setProjects] = useStoredState<Project[]>(
    "upscale-videos",
    [],
  );
  const [notice, setNotice] = useState("");
  function persist(next: Project[]) {
    setProjects(next);
  }
  function save() {
    if (!prompt.trim()) {
      setNotice("Add a creative brief before saving.");
      return;
    }
    try {
      persist([
        {
          id: crypto.randomUUID(),
          prompt,
          format,
          duration,
          scenes,
          date: new Date().toISOString(),
        },
        ...projects,
      ]);
      setNotice("Storyboard saved on this browser.");
    } catch {
      setNotice("Unable to save. Check browser storage.");
    }
  }
  return (
    <>
      <Heading
        eyebrow="THINK IN MOTION"
        title="Every great story starts with a scene."
        description="Shape your next brand film, product story, or social moment."
        action={
          <Button onClick={save}>
            <Save size={15} /> Save storyboard
          </Button>
        }
      />
      <Setup>
        Video generation is not connected. This studio saves creative briefs,
        format settings, and storyboards locally. It does not generate or export
        videos.
      </Setup>
      <div className="studio-layout">
        <section className="panel stack">
          <div className="panel-title">
            <h3>
              <Clapperboard size={17} /> Your creative brief
            </h3>
          </div>
          <label>
            What’s the story?
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              maxLength={4000}
              placeholder="A short brand film showing the care behind every handmade product…"
              style={{ minHeight: 170 }}
            />
          </label>
          <label>
            Video format
            <select value={format} onChange={(e) => setFormat(e.target.value)}>
              <option>9:16 · Vertical</option>
              <option>16:9 · Landscape</option>
              <option>1:1 · Square</option>
            </select>
          </label>
          <label>
            Target duration
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            >
              <option>15 seconds</option>
              <option>30 seconds</option>
              <option>60 seconds</option>
            </select>
          </label>
          <div className="subtle-note">
            External generation provider: not connected
          </div>
          <p className="notice" role="status">
            {notice}
          </p>
        </section>
        <section className="panel">
          <div className="panel-title">
            <h3>Your storyboard</h3>
            <span className="tiny muted">3 SCENES · LOCAL DRAFT</span>
          </div>
          <div className="storyboard">
            {scenes.map((scene, i) => (
              <div className="scene" key={i}>
                <div className="scene-art">
                  <Play size={23} />
                </div>
                <label>
                  0{i + 1} / {["The hook", "The story", "The invitation"][i]}
                  <textarea
                    value={scene}
                    maxLength={1500}
                    onChange={(e) =>
                      setScenes(
                        scenes.map((s, n) => (n === i ? e.target.value : s)),
                      )
                    }
                    placeholder={
                      [
                        "Set the scene. What catches their eye?",
                        "Show the value. What makes you different?",
                        "Inspire action. What happens next?",
                      ][i]
                    }
                  />
                </label>
              </div>
            ))}
          </div>
          <p className="muted" style={{ fontSize: 11, marginTop: 20 }}>
            Plan camera movement, text overlays, and voiceover in each scene.
            Save multiple versions to compare your ideas.
          </p>
        </section>
      </div>
      <section className="panel history">
        <div className="panel-title">
          <h3>Project history</h3>
          <span className="tiny muted">THIS BROWSER</span>
        </div>
        {!projects.length && (
          <p>No storyboards yet. Your first story is waiting.</p>
        )}
        {projects.map((p) => (
          <div key={p.id} className="history-item">
            <div>
              <strong>{p.prompt.slice(0, 90)}</strong>
              <small>
                {p.format} · {p.duration} ·{" "}
                {new Date(p.date).toLocaleDateString()}
              </small>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setPrompt(p.prompt);
                  setFormat(p.format);
                  setDuration(p.duration);
                  setScenes(p.scenes);
                  setNotice(
                    "Storyboard loaded for editing. Saving creates a new version.",
                  );
                }}
              >
                Open
              </button>
              <button
                aria-label="Delete storyboard"
                className="icon-button"
                onClick={() => persist(projects.filter((v) => v.id !== p.id))}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
