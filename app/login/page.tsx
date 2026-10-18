"use client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
export default function Login() {
  const [signup, setSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const router = useRouter();
  const sb = getSupabase();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!sb) return;
    setBusy(true);
    try {
      const { data, error } = signup
        ? await sb.auth.signUp({
            email,
            password,
            options: { emailRedirectTo: window.location.origin + "/dashboard" },
          })
        : await sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.session) router.push("/dashboard");
      else setNotice("Check your email to confirm your account, then sign in.");
    } catch (err) {
      setNotice(err instanceof Error ? err.message : "Unable to authenticate.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-page">
      <section className="auth-card">
        <Link className="logo" href="/">
          <span className="logo-mark">
            <ArrowUpRight size={23} />
          </span>
          UPSCALE.
        </Link>
        <div className="eyebrow">YOUR NEXT CHAPTER</div>
        <h1>{signup ? "Make room for possibility." : "Welcome back."}</h1>
        <p>
          {signup
            ? "Create your account and start building your next big thing."
            : "Your ideas, your business, your workspace."}
        </p>
        {!sb && (
          <div className="setup-note">
            Authentication needs NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local. You can explore using
            local mode now.
          </div>
        )}
        <form onSubmit={submit}>
          <label>
            Email address
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourbusiness.com"
            />
          </label>
          <label>
            Password
            <input
              type="password"
              autoComplete={signup ? "new-password" : "current-password"}
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
            />
          </label>
          <Button disabled={!sb || busy}>
            {busy ? "One moment…" : signup ? "Create account" : "Sign in"}
          </Button>
        </form>
        <p className="notice" role="status">
          {notice}
        </p>
        <button
          className="text-link"
          onClick={() => {
            setSignup(!signup);
            setNotice("");
          }}
        >
          {signup
            ? "Already have an account? Sign in"
            : "New here? Create an account"}
        </button>
        <Link className="btn btn-outline" href="/dashboard">
          Continue in local mode
        </Link>
        <p className="tiny" style={{ marginTop: 20, letterSpacing: 0 }}>
          Local data is saved in this browser. Use your own device for private
          business information.
        </p>
      </section>
    </div>
  );
}
