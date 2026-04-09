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
            <span className="brand-badge">EC</span>
            LuxeCart Studio
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
          <section className="hero">
            <div className="hero-card fade-up">
              <div className="pill">Welcome back</div>
              <h1 className="hero-title">Your storefront is live.</h1>
              <p className="hero-sub">
                Curate products, keep inventory healthy, and launch new drops for your shoppers.
              </p>
              <div className="cta-row">
                <button className="btn btn-primary" onClick={() => refreshMe()}>
                  Sync account
                </button>
                <button className="btn btn-ghost" onClick={() => doLogout()}>
                  Sign out
                </button>
              </div>
            </div>
          </section>
        ) : (
          <section className="hero">
            <div className="hero-card fade-up">
              <h1 className="hero-title">Please sign in</h1>
              <p className="hero-sub">Login to see your catalog and manage products.</p>
              <div className="cta-row">
                <Link className="btn btn-primary" href="/login">
                  LOGIN
                </Link>
              </div>
              <p style={{ color: "crimson", marginTop: 12 }}>{authMessage}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

