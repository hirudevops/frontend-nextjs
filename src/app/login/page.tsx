"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";
import LoginScene from "../../components/LoginScene";

export default function LoginPage() {
  return (
    <Suspense fallback={<main style={{ padding: 24, maxWidth: 480 }}>Loading...</main>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const r = useRouter();
  const params = useSearchParams();
  const { doLogin, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const displayError = error?.toLowerCase().includes("missing refresh token") ? null : error;

  useEffect(() => {
    const registered = params.get("registered");
    const qpEmail = params.get("email");
    if (registered === "1") {
      setSuccessMsg("You are registered successfully. Please login.");
    } else {
      setSuccessMsg(null);
    }
    if (qpEmail) {
      setEmail(qpEmail);
    }
    if (registered === "1") {
      setPassword("");
    }
  }, [params]);

  return (
    <main className="login-page">
      <section className="login-showcase" aria-label="LuxeCart Studio">
        <Link className="login-brand" href="/">
          LUXECART<span>STUDIO</span>
        </Link>
        <div className="login-copy">
          <p className="login-kicker">CURATED COMMERCE</p>
          <h1>Enter your store&apos;s better dimension.</h1>
          <p>Track the collection, understand inventory, and keep the next move in reach.</p>
        </div>
        <LoginScene />
        <p className="login-scene-caption">Move your cursor across the collection.</p>
      </section>

      <section className="login-panel" aria-labelledby="login-heading">
        <div className="login-form-wrap">
          <p className="login-eyebrow">WELCOME BACK</p>
          <h2 id="login-heading">Sign in</h2>
          <p className="login-intro">Use your LuxeCart account to continue.</p>

          <form
            className="login-form"
            onSubmit={async (event) => {
              event.preventDefault();
              setBusy(true);
              try {
                await doLogin(email, password);
                r.push("/dashboard");
              } finally {
                setBusy(false);
              }
            }}
          >
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              autoComplete="email"
              inputMode="email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              autoComplete="current-password"
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />

            {successMsg ? <p className="login-success" role="status">{successMsg}</p> : null}
            {displayError ? <p className="login-error" role="alert">{displayError}</p> : null}

            <button className="login-submit" disabled={busy} type="submit">
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="login-register">
            New to LuxeCart? <Link href="/register">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
