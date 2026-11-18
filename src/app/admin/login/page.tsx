"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Sign in failed");
      router.replace("/admin/templates"); router.refresh();
    } catch (err) { setError(err instanceof Error ? err.message : "Sign in failed"); }
    finally { setBusy(false); }
  }
  return <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#faf7f2", padding: 20, fontFamily: "Arial,sans-serif", color: "#302923" }}>
    <form onSubmit={submit} style={{ width: "100%", maxWidth: 420, background: "#fffdfa", border: "1px solid #eee5dc", borderRadius: 10, padding: 30, boxShadow: "0 15px 45px #30292310" }}>
      <a href="/" style={{ color: "#8d3f4b", textDecoration: "none", fontFamily: "Georgia,serif", fontSize: 25, fontWeight: 700 }}>InviteKart.</a>
      <p style={{ color: "#8d3f4b", fontSize: 11, letterSpacing: 2, fontWeight: 700, marginTop: 28 }}>PRIVATE ADMIN AREA</p>
      <h1 style={{ fontFamily: "Georgia,serif", fontSize: 30, margin: "8px 0" }}>Admin sign in</h1>
      <p style={{ color: "#81776e", fontSize: 14, lineHeight: 1.6 }}>Sign in to manage your invitation templates.</p>
      <label style={label}>ADMIN EMAIL</label><input type="email" required autoComplete="username" value={email} onChange={e => setEmail(e.target.value)} style={field} />
      <label style={label}>PASSWORD</label><input type="password" required autoComplete="current-password" value={password} onChange={e => setPassword(e.target.value)} style={field} />
      {error && <p role="alert" style={{ color: "#a12f36", fontSize: 13 }}>{error}</p>}
      <button disabled={busy} style={{ width: "100%", marginTop: 20, padding: 13, border: 0, borderRadius: 5, background: "#8d3f4b", color: "white", fontWeight: 700, cursor: "pointer" }}>{busy ? "Signing in…" : "Sign in securely"}</button>
    </form>
  </main>;
}
const label: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, margin: "18px 0 7px", color: "#6e655d" };
const field: React.CSSProperties = { width: "100%", padding: 12, border: "1px solid #e5d9ce", borderRadius: 4, background: "white", boxSizing: "border-box" };
