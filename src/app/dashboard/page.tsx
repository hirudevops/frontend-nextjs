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
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1>Dashboard</h1>

      <p>
        <Link href="/">Home</Link>
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <pre style={{ background: "#111", color: "#0f0", padding: 12, overflow: "auto" }}>
            {JSON.stringify(user, null, 2)}
          </pre>
          <button onClick={() => refreshMe()}>Refresh /me</button>{" "}
          <button onClick={() => doLogout()}>Logout</button>
          <section style={{ marginTop: 24 }}>
            <h2>Catalog</h2>
            {productsLoading ? (
              <p>Loading products...</p>
            ) : productsError ? (
              <p style={{ color: "crimson" }}>{productsError}</p>
            ) : products.length === 0 ? (
              <p>No products found.</p>
            ) : (
              <ul>
                {products.map((p) => (
                  <li key={p.id}>
                    <strong>{p.name}</strong> ({p.sku}) - {p.currency} {p.price_cents / 100}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      ) : (
        <>
          <p style={{ color: "crimson" }}>{error ?? "Not logged in"}</p>
          <p>
            Go to <Link href="/login">Login</Link>
          </p>
        </>
      )}
    </main>
  );
}
