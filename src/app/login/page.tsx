"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../components/AuthProvider";

export default function LoginPage() {
  const r = useRouter();
  const { doLogin, error } = useAuth();
  const [email, setEmail] = useState("fe1@example.com");
  const [password, setPassword] = useState("Password123!");
  const [busy, setBusy] = useState(false);

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

        {error ? <p style={{ color: "crimson" }}>{error}</p> : null}

        <button disabled={busy} type="submit">
          {busy ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
