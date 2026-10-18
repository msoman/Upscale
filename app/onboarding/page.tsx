import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { BusinessForm } from "@/components/business-form";
import { Heading } from "@/components/common";
export default function Onboarding() {
  return (
    <div className="onboarding">
      <Link href="/" className="logo" style={{ marginBottom: 40 }}>
        <span className="logo-mark">
          <ArrowUpRight size={23} />
        </span>
        UPSCALE.
      </Link>
      <Heading
        eyebrow="A STRONGER START"
        title="Every big idea has a story."
        description="Tell us yours. Let’s create a workspace around your business and your ambitions."
      />
      <BusinessForm onboarding />
      <p style={{ marginTop: 20, fontSize: 12 }}>
        Prefer to explore first?{" "}
        <Link href="/dashboard" style={{ color: "var(--brand)" }}>
          Go to your workspace →
        </Link>
      </p>
    </div>
  );
}
