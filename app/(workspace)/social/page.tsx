"use client";
import { useState } from "react";
import {
  CalendarDays,
  Plus,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Heading, Setup } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useStoredState } from "@/lib/use-stored-state";
type Post = { id: string; channel: string; date: string; content: string };
export default function Social() {
  const [posts, setPosts] = useStoredState<Post[]>("upscale-social", []);
  const [channel, setChannel] = useState("Instagram");
  const [date, setDate] = useState("");
  const [content, setContent] = useState("");
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  );
  const [notice, setNotice] = useState("");
  function persist(next: Post[]) {
    setPosts(next);
  }
  function add(e: React.FormEvent) {
    e.preventDefault();
    try {
      persist([...posts, { id: crypto.randomUUID(), channel, date, content }]);
      setContent("");
      setNotice("Draft saved locally. It will not be published automatically.");
    } catch {
      setNotice("Browser storage unavailable.");
    }
  }
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return (
    <>
      <Heading
        eyebrow="SHOW UP WITH INTENTION"
        title="Your brand. Part of the conversation."
        description="Give your content a little structure and your ideas room to grow."
      />
      <Setup>
        Social account connections and publishing are not integrated. This is a
        local content calendar and draft workspace. Dates are planning
        reminders, not scheduled publishing jobs.
      </Setup>
      <div className="connection-grid">
        {["Instagram", "LinkedIn", "Facebook"].map((c) => (
          <div className="connection" key={c}>
            <strong>{c}</strong>
            <span>○ Not connected · Integration pending</span>
          </div>
        ))}
      </div>
      <div className="studio-layout">
        <form className="panel stack" onSubmit={add}>
          <div className="panel-title">
            <h3>
              <Plus size={17} /> Draft your next post
            </h3>
          </div>
          <label>
            Channel
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              {["Instagram", "LinkedIn", "Facebook", "TikTok", "Other"].map(
                (c) => (
                  <option key={c}>{c}</option>
                ),
              )}
            </select>
          </label>
          <label>
            Planning date
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>
          <label>
            Post copy
            <textarea
              required
              value={content}
              maxLength={3000}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to share with your audience?"
              style={{ minHeight: 170 }}
            />
          </label>
          <Button disabled={!content.trim()}>Save draft</Button>
          <p className="notice" role="status">
            {notice}
          </p>
        </form>
        <section className="panel">
          <div className="panel-title">
            <h3>
              <CalendarDays size={17} />
              {month.toLocaleDateString(undefined, {
                month: "long",
                year: "numeric",
              })}
            </h3>
            <div style={{ display: "flex" }}>
              <button
                className="icon-button"
                aria-label="Previous month"
                onClick={() =>
                  setMonth(
                    new Date(month.getFullYear(), month.getMonth() - 1, 1),
                  )
                }
              >
                <ChevronLeft size={17} />
              </button>
              <button
                className="icon-button"
                aria-label="Next month"
                onClick={() =>
                  setMonth(
                    new Date(month.getFullYear(), month.getMonth() + 1, 1),
                  )
                }
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
          <div className="calendar">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="day-name">
                {d}
              </div>
            ))}
            {Array.from({ length: month.getDay() }, (_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: days }, (_, i) => {
              const key = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, "0")}-${String(i + 1).padStart(2, "0")}`;
              const matches = posts.filter((p) => p.date === key);
              return (
                <div key={key} className={matches.length ? "post-day" : ""}>
                  {i + 1}
                  {matches.map((p) => (
                    <small key={p.id} title={p.content}>
                      {p.channel} · Draft
                    </small>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      </div>
      <section className="panel history">
        <div className="panel-title">
          <h3>Your draft posts</h3>
          <span className="tiny muted">NOT PUBLISHED</span>
        </div>
        {posts.length === 0 && (
          <p>No drafts yet. Start with something your audience will love.</p>
        )}
        {posts.map((p) => (
          <div className="history-item" key={p.id}>
            <div>
              <span style={{ whiteSpace: "pre-wrap" }}>{p.content}</span>
              <small>
                {p.channel} · {p.date} · Local draft
              </small>
            </div>
            <button
              aria-label="Delete draft post"
              className="icon-button"
              onClick={() => persist(posts.filter((v) => v.id !== p.id))}
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </section>
    </>
  );
}
