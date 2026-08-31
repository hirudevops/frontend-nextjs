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
    if (!user) return;

    let active = true;
    const loadProducts = async () => {
      await Promise.resolve();
      if (!active) return;

      setProductsLoading(true);
      setProductsError(null);

      try {
        const res = await listProducts(12, 0);
        if (!active) return;
        setProducts(res.items ?? []);
      } catch (err: unknown) {
        if (!active) return;
        setProductsError(err instanceof Error ? err.message : "Failed to load catalog");
      } finally {
        if (!active) return;
        setProductsLoading(false);
      }
    };

    void loadProducts();

    return () => {
      active = false;
    };
  }, [user]);

  const inventoryLow = products.filter((p) => p.qty < 5).length;
  const inventoryOk = products.filter((p) => p.qty >= 5).length;
  const inventoryCoverage = products.length ? Math.round((inventoryOk / products.length) * 100) : 0;

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
              <p className="hero-sub">Fetching your latest catalog and account details.</p>
            </div>
          </div>
        ) : user ? (
          <>
            <section className="workspace-heading fade-up">
              <div><p className="page-eyebrow">DASHBOARD / TODAY</p><h1>Keep the operation moving.</h1><p>Monitor inventory signals and shift attention where it makes the biggest difference.</p></div>
              <div className="workspace-actions">
                <div className="cta-row">
                  <button className="btn btn-primary" onClick={() => refreshMe()}>Sync account</button>
                  <Link className="btn btn-ghost" href="/catalog">View catalog</Link>
                </div>
                <button className="text-button dark-text-button" onClick={() => doLogout()}>Sign out</button>
              </div>
            </section>
            <section className="metric-strip fade-up" aria-label="Inventory metrics">
              <div><span>Tracked products</span><strong>{products.length}</strong><small>In active view</small></div>
              <div><span>Needs attention</span><strong>{inventoryLow}</strong><small>Below quantity threshold</small></div>
              <div><span>In stock</span><strong>{inventoryOk}</strong><small>Ready to fulfil</small></div>
              <div className="coverage-metric"><span>Stock coverage</span><strong>{inventoryCoverage}%</strong><div><i style={{ width: `${inventoryCoverage}%` }} /></div></div>
            </section>
            <section className="dashboard-grid fade-up">
              <div className="watchlist-panel"><div className="panel-heading"><div><p>INVENTORY WATCHLIST</p><h2>What needs a closer look</h2></div><Link href="/catalog">See all →</Link></div>
                {productsLoading ? <p className="panel-empty">Updating catalog signals...</p> : productsError ? <p className="panel-empty panel-error">{productsError}</p> : products.length === 0 ? <p className="panel-empty">No products are available yet.</p> : <div className="watchlist">{products.slice(0, 4).map((product) => <div key={product.id}><span className="product-initial">{product.name.slice(0, 1)}</span><p><strong>{product.name}</strong><small>{product.sku}</small></p><b className={product.qty < 5 ? "stock-low" : "stock-good"}>{product.qty} units</b></div>)}</div>}
              </div>
              <aside className="focus-panel"><p>FOCUS MODE</p><h2>{inventoryLow ? `${inventoryLow} products need attention.` : "Inventory is in good shape."}</h2><span>{inventoryLow ? "Open the catalog to review low-stock products before your next fulfilment cycle." : "All tracked products meet the current inventory threshold."}</span><Link className="btn btn-primary" href="/catalog">Review catalog</Link></aside>
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
              <p style={{ color: "crimson", marginTop: 12 }}>{authMessage}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
