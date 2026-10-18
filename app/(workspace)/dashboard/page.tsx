"use client";
import Link from "next/link";
import {
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Target,
  TrendingUp,
  Check,
  Plus,
  MessageSquare,
  Palette,
  Globe,
  Clapperboard,
} from "lucide-react";
import { useBusiness } from "@/components/provider";
import { Heading } from "@/components/common";
import { useState } from "react";
import { useStoredState } from "@/lib/use-stored-state";
export default function Dashboard() {
  const { business } = useBusiness();
  const [tasks, setTasks] = useStoredState<{ text: string; done: boolean }[]>(
    "upscale-tasks",
    [],
  );
  const [conversation] = useStoredState<{ role: string; content: string }[]>(
    "upscale-chat",
    [],
    true,
  );
  const recommendation = [...conversation]
    .reverse()
    .find((message) => message.role === "assistant")?.content;
  const [text, setText] = useState("");
  function update(next: typeof tasks) {
    setTasks(next);
  }
  const done = tasks.filter((t) => t.done).length;
  return (
    <>
      <Heading
        eyebrow="YOUR BUSINESS, REIMAGINED"
        title={
          business.name
            ? `Let’s grow ${business.name}.`
            : "Big ambitions. Meet your unfair advantage."
        }
        description="A little clarity, a spark of creativity, and everything you need to move forward."
        action={
          <Link href="/coach" className="btn btn-outline">
            <Sparkles size={16} /> Ask your AI coach
          </Link>
        }
      />
      <section className="hero-panel">
        <div className="hero-copy">
          <span className="pill">
            <span className="pulse" /> YOUR NEXT CHAPTER STARTS HERE
          </span>
          <h2>
            Small business.
            <br />
            <span>Extraordinary possibilities.</span>
          </h2>
          <p>
            Turn your what-ifs into what’s next. Build your brand, find your
            direction, and create something worth noticing.
          </p>
          <Link
            href={business.name ? "/coach" : "/onboarding"}
            className="btn btn-light"
          >
            {business.name ? "Plan my next move" : "Build my business profile"}{" "}
            <ArrowUpRight size={17} />
          </Link>
          <span className="hero-caption">
            Your ambition. A whole new toolkit.
          </span>
        </div>
        <div className="orb-scene" aria-hidden="true">
          <div className="orbit orbit-one" />
          <div className="orbit orbit-two" />
          <div className="orb">
            <span>✦</span>
          </div>
          <div className="float-tag tag-one">
            <Sparkles size={14} /> Ideas into impact
          </div>
          <div className="float-tag tag-two">
            <TrendingUp size={14} /> Made for growth
          </div>
          <span className="star star-one">+</span>
          <span className="star star-two">✧</span>
        </div>
      </section>
      <div className="stat-grid">
        {[
          [
            Target,
            "Business focus",
            business.industry || "Define your direction",
            business.name ? "Your saved industry" : "Complete your profile",
          ],
          [
            TrendingUp,
            "Goal progress",
            `${tasks.length ? Math.round((done / tasks.length) * 100) : 0}%`,
            "Based on your completed tasks",
          ],
          [
            Check,
            "Tasks completed",
            `${done} / ${tasks.length}`,
            "Every small step counts",
          ],
          [
            Sparkles,
            "Your workspace",
            "Ready to create",
            "Coach, design & build in one place",
          ],
        ].map(([Icon, label, value, sub]) => {
          const I = Icon as typeof Target;
          return (
            <div className="stat-card" key={String(label)}>
              <div className="stat-label">
                <span>{String(label)}</span>
                <I size={16} />
              </div>
              <strong>{String(value)}</strong>
              <small>{String(sub)}</small>
            </div>
          );
        })}
      </div>
      <div className="section-title">
        <div>
          <h2>
            Your next big thing starts here <span>✦</span>
          </h2>
          <p>One workspace. More ways to move your business forward.</p>
        </div>
        <span className="muted tiny">YOUR CREATIVE TOOLKIT</span>
      </div>
      <div className="tool-grid">
        {[
          [
            MessageSquare,
            "coach",
            "Your strategic sidekick",
            "Business coach",
            "Find clarity, map out your next move, and turn ambition into an actionable plan.",
            "violet",
          ],
          [
            Palette,
            "creative",
            "Make a lasting impression",
            "Creative studio",
            "Bring your brand to life with logos, social content, and scroll-stopping visuals.",
            "pink",
          ],
          [
            Globe,
            "website",
            "Your own corner of the internet",
            "Website builder",
            "Shape a beautiful website with editable templates and responsive previews.",
            "blue",
          ],
          [
            Clapperboard,
            "video",
            "Think in motion",
            "Video studio",
            "Plan your next story with a creative brief and a scene-by-scene storyboard.",
            "orange",
          ],
        ].map(([Icon, url, kicker, title, desc, color]) => {
          const I = Icon as typeof Palette;
          return (
            <Link href={`/${url}`} className="tool-card" key={String(url)}>
              <div className={`tool-art ${color}`}>
                <I size={30} />
                <span className="art-ring" />
                <ArrowUpRight className="tool-arrow" size={17} />
              </div>
              <small>{String(kicker)}</small>
              <h3>{String(title)}</h3>
              <p>{String(desc)}</p>
              <span className="tool-link">
                Explore workspace <ArrowRight size={14} />
              </span>
            </Link>
          );
        })}
      </div>
      <div className="bottom-grid">
        <section className="panel">
          <div className="panel-title">
            <h3>
              <Sparkles size={17} /> A little direction
            </h3>
            <Link href="/coach">
              Meet your coach <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="recommendation">
            <span className="number">01</span>
            <div>
              <h4>
                {recommendation
                  ? "Your latest AI recommendation"
                  : business.name
                    ? "Build a plan around your goals"
                    : "Start with your story"}
              </h4>
              <p>
                {recommendation
                  ? `${recommendation.slice(0, 500)}${recommendation.length > 500 ? "…" : ""}`
                  : business.goals ||
                    "Tell us about your business, your audience, and where you want to go. Your coach will use this context for personalized advice."}
              </p>
              <Link href={business.name ? "/coach" : "/onboarding"}>
                {recommendation
                  ? "Read in Coach"
                  : business.name
                    ? "Create my strategy"
                    : "Set up business profile"}{" "}
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
          <div className="subtle-note">
            {recommendation
              ? "From your latest conversation in this tab. Review AI advice before acting."
              : "Personalized AI recommendations appear after you ask your coach."}
          </div>
        </section>
        <section className="panel">
          <div className="panel-title">
            <h3>
              <Target size={17} /> Your next steps
            </h3>
            <span className="tiny muted">
              {done}/{tasks.length} COMPLETE
            </span>
          </div>
          <div className="task-list">
            {tasks.length === 0 && (
              <p className="muted">A fresh start. Add your first task below.</p>
            )}
            {tasks.map((task, i) => (
              <label key={i} className={`task ${task.done ? "done" : ""}`}>
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() =>
                    update(
                      tasks.map((t, n) =>
                        n === i ? { ...t, done: !t.done } : t,
                      ),
                    )
                  }
                />
                <span>{task.text}</span>
                <button
                  aria-label={`Delete ${task.text}`}
                  onClick={() => update(tasks.filter((_, n) => n !== i))}
                >
                  ×
                </button>
              </label>
            ))}
          </div>
          <form
            className="inline-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) {
                update([...tasks, { text: text.trim(), done: false }]);
                setText("");
              }
            }}
          >
            <input
              aria-label="New task"
              placeholder="What’s your next small step?"
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={200}
            />
            <button aria-label="Add task">
              <Plus size={18} />
            </button>
          </form>
        </section>
      </div>
    </>
  );
}
