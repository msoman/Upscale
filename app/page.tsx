import Link from "next/link";
import {
  ArrowUpRight,
  MessageSquare,
  Sparkles,
  Globe,
  Clapperboard,
} from "lucide-react";
export default function Landing() {
  return (
    <div className="landing">
      <header className="landing-nav">
        <Link className="logo" href="/">
          <span className="logo-mark">
            <ArrowUpRight size={23} />
          </span>
          UPSCALE
          <span className="logo-dot">.</span>
        </Link>
        <div>
          <Link href="/login" className="btn btn-ghost">
            Sign in
          </Link>
          <Link href="/onboarding" className="btn btn-primary">
            Get started <ArrowUpRight size={15} />
          </Link>
        </div>
      </header>
      <section className="landing-hero">
        <span className="pill">✦ THE WORKSPACE FOR YOUR NEXT CHAPTER</span>
        <h1>
          Your small business.
          <br />
          <em>Your big possibility.</em>
        </h1>
        <p>
          Meet your creative team, strategic sidekick, and next big idea. One
          beautifully simple workspace built for ambitious business owners.
        </p>
        <Link href="/onboarding" className="btn btn-light">
          Get started <ArrowUpRight size={16} />
        </Link>
        <Link href="/dashboard" className="btn btn-outline">
          Explore the workspace
        </Link>
        <p style={{ fontSize: 11, marginTop: 18 }}>
          Start locally. Connect your tools when you’re ready.
        </p>
      </section>
      <div className="landing-showcase">
        <div className="panel-title">
          <h3>
            <Sparkles size={16} /> A whole new way to move forward
          </h3>
          <span className="tiny muted">YOUR UPSCALE WORKSPACE</span>
        </div>
        <div className="tool-grid">
          {[
            [
              MessageSquare,
              "Business coach",
              "Clarity for your next move.",
              "violet",
              "coach",
            ],
            [
              Sparkles,
              "Creative studio",
              "Make your brand unforgettable.",
              "pink",
              "creative",
            ],
            [
              Globe,
              "Website builder",
              "Build your corner of the internet.",
              "blue",
              "website",
            ],
            [
              Clapperboard,
              "Video studio",
              "Your story, scene by scene.",
              "orange",
              "video",
            ],
          ].map(([Icon, title, desc, color, url]) => {
            const I = Icon as typeof Globe;
            return (
              <Link href={`/${url}`} className="tool-card" key={String(title)}>
                <div className={`tool-art ${color}`}>
                  <I size={28} />
                  <span className="art-ring" />
                </div>
                <h3>{String(title)}</h3>
                <p>{String(desc)}</p>
              </Link>
            );
          })}
        </div>
      </div>
      <section className="landing-features">
        <div>
          <span className="eyebrow">01 / FIND YOUR DIRECTION</span>
          <h3>Strategy that knows your story.</h3>
          <p>
            Share your business, audience, and goals. Your AI coach uses that
            context to help you build a practical growth plan.
          </p>
        </div>
        <div>
          <span className="eyebrow">02 / MAKE SOMETHING GREAT</span>
          <h3>Your ideas deserve a canvas.</h3>
          <p>
            Create marketing images with OpenAI, draft a website, and plan your
            next video in a connected creative workspace.
          </p>
        </div>
        <div>
          <span className="eyebrow">03 / KEEP MOVING FORWARD</span>
          <h3>Small steps. Real momentum.</h3>
          <p>
            Organize tasks and content drafts locally, or connect Supabase for
            secure business profiles and creative file storage.
          </p>
        </div>
      </section>
      <div className="landing-footer">
        <span>UPSCALE © {new Date().getFullYear()}</span>
        <span>Built for your next big thing.</span>
      </div>
    </div>
  );
}
