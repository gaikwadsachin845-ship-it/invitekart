"use client";

import { useMemo, useState } from "react";
import { weddingTemplates, type InvitationTemplate } from "@/lib/wedding-templates";

const otherTemplates: InvitationTemplate[] = [
  { id: "garden-birthday", name: "Garden Party", category: "Birthday", description: "Fresh botanical colours for a joyful birthday.", background: "#e9eadc", foreground: "#52664e", heading: "Let’s Celebrate!", tag: "YOU’RE INVITED TO A BIRTHDAY" },
  { id: "confetti-birthday", name: "Happy Confetti", category: "Birthday", description: "A bright, playful design for a special day.", background: "#f8e8d2", foreground: "#a65d3b", heading: "Make a Wish!", tag: "BIRTHDAY PARTY" },
  { id: "minimal-engagement", name: "Modern Minimal", category: "Engagement", description: "Clean lines and a contemporary colour palette.", background: "#e5e8ed", foreground: "#53647a", heading: "The Beginning", tag: "JOIN OUR ENGAGEMENT" },
  { id: "floral-baby", name: "Little Bloom", category: "Baby shower", description: "Gentle floral styling for a growing family.", background: "#f5e7e8", foreground: "#a45e76", heading: "A Little One Is On The Way", tag: "BABY SHOWER" },
  { id: "housewarming", name: "New Beginnings", category: "Housewarming", description: "Warm earthy colours to celebrate a new home.", background: "#eee6d9", foreground: "#78634b", heading: "Home Sweet Home", tag: "PLEASE JOIN OUR HOUSEWARMING" },
  { id: "diwali", name: "Festival of Lights", category: "Festival", description: "A festive design with rich, celebratory colours.", background: "#f5e1c5", foreground: "#9a4d20", heading: "शुभ दीपावली", tag: "HAPPY DIWALI" },
];
const templates: InvitationTemplate[] = [...weddingTemplates, ...otherTemplates];
const categories = ["All", "Wedding", "Birthday", "Engagement", "Baby shower", "Housewarming", "Festival"];
const motifs: Record<string, string> = {
  Wedding: "✿  ❧  ✿",
  Birthday: "✦  ✧  ✦",
  Engagement: "♡  ✧  ♡",
  "Baby shower": "☁  ☆  ☁",
  Housewarming: "⌂  ❧  ⌂",
  Festival: "✺  ✦  ✺",
};
const patterns: Record<string, string> = {
  Wedding: "radial-gradient(ellipse at top left, #ffffff88, transparent 48%), repeating-linear-gradient(45deg, transparent 0 13px, #ffffff18 13px 15px)",
  Birthday: "radial-gradient(circle at 15% 18%, #ffffffaa 0 3px, transparent 4px), radial-gradient(circle at 82% 25%, #ffffff99 0 4px, transparent 5px), radial-gradient(circle at 78% 82%, #ffffff88 0 3px, transparent 4px), radial-gradient(circle at 20% 78%, #ffffff88 0 4px, transparent 5px)",
  Engagement: "radial-gradient(ellipse at center, #ffffff66, transparent 70%), repeating-radial-gradient(circle at center, transparent 0 17px, #ffffff22 18px 19px)",
  "Baby shower": "radial-gradient(circle at 18% 20%, #ffffffaa 0 22px, transparent 23px), radial-gradient(circle at 82% 78%, #ffffff88 0 30px, transparent 31px)",
  Housewarming: "linear-gradient(135deg, #ffffff44 25%, transparent 25% 50%, #ffffff33 50% 75%, transparent 75%)",
  Festival: "radial-gradient(circle at 50% 12%, #ffffff99 0 3px, transparent 4px), repeating-conic-gradient(from 10deg at 50% 50%, #ffffff18 0deg 8deg, transparent 8deg 16deg)",
};

export default function TemplatesPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const visible = useMemo(() => templates.filter((item) =>
    (category === "All" || item.category === category) &&
    (item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase()))
  ), [category, search]);

  return (
    <main style={{ minHeight: "100vh", background: "#faf7f2", color: "#302923", fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, padding: "18px 5vw", background: "#fffdfa", borderBottom: "1px solid #eadfd4" }}>
        <a href="/" style={{ color: "#302923", textDecoration: "none", fontFamily: "Georgia,serif", fontSize: 26, fontWeight: 700 }}>InviteKart<span style={{ color: "#8d3f4b" }}>.</span></a>
        <a href="/editor" style={{ color: "#8d3f4b", fontWeight: 700, textDecoration: "none" }}>Open advanced editor →</a>
      </header>
      <section style={{ maxWidth: 1180, margin: "0 auto", padding: "48px 22px 24px" }}>
        <div style={{ color: "#8d3f4b", letterSpacing: 2, fontSize: 11, fontWeight: 700 }}>A DESIGN FOR EVERY OCCASION</div>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(32px,5vw,48px)", margin: "10px 0" }}>Invitation templates</h1>
        <p style={{ color: "#81776e", maxWidth: 620, lineHeight: 1.7 }}>Explore original designs for life’s special moments. Choose a card and personalise its wording, colours and layout in the editor.</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 9, margin: "25px 0 18px" }}>
          {categories.map((item) => <button key={item} onClick={() => setCategory(item)} style={{ border: category === item ? "1px solid #8d3f4b" : "1px solid #e5d9ce", background: category === item ? "#8d3f4b" : "#fffdfa", color: category === item ? "white" : "#51473f", borderRadius: 30, padding: "9px 15px", cursor: "pointer" }}>{item}</button>)}
        </div>
        <input aria-label="Search templates" placeholder="Search designs or occasions…" value={search} onChange={(event) => setSearch(event.target.value)} style={{ width: "100%", maxWidth: 420, padding: 13, border: "1px solid #e5d9ce", borderRadius: 5, background: "#fffdfa", fontSize: 14 }} />
        <p style={{ color: "#81776e", fontSize: 12, marginTop: 14 }}>{visible.length} designs to explore</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 22, marginTop: 18 }}>
          {visible.map((item) => <article key={item.id} style={{ background: "#fffdfa", border: "1px solid #eee5dc", borderRadius: 10, padding: 12, boxShadow: "0 8px 24px #4632220b" }}>
            <div style={{ position: "relative", overflow: "hidden", backgroundColor: item.background, backgroundImage: `url(/templates/backgrounds/${item.category === "Baby shower" ? "baby-shower" : item.category.toLowerCase()}.svg), ${patterns[item.category] || patterns.Wedding}`, backgroundSize: "cover, auto", color: item.foreground, minHeight: 290, padding: "22px 18px", display: "flex", flexDirection: "column", justifyContent: "space-around", alignItems: "center", textAlign: "center", border: "5px double #ffffffa8", outline: "1px solid #eadfd4", boxShadow: "inset 0 0 0 1px #ffffff70" }}>
              <span style={{ fontSize: 23, opacity: .8 }}>{motifs[item.category] || motifs.Wedding}</span>
              <span style={{ fontSize: 9, letterSpacing: 2.2, lineHeight: 1.6 }}>{item.tag}</span>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 28, lineHeight: 1.2, textShadow: "0 1px 0 #ffffff55" }}>{item.heading}</span>
              <span style={{ fontFamily: "Georgia,serif", fontSize: 14, fontStyle: "italic" }}>A special day awaits</span>
              <span style={{ fontSize: 10, letterSpacing: 1 }}>21 · 02 · 2027</span>
              <span style={{ fontSize: 22, opacity: .8 }}>{motifs[item.category] || motifs.Wedding}</span>
            </div>
            <div style={{ padding: "14px 3px 3px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}><strong>{item.name}</strong><span style={{ fontSize: 11, color: "#8d3f4b" }}>FREE</span></div>
              <div style={{ color: "#8a8179", fontSize: 12, marginTop: 5 }}>{item.category}</div>
              <p style={{ color: "#71675f", fontSize: 12, lineHeight: 1.5, minHeight: 36 }}>{item.description}</p>
              <a href={`/editor?template=${item.id}`} style={{ display: "block", textAlign: "center", background: "#8d3f4b", color: "white", textDecoration: "none", borderRadius: 5, padding: "11px", fontWeight: 700, fontSize: 13 }}>Customize this design →</a>
            </div>
          </article>)}
        </div>
        {visible.length === 0 && <p style={{ padding: 30, color: "#81776e" }}>No templates match that search. Try another name or occasion.</p>}
      </section>
      <footer style={{ textAlign: "center", padding: 28, color: "#81776e", fontSize: 12 }}>© {new Date().getFullYear()} InviteKart · Free invitation maker</footer>
    </main>
  );
}
