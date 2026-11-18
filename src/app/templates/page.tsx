"use client";

import { useEffect, useMemo, useState } from "react";
import { weddingTemplates, type InvitationTemplate } from "@/lib/wedding-templates";

const otherTemplates: InvitationTemplate[] = [];
type GalleryTemplate = InvitationTemplate & { previewUrl?: string; custom?: boolean };
const categories = ["All", "Wedding", "Birthday", "Engagement", "Baby shower", "Housewarming", "Naming ceremony", "Festival", "Anniversary", "Puja", "Graduation", "Corporate"];
const occasionNames: Record<string, string> = { WEDDING: "Wedding", BIRTHDAY: "Birthday", ENGAGEMENT: "Engagement", BABY_SHOWER: "Baby shower", HOUSEWARMING: "Housewarming", NAMING_CEREMONY: "Naming ceremony", OTHER: "Festival" };

function previewSymbol(style?: string) {
  const symbols: Record<string, string> = { balloons: "◌  ○  ◌", disco: "✦ ✧ ✦", jungle: "❧  ❀  ❧", rainbow: "⌒ ⌒ ⌒", elegant: "✧", floral: "❀  ❁  ❀", classic: "✦", minimal: "—", indian: "✥  ॐ  ✥", celestial: "☾  ✧  ☆", woodland: "❧  ♧  ❧", teddy: "♡", clouds: "☁  ☁", home: "⌂", botanical: "❧  ❀", diya: "दीप", holi: "●  ●  ●" };
  return symbols[style || ""] || "✦  ❧  ✦";
}

function previewPattern(style?: string, background?: string): string {
  const palettes: Record<string, string> = { balloons: "radial-gradient(circle at 15% 18%,#f5b7c8 0 7%,transparent 7.5%),radial-gradient(circle at 85% 20%,#b8c9ec 0 8%,transparent 8.5%),radial-gradient(circle at 12% 85%,#f5d59b 0 6%,transparent 6.5%)", disco: "radial-gradient(circle at 15% 15%,#f1d46b 0 2px,transparent 3px),radial-gradient(circle at 80% 75%,#ed74aa 0 3px,transparent 4px)", jungle: "radial-gradient(ellipse at 0% 0%,#9ab47a 0 12%,transparent 13%),radial-gradient(ellipse at 100% 100%,#9ab47a 0 14%,transparent 15%)", rainbow: "radial-gradient(ellipse at 50% 120%,#f5a9a9 0 25%,transparent 25.5%),radial-gradient(ellipse at 50% 120%,#f3d28b 0 32%,transparent 32.5%)", floral: "radial-gradient(circle at 10% 10%,#e6b8bd 0 4px,transparent 5px),radial-gradient(circle at 90% 90%,#e6b8bd 0 5px,transparent 6px)", celestial: "radial-gradient(circle at 15% 18%,#fff 0 1px,transparent 2px),radial-gradient(circle at 80% 30%,#fff 0 1px,transparent 2px)", indian: "radial-gradient(circle at 50% 0%,#e7b85d 0 18%,transparent 19%),radial-gradient(circle at 0% 100%,#d68a42 0 12%,transparent 13%)", diya: "radial-gradient(ellipse at 50% 10%,#f7b84c 0 8%,transparent 9%),radial-gradient(circle at 20% 80%,#e6a14a 0 3px,transparent 4px)", holi: "radial-gradient(circle at 10% 15%,#e88bad 0 9%,transparent 10%),radial-gradient(circle at 90% 85%,#83b8dc 0 11%,transparent 12%)", elegant: "radial-gradient(circle at 50% 0%,#e6d4a8 0 18%,transparent 19%)", botanical: "radial-gradient(ellipse at 0% 50%,#a9b99b 0 9%,transparent 10%),radial-gradient(ellipse at 100% 50%,#a9b99b 0 9%,transparent 10%)" };
  return palettes[style || ""] || (background ? "linear-gradient(135deg,rgba(255,255,255,.22),transparent 55%)" : "none");
}

export default function TemplatesPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [customTemplates, setCustomTemplates] = useState<GalleryTemplate[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    fetch("/api/templates").then(r => r.ok ? r.json() : { templates: [] }).then(data => {
      const mapped = (data.templates || []).map((item: { id: string; title: string; description: string | null; occasion: string; category?: string; previewUrl: string; designJson: { heading?: string; tag?: string; background?: string; foreground?: string } }) => ({
        id: item.id, name: item.title, category: item.category || item.designJson?.category || occasionNames[item.occasion] || "Festival",
        description: item.description || "A custom invitation design.", background: item.designJson?.background || "#f5e9df",
        foreground: item.designJson?.foreground || "#754c47", heading: item.designJson?.heading || item.title,
        tag: item.designJson?.tag || "", previewUrl: item.previewUrl, custom: true,
      }));
      setCustomTemplates(mapped);
    }).catch(() => setCustomTemplates([]));
  }, []);
  const templates: GalleryTemplate[] = useMemo(() => [...weddingTemplates, ...otherTemplates, ...customTemplates], [customTemplates]);
  const visible = useMemo(() => templates.filter(item =>
    (category === "All" || item.category === category) &&
    (item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase()))
  ), [templates, category, search]);

  return (
    <main style={{ minHeight: "100vh", background: "#faf7f2", color: "#302923", fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px 5vw", background: "#fffdfa", borderBottom: "1px solid #eadfd4" }}>
        <a href="/" style={{ color: "#302923", textDecoration: "none", fontFamily: "Georgia,serif", fontSize: 26, fontWeight: 700 }}>InviteKart<span style={{ color: "#8d3f4b" }}>.</span></a>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>{isAdmin && <a href="/admin/templates" style={{ color: "#8d3f4b", fontWeight: 700, textDecoration: "none" }}>Manage templates</a>}<a href="/editor" style={{ color: "#8d3f4b", fontWeight: 700, textDecoration: "none" }}>Open advanced editor →</a></div>
      </header>
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 22px 24px" }}>
        <div style={{ color: "#8d3f4b", letterSpacing: 2, fontSize: 11, fontWeight: 700 }}>A DESIGN FOR EVERY OCCASION</div>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,48px)", margin: "10px 0" }}>Invitation templates</h1>
        <p style={{ color: "#81776e", maxWidth: 620, lineHeight: 1.7 }}>Choose a design to get started. Each template opens in the advanced editor, where you can personalise the colours, text and layout.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, margin: "25px 0 18px" }}>
          {categories.map(item => <button key={item} onClick={() => setCategory(item)} style={{ border: category === item ? "1px solid #8d3f4b" : "1px solid #e5d9ce", background: category === item ? "#8d3f4b" : "#fffdfa", color: category === item ? "white" : "#51473f", borderRadius: 30, padding: "9px 15px", cursor: "pointer" }}>{item}</button>)}
        </div>
        <input aria-label="Search templates" placeholder="Search designs or occasions…" value={search} onChange={event => setSearch(event.target.value)} style={{ width: "100%", maxWidth: 420, padding: 13, border: "1px solid #e5d9ce", borderRadius: 5, background: "#fffdfa", fontSize: 14 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 22, marginTop: 28 }}>
          {visible.map(item => <article key={item.id} style={{ background: "#fffdfa", border: "1px solid #eee5dc", borderRadius: 8, padding: 12 }}>
            <div style={{ position: "relative", background: item.background, backgroundImage: item.previewUrl ? undefined : previewPattern(item.style, item.background), color: item.foreground, minHeight: 270, padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center", textAlign: "center", border: "1px solid #fff", outline: "1px solid #eadfd4", overflow: "hidden", borderRadius: item.style === "minimal" ? 2 : 0 }}>
              {item.previewUrl && <img src={item.previewUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
              {!item.previewUrl && <><span aria-hidden="true" style={{ position: "absolute", inset: 10, border: "1px solid currentColor", opacity: 0.45, pointerEvents: "none" }} /><span aria-hidden="true" style={{ position: "absolute", top: 20, left: 0, right: 0, textAlign: "center", fontSize: 24, opacity: 0.75 }}>{previewSymbol(item.style)}</span><span style={{ fontSize: 10, letterSpacing: 2, marginTop: 25 }}>{item.tag}</span><span style={{ fontFamily: "Georgia,serif", fontSize: 29, lineHeight: 1.25, maxWidth: "100%", overflowWrap: "anywhere" }}>{item.heading}</span><span style={{ fontFamily: "Georgia,serif", fontSize: 15, fontStyle: "italic" }}>A special day awaits</span><span style={{ fontSize: 11, letterSpacing: 1 }}>21 · 02 · 2027</span><span aria-hidden="true" style={{ position: "absolute", bottom: 17, fontSize: 18, opacity: 0.7 }}>{previewSymbol(item.style)}</span></>}
            </div>
            <div style={{ padding: "14px 3px 3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}><strong>{item.name}</strong><span style={{ fontSize: 11, color: "#8d3f4b" }}>FREE</span></div>
              <div style={{ color: "#8a8179", fontSize: 12, marginTop: 5 }}>{item.category}</div>
              <p style={{ color: "#71675f", fontSize: 12, lineHeight: 1.5, minHeight: 36 }}>{item.description}</p>
              <a href={`/editor?template=${item.id}`} style={{ display: "block", textAlign: "center", background: "#8d3f4b", color: "white", textDecoration: "none", borderRadius: 4, padding: 11, fontWeight: 700, fontSize: 13 }}>Customize this design →</a>
            </div>
          </article>)}
        </div>
        {visible.length === 0 && <p style={{ padding: 30, color: "#81776e" }}>No templates match that search. Try another name or occasion.</p>}
      </section>
      <footer style={{ textAlign: "center", padding: 28, color: "#81776e", fontSize: 12 }}>© {new Date().getFullYear()} InviteKart · Free invitation maker</footer>
    </main>
  );
}
