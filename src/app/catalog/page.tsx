"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../../components/AuthProvider";
import { listCategories, listProducts, type CatalogCategory, type CatalogProduct } from "../../lib/catalogClient";

export default function CatalogPage() {
  const { user, loading, error } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

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

    const loadCategories = async () => {
      await Promise.resolve();
      if (!active) return;

      setCategoriesError(null);

      try {
        const res = await listCategories();
        if (!active) return;
        setCategories(res.items ?? []);
      } catch (err: unknown) {
        if (!active) return;
        setCategoriesError(err instanceof Error ? err.message : "Failed to load categories");
      }
    };

    void loadProducts();
    void loadCategories();

    return () => {
      active = false;
    };
  }, [user]);

  const fallbackCategories = Array.from(
    new Set(
      products.map((p) => (p.category_id && p.category_id.trim() ? p.category_id.trim() : "uncategorized"))
    )
  ).sort();

  const categoryOptions = categories.length
    ? categories.map((cat) => ({ id: cat.id, label: cat.name }))
    : fallbackCategories.map((cat) => ({ id: cat, label: cat }));

  const visibleProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => {
          const cat = p.category_id && p.category_id.trim() ? p.category_id.trim() : "uncategorized";
          return cat === selectedCategory;
        });

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
              <h1 className="hero-title">Loading your catalog...</h1>
              <p className="hero-sub">Fetching your product list.</p>
            </div>
          </div>
        ) : user ? (
          <>
            <section className="hero">
              <div className="hero-card fade-up">
                <div className="pill">Catalog</div>
                <h1 className="hero-title">Catalog highlights</h1>
                <p className="hero-sub">Browse your latest products and inventory.</p>
              </div>
            </section>

            <section className="fade-up" style={{ marginBottom: 18 }}>
              <div className="pill" style={{ marginBottom: 10 }}>Categories</div>
              <div className="cta-row" style={{ flexWrap: "wrap" }}>
                <button
                  className={selectedCategory === "all" ? "btn btn-primary" : "btn btn-ghost"}
                  onClick={() => setSelectedCategory("all")}
                >
                  All
                </button>
                {categoryOptions.map((cat) => (
                  <button
					key={cat.id}
					className={selectedCategory === cat.id ? "btn btn-primary" : "btn btn-ghost"}
					onClick={() => setSelectedCategory(cat.id)}
                  >
					{cat.id === "uncategorized" ? "Uncategorized" : cat.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="fade-up">
              {productsLoading ? (
                <div className="empty-state">Loading products...</div>
              ) : categoriesError ? (
                <div className="empty-state" style={{ color: "crimson" }}>
                  {categoriesError}
                </div>
              ) : productsError ? (
                <div className="empty-state" style={{ color: "crimson" }}>
                  {productsError}
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="empty-state">No products found.</div>
              ) : (
                <div className="catalog-grid">
                  {visibleProducts.map((p) => (
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
              <p style={{ color: "crimson", marginTop: 12 }}>{authMessage}</p>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
