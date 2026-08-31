"use client";

import Link from "next/link";
import { useAuth } from "../components/AuthProvider";

export default function Home() {
  const { user, loading, error, doLogout, refreshMe } = useAuth();

  const authMessage = error?.toLowerCase().includes("missing refresh token")
    ? "Please login. If you are not registered please register."
    : error ?? "Please login. If you are not registered please register.";

  return (
    <div className="page-shell">
      <div className="container">
        <header className="topbar fade-up">
          <div className="brand">
            <span className="brand-badge">TP</span>
            TechPilot Studio
          </div>
          <nav className="nav-links">
            <Link href="/register">Register</Link>
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/catalog">Catalog</Link>
          </nav>
          {user ? (
            <div className="pill">Signed in: {user.email ?? user.id ?? "user"}</div>
          ) : null}
        </header>

        {loading ? (
          <div className="hero">
            <div className="hero-card fade-up">
              <h1 className="hero-title">Loading your storefront...</h1>
              <p className="hero-sub">Fetching your latest account details.</p>
            </div>
          </div>
        ) : user ? (
          <section className="pilot-home fade-up">
            <div className="pilot-home-copy">
              <p className="page-eyebrow">OPERATIONAL OVERVIEW</p>
              <h1>Good to see you back.</h1>
              <p>Keep your store moving with a clear view of products, stock, and the work that matters today.</p>
              <div className="cta-row">
                <Link className="btn btn-primary" href="/dashboard">Open dashboard</Link>
                <Link className="btn btn-ghost" href="/catalog">Browse catalog</Link>
              </div>
            </div>
            <div className="pilot-home-status">
              <span>SESSION ACTIVE</span>
              <strong>{user.email ?? user.id ?? "TechPilot operator"}</strong>
              <div className="pilot-status-line"><i />Workspace synced</div>
              <div className="cta-row">
                <button className="btn btn-ghost" onClick={() => refreshMe()}>Refresh session</button>
                <button className="text-button" onClick={() => doLogout()}>Sign out</button>
              </div>
            </div>
          </section>
        ) : (
          <section className="pilot-home fade-up">
            <div className="pilot-home-copy">
              <p className="page-eyebrow">TECHPILOT STUDIO</p>
              <h1>Your operational command center.</h1>
              <p>One focused workspace for products, inventory, and the teams behind them.</p>
              <div className="cta-row"><Link className="btn btn-primary" href="/login">Sign in</Link><Link className="btn btn-ghost" href="/register">Create account</Link></div>
              <p className="inline-error">{authMessage}</p>
            </div>
            <div className="pilot-home-status pilot-grid-art" aria-hidden="true"><span>LIVE SIGNAL</span><strong>Make every decision visible.</strong><div className="pilot-art-ring" /></div>
          </section>
        )}
      </div>
    </div>
  );
}
