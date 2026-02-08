"use client";

import Link from "next/link";
import { useAuth } from "../components/AuthProvider";

export default function Home() {
  const { user, loading, doLogout } = useAuth();

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
    </main>
  );
}
