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

  const formatMoney = (value: number, currency: string) => {
    try {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${currency} ${value.toFixed(2)}`;
    }
  };

  return (
    <div className="page-shell">
      <div className="container">
        <header className="topbar fade-up">
          <div className="brand">
            <span className="brand-badge">EC</span>
            LuxeCart Studio
          </div>
          <nav className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/dashboard">Dashboard</Link>
            <a href="#catalog">Catalog</a>
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

            <section id="catalog" className="fade-up">
              <h2 className="section-title">Catalog highlights</h2>
              {productsLoading ? (
                <div className="empty-state">Loading products...</div>
              ) : productsError ? (
                <div className="empty-state" style={{ color: "crimson" }}>
                  {productsError}
                </div>
              ) : products.length === 0 ? (
                <div className="empty-state">No products found.</div>
              ) : (
                <div className="catalog-grid">
                  {products.map((p) => (
                    <article key={p.id} className="product-card">
                      <div className="product-thumb">{p.sku}</div>
                      <div>
                        <h3 style={{ margin: "0 0 6px" }}>{p.name}</h3>
                        <div className="product-meta">
                          <span>SKU {p.sku}</span>
                          <span>Qty {p.qty}</span>
                        </div>
                      </div>
                      <div className="product-meta">
                        <span className="price-tag">
                          {formatMoney(p.price_cents / 100, p.currency)}
                        </span>
                        <span>{p.currency}</span>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
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
              <p style={{ color: "crimson", marginTop: 12 }}>{error ?? "Not logged in"}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
