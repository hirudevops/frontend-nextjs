"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { listProducts, type CatalogProduct } from "../../lib/catalogClient";

export default function DashboardPage() {
  const { user, loading, error, doLogout, refreshMe } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setProducts([]);
      setProductsLoading(false);
      setProductsError(null);
      return;
    }

    let active = true;
    setProductsLoading(true);
    setProductsError(null);

    listProducts(12, 0)
      .then((res) => {
        if (!active) return;
        setProducts(res.items ?? []);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setProductsError(err instanceof Error ? err.message : "Failed to load catalog");
      })
      .finally(() => {
        if (!active) return;
        setProductsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user]);

  const inventoryLow = products.filter((p) => p.qty < 5).length;
  const inventoryOk = products.filter((p) => p.qty >= 5).length;

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
              <p className="hero-sub">Fetching your latest catalog and account details.</p>
            </div>
          </div>
        ) : user ? (
          <>
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
              <div className="hero-card fade-up">
                <h2 className="section-title" style={{ marginTop: 0 }}>
                  Store pulse
                </h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <p className="stat-title">Catalog items</p>
                    <p className="stat-value">{products.length}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-title">Low stock</p>
                    <p className="stat-value">{inventoryLow}</p>
                  </div>
                  <div className="stat-card">
                    <p className="stat-title">In stock</p>
                    <p className="stat-value">{inventoryOk}</p>
                  </div>
                </div>
              </div>
            </section>
            {productsLoading ? (
              <div className="empty-state">Loading products...</div>
            ) : productsError ? (
              <div className="empty-state" style={{ color: "crimson" }}>
                {productsError}
              </div>
            ) : null}
          </>
        ) : (
          <section className="hero">
            <div className="hero-card fade-up">
              <h1 className="hero-title">Please sign in</h1>
              <p className="hero-sub">Login to see your catalog and manage products.</p>
              <div className="cta-row">
                <Link className="btn btn-primary" href="/login">
                  Go to login
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

