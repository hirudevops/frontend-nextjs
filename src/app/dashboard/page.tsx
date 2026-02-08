"use client";

import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";

export default function DashboardPage() {
  const { user, loading, error, doLogout, refreshMe } = useAuth();

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
