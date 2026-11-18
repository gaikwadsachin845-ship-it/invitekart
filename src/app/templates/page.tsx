"use client";

import { useEffect, useMemo, useState } from "react";
import { weddingTemplates, type InvitationTemplate } from "@/lib/wedding-templates";

const otherTemplates: InvitationTemplate[] = [
  { id: "garden-birthday", name: "Garden Party", category: "Birthday", description: "Fresh botanical colours for a joyful birthday.", background: "#e9eadc", foreground: "#52664e", heading: "Let’s Celebrate!", tag: "YOU’RE INVITED TO A BIRTHDAY" },
  { id: "confetti-birthday", name: "Happy Confetti", category: "Birthday", description: "A bright, playful design for a special day.", background: "#f8e8d2", foreground: "#a65d3b", heading: "Make a Wish!", tag: "BIRTHDAY PARTY" },
  { id: "minimal-engagement", name: "Modern Minimal", category: "Engagement", description: "Clean lines and a contemporary colour palette.", background: "#e5e8ed", foreground: "#53647a", heading: "The Beginning", tag: "JOIN OUR ENGAGEMENT" },
  { id: "floral-baby", name: "Little Bloom", category: "Baby shower", description: "Gentle floral styling for a growing family.", background: "#f5e7e8", foreground: "#a45e76", heading: "A Little One Is On The Way", tag: "BABY SHOWER" },
  { id: "housewarming", name: "New Beginnings", category: "Housewarming", description: "Warm earthy colours to celebrate a new home.", background: "#eee6d9", foreground: "#78634b", heading: "Home Sweet Home", tag: "PLEASE JOIN OUR HOUSEWARMING" },
  { id: "diwali", name: "Festival of Lights", category: "Festival", description: "A festive design with rich, celebratory colours.", background: "#f5e1c5", foreground: "#9a4d20", heading: "शुभ दीपावली", tag: "HAPPY DIWALI" },
];
type GalleryTemplate = InvitationTemplate & { previewUrl?: string; custom?: boolean };
const categories = ["All", "Wedding", "Birthday", "Engagement", "Baby shower", "Housewarming", "Festival"];
const occasionNames: Record<string, string> = { WEDDING: "Wedding", BIRTHDAY: "Birthday", ENGAGEMENT: "Engagement", BABY_SHOWER: "Baby shower", HOUSEWARMING: "Housewarming", OTHER: "Festival" };

export default function TemplatesPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [customTemplates, setCustomTemplates] = useState<GalleryTemplate[]>([]);
  useEffect(() => {
    fetch("/api/templates").then(r => r.ok ? r.json() : { templates: [] }).then(data => {
      const mapped = (data.templates || []).map((item: { id: string; title: string; description: string | null; occasion: string; previewUrl: string; designJson: { heading?: string; tag?: string; background?: string; foreground?: string } }) => ({
        id: item.id, name: item.title, category: occasionNames[item.occasion] || "Festival",
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
        <a href="/editor" style={{ color: "#8d3f4b", fontWeight: 700, textDecoration: "none" }}>Open advanced editor →</a>
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
            <div style={{ position: "relative", background: item.background, color: item.foreground, minHeight: 270, padding: 22, display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center", textAlign: "center", border: "1px solid #fff", outline: "1px solid #eadfd4", overflow: "hidden" }}>
              {item.previewUrl && <img src={item.previewUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
              {!item.previewUrl && <><span style={{ fontSize: 10, letterSpacing: 2 }}>{item.tag}</span><span style={{ fontFamily: "Georgia,serif", fontSize: 29, lineHeight: 1.25 }}>{item.heading}</span><span style={{ fontFamily: "Georgia,serif", fontSize: 15, fontStyle: "italic" }}>A special day awaits</span><span style={{ fontSize: 11, letterSpacing: 1 }}>21 · 02 · 2027</span></>}
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
