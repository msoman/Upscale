"use client";
import Link from "next/link";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Let’s try that again.</h1>
        <p>
          Something interrupted this page. Your saved browser drafts should
          still be available.
        </p>
        <button className="btn btn-primary" onClick={reset}>
          Try again
        </button>
        <Link className="btn btn-ghost" href="/dashboard">
          Back to overview
        </Link>
      </div>
    </div>
  );
}
