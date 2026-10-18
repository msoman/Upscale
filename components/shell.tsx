"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  ArrowUpRight,
  LayoutDashboard,
  MessageSquare,
  Sparkles,
  Clapperboard,
  PanelsTopLeft,
  CalendarDays,
  Settings,
  PanelLeftClose,
  Menu,
  Plus,
  Command,
  ChevronRight,
} from "lucide-react";
import { useBusiness } from "./provider";
const links = [
  ["/dashboard", "Overview", LayoutDashboard],
  ["/coach", "Business coach", MessageSquare],
  ["/creative", "Creative studio", Sparkles],
  ["/video", "Video studio", Clapperboard],
  ["/website", "Website builder", PanelsTopLeft],
  ["/social", "Social hub", CalendarDays],
  ["/settings", "Settings", Settings],
] as const;
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { business, user } = useBusiness();
  return (
    <div className={`workspace ${collapsed ? "collapsed" : ""}`}>
      <aside className="sidebar">
        <Link className="logo" href="/">
          {" "}
          <span className="logo-mark">
            <ArrowUpRight size={23} />
          </span>
          <span className="hide-collapse">
            UPSCALE<span className="logo-dot">.</span>
          </span>
        </Link>
        <button
          className="workspace-switch"
          onClick={() => setCollapsed(!collapsed)}
          aria-label="Toggle sidebar"
        >
          <span className="avatar">{business.name?.[0] || "Y"}</span>
          <span className="hide-collapse">
            <strong>{business.name || "Your workspace"}</strong>
            <small>Personal workspace</small>
          </span>
          <PanelLeftClose size={15} />
        </button>
        <div className="nav-label hide-collapse">WORKSPACE</div>
        <nav>
          {links.map(([href, label, Icon]) => (
            <Link
              key={href}
              href={href}
              title={label}
              className={path === href ? "active" : ""}
            >
              <Icon size={19} />
              <span className="hide-collapse">{label}</span>
              {label === "Business coach" && (
                <span className="badge hide-collapse">AI</span>
              )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom hide-collapse">
          <div className="mini-orb">✦</div>
          <strong>
            A little ambition.
            <br />
            Unlimited possibilities.
          </strong>
          <p>Your next big move starts with one small step.</p>
          <Link href="/coach">
            Find my next move <ArrowUpRight size={14} />
          </Link>
        </div>
        <Link className="user-row" href="/login">
          <span className="avatar purple">
            {user?.[0]?.toUpperCase() || "G"}
          </span>
          <span className="hide-collapse">
            <strong>{user || "Guest workspace"}</strong>
            <small>{user ? "Account connected" : "Local mode · Sign in"}</small>
          </span>
        </Link>
      </aside>
      <div className="main-area">
        <header className="topbar">
          <button
            className="icon-button mobile-menu"
            aria-label="Toggle navigation"
            onClick={() => setCollapsed(!collapsed)}
          >
            <Menu size={19} />
          </button>
          <span>
            Workspace <ChevronRight size={13} />{" "}
            <strong>
              {links.find((x) => x[0] === path)?.[1] || "Overview"}
            </strong>
          </span>
          <div className="top-actions">
            <span className="local-pill">
              <i /> {user ? "Cloud connected" : "Local workspace"}
            </span>
            <Link href="/coach" className="btn btn-small btn-outline">
              <Plus size={15} /> New idea <Command size={12} />
            </Link>
          </div>
        </header>
        <main className="content">{children}</main>
        <footer>
          BUILT FOR YOUR NEXT BIG THING.{" "}
          <span>UPSCALE © {new Date().getFullYear()}</span>
        </footer>
      </div>
    </div>
  );
}
