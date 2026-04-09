"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";

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
    <main style={{ padding: 24, maxWidth: 480 }}>
      <h1>Login</h1>

      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          try {
            await doLogin(email, password);
            r.push("/dashboard");
          } finally {
            setBusy(false);
          }
        }}
      >
        <div style={{ marginBottom: 12 }}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} style={{ width: "100%" }} />
        </div>

        <div style={{ marginBottom: 12 }}>
          <label>Password</label>
          <input
            value={password}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        {successMsg ? <p style={{ color: "seagreen" }}>{successMsg}</p> : null}
        {displayError ? <p style={{ color: "crimson" }}>{displayError}</p> : null}

        <button disabled={busy} type="submit">
          {busy ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}

