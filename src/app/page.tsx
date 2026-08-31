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
          <>
            <section className="studio-hero fade-up">
              <div className="studio-hero-copy">
                <p className="page-eyebrow">OPERATIONAL OVERVIEW</p>
                <h1>Decide with the whole picture.</h1>
                <p>TechPilot brings the pace of your catalog and the health of your inventory into one focused workspace.</p>
                <div className="cta-row"><Link className="btn btn-primary" href="/dashboard">Open dashboard</Link><Link className="btn btn-ghost" href="/catalog">Explore catalog</Link></div>
              </div>
              <div className="studio-signal" aria-label="Workspace is active">
                <div className="signal-head"><span>WORKSPACE STATUS</span><b>Live</b></div>
                <strong>{user.email ?? user.id ?? "TechPilot operator"}</strong>
                <div className="signal-meter"><span /><span /><span /><span /></div>
                <p><i />Data connection ready</p>
              </div>
            </section>
            <section className="home-actions fade-up">
              <Link href="/dashboard"><span>01</span><div><strong>Read the pulse</strong><p>See product and inventory signals at a glance.</p></div><b>→</b></Link>
              <Link href="/catalog"><span>02</span><div><strong>Shape the catalog</strong><p>Filter your collection and inspect what needs attention.</p></div><b>→</b></Link>
              <button onClick={() => refreshMe()}><span>03</span><div><strong>Refresh workspace</strong><p>Retrieve the latest authenticated account state.</p></div><b>↗</b></button>
              <button onClick={() => doLogout()}><span>04</span><div><strong>End session</strong><p>Sign out securely when you are finished for the day.</p></div><b>↗</b></button>
            </section>
          </>
        ) : (
          <section className="studio-hero fade-up">
            <div className="studio-hero-copy">
              <p className="page-eyebrow">TECHPILOT STUDIO</p>
              <h1>Your operational command center.</h1>
              <p>One focused workspace for products, inventory, and the teams behind them.</p>
              <div className="cta-row"><Link className="btn btn-primary" href="/login">Sign in</Link><Link className="btn btn-ghost" href="/register">Create account</Link></div>
              <p className="inline-error">{authMessage}</p>
            </div>
            <div className="studio-signal studio-signal-art" aria-hidden="true"><div className="signal-head"><span>LIVE SIGNAL</span><b>Now</b></div><strong>Make every decision visible.</strong><div className="signal-meter"><span /><span /><span /><span /></div></div>
          </section>
        )}
      </div>
    </div>
  );
}
