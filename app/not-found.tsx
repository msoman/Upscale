import Link from "next/link";
export default function NotFound() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="eyebrow">A LITTLE OFF THE MAP</div>
        <h1>This page is still a possibility.</h1>
        <p>Let’s get you back to your workspace.</p>
        <Link href="/dashboard" className="btn btn-primary">
          Back to overview →
        </Link>
      </div>
    </div>
  );
}
