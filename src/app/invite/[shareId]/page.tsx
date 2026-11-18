"use client";

import { useEffect, useRef, useState } from "react";

type SavedInvitation = {
  title: string;
  designJson: Record<string, unknown>;
};

export default function SharedInvitationPage({ params }: { params: { shareId: string } }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [invitation, setInvitation] = useState<SavedInvitation | null>(null);
  const [status, setStatus] = useState("Loading invitation…");

  useEffect(() => {
    let active = true;
    let instance: { dispose: () => void } | null = null;

    async function loadInvitation() {
      try {
        const response = await fetch(`/api/invitations/${params.shareId}`);
        if (!response.ok) throw new Error("Invitation not found");
        const data = await response.json();
        if (!active) return;
        setInvitation(data.invitation);
        const { StaticCanvas } = await import("fabric");
        if (!active || !canvasRef.current) return;
        const canvas = new StaticCanvas(canvasRef.current);
        instance = canvas;
        await canvas.loadFromJSON(data.invitation.designJson);
        canvas.renderAll();
        if (active) setStatus("");
      } catch {
        if (active) setStatus("This invitation could not be found. The link may be incorrect.");
      }
    }

    loadInvitation();
    return () => {
      active = false;
      instance?.dispose();
    };
  }, [params.shareId]);

  return (
    <main style={{ minHeight: "100vh", background: "#faf7f2", color: "#302923", fontFamily: "Arial, sans-serif", padding: "28px 16px 50px" }}>
      <header style={{ maxWidth: 900, margin: "0 auto 28px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <a href="/" style={{ color: "#302923", textDecoration: "none", fontFamily: "Georgia,serif", fontSize: 25, fontWeight: 700 }}>InviteKart<span style={{ color: "#8d3f4b" }}>.</span></a>
        <a href="/templates" style={{ color: "#8d3f4b", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>Create your own invitation →</a>
      </header>
      <section style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
        <div style={{ color: "#8d3f4b", letterSpacing: 2, fontSize: 11, fontWeight: 700 }}>YOU’RE INVITED</div>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: 32, margin: "9px 0 24px" }}>{invitation?.title || "A special invitation"}</h1>
        {status ? <p role="status" style={{ color: "#81776e", padding: 40 }}>{status}</p> : <div style={{ display: "inline-block", maxWidth: "100%", padding: 12, background: "#eee7df", borderRadius: 8, boxShadow: "0 12px 35px #33241c12" }}>
          <canvas ref={canvasRef} style={{ maxWidth: "100%", height: "auto" }} />
        </div>}
        <p style={{ color: "#81776e", fontSize: 13, marginTop: 24 }}>Made with InviteKart · Free invitation maker</p>
      </section>
    </main>
  );
}
