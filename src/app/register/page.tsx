"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { register } from "../../lib/authClient";

export default function RegisterPage() {
  const r = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <main className="access-page">
      <section className="access-aside">
        <Link className="login-brand" href="/">TECHPILOT<span>STUDIO</span></Link>
        <div><p className="page-eyebrow">GET STARTED</p><h1>Build the view your operation deserves.</h1><p>Join your team&apos;s workspace and bring products, stock, and signals into focus.</p></div>
        <p className="access-footnote">Already set up? <Link href="/login">Sign in</Link></p>
      </section>
      <section className="access-panel">
        <div className="access-form-wrap">
          <p className="login-eyebrow">CREATE ACCOUNT</p>
          <h2>Start here.</h2>
          <p className="login-intro">Create your TechPilot Studio account.</p>

      <form
        className="login-form"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setError(null);
          try {
            await register(email, password);
            const qp = new URLSearchParams({ registered: "1", email });
            r.push(`/login?${qp.toString()}`);
          } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Registration failed");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label htmlFor="register-email">Email address</label>
        <input id="register-email" autoComplete="email" inputMode="email" required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

        <label htmlFor="register-password">Password</label>
        <input
            id="register-password"
            autoComplete="new-password"
            required
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        <small className="field-hint">Use at least 8 characters.</small>

        {error ? <p className="login-error" role="alert">{error}</p> : null}

        <button className="login-submit" disabled={busy} type="submit">
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>
        </div>
      </section>
    </main>
  );
}
