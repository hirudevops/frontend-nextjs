"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "../components/AuthProvider";
import { listProducts, type CatalogProduct } from "../lib/catalogClient";

export default function Home() {
  const { user, loading, doLogout } = useAuth();
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);

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
      <h1>eCommerce Frontend</h1>

      {loading ? (
        <p>Loading...</p>
      ) : user ? (
        <>
          <p>Logged in as: {user.email ?? user.id ?? "user"}</p>
          <p>
            <Link href="/dashboard">Go to dashboard</Link>
          </p>
          <button onClick={() => doLogout()}>Logout</button>
        </>
      ) : (
        <>
          <p>
            <Link href="/login">Login</Link> | <Link href="/register">Register</Link>
          </p>
        </>
      )}

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
    </main>
  );
}
