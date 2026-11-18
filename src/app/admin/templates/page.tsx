"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const categories = ["Wedding", "Birthday", "Engagement", "Baby shower", "Housewarming", "Naming ceremony", "Puja", "Anniversary", "Graduation", "Corporate", "Festival"];
type Row = { id: string; title: string; slug: string; description: string | null; occasion: string; language: string; previewUrl: string; status: string; designJson: { category?: string; heading?: string; tag?: string; background?: string; foreground?: string } };
type Draft = { title: string; slug: string; description: string; category: string; language: string; previewUrl: string; heading: string; tag: string; background: string; foreground: string; weddingText: string; status: "DRAFT" | "PUBLISHED" };
const empty: Draft = { title: "", slug: "", description: "", category: "Wedding", language: "en", previewUrl: "", heading: "You’re Invited", tag: "", background: "#f5e9df", foreground: "#754c47", weddingText: "Invitation opening|आपणांस सस्नेह निमंत्रण\nशुभ श्लोक|॥ श्री गणेशाय नमः ॥ वक्रतुंड महाकाय...\nGroom family|चि. [वराचे नाव] सुपुत्र श्री. [वडिलांचे नाव] व सौ. [आईचे नाव]\nBride family|सौ. का. [वधूचे नाव] सुपुत्री श्री. [वडिलांचे नाव] व सौ. [आईचे नाव]\nWedding date and time|[वार], [दिनांक] रोजी [वेळ] वाजता शुभमुहूर्तावर\nVenue heading|❉ विवाह स्थळ ❉\nVenue address|[हॉलचे नाव], [पूर्ण पत्ता]\nHaldi heading|❉ हळदी समारंभ ❉\nHaldi details|[वार], [दिनांक] रोजी [वेळ] वाजता [स्थळ]\nInviter and family|[निमंत्रकांची नावे] व समस्त परिवार\nFooter|आपली उपस्थिती प्रार्थनीय आहे", status: "DRAFT" };
const field: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: 10, border: "1px solid #e5d9ce", borderRadius: 4, background: "white" };
const label: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#6e655d", margin: "12px 0 6px" };

export default function AdminTemplatesPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [draft, setDraft] = useState<Draft>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  async function load() {
    const response = await fetch("/api/admin/templates");
    if (response.status === 401) { router.replace("/admin/login"); return; }
    const result = await response.json(); setItems(result.templates || []); setLoading(false);
  }
  useEffect(() => { void load(); }, []);
  function set<K extends keyof Draft>(key: K, value: Draft[K]) { setDraft(old => ({ ...old, [key]: value })); }
  function slugify(value: string) { return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }
  function chooseImage(file?: File) {
    if (!file) return;
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) { setMessage("Please choose a PNG, JPG or WEBP image."); return; }
    if (file.size > 2 * 1024 * 1024) { setMessage("Image must be 2 MB or smaller."); return; }
    const reader = new FileReader(); reader.onload = () => set("previewUrl", String(reader.result)); reader.readAsDataURL(file);
  }
  function edit(item: Row) {
    const d = item.designJson || {};
    const category = d.category || (item.occasion === "BABY_SHOWER" ? "Baby shower" : item.occasion === "HOUSEWARMING" ? "Housewarming" : item.occasion === "NAMING_CEREMONY" ? "Naming ceremony" : item.occasion === "OTHER" ? "Festival" : item.occasion[0] + item.occasion.slice(1).toLowerCase());
    setDraft({ title: item.title, slug: item.slug, description: item.description || "", category, language: item.language, previewUrl: item.previewUrl, heading: d.heading || item.title, tag: d.tag || "", background: d.background || "#f5e9df", foreground: d.foreground || "#754c47", weddingText: Array.isArray(d.weddingFields) ? d.weddingFields.map((f: { label?: string; text?: string }) => `${f.label || "Section"}|${f.text || ""}`).join("\n") : empty.weddingText, status: item.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT" });
    setEditing(item.id); setMessage(""); window.scrollTo({ top: 0, behavior: "smooth" });
  }
  async function save(event: React.FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      if (!draft.previewUrl) throw new Error("Please upload a template preview image.");
      const response = await fetch(editing ? `/api/admin/templates/${editing}` : "/api/admin/templates", { method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(draft) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Could not save template");
      setDraft(empty); setEditing(null); setMessage("Template saved successfully."); await load();
    } catch (err) { setMessage(err instanceof Error ? err.message : "Could not save template"); }
    finally { setBusy(false); }
  }
  async function remove(item: Row) {
    if (!window.confirm(`Delete “${item.title}”? This cannot be undone.`)) return;
    const response = await fetch(`/api/admin/templates/${item.id}`, { method: "DELETE" });
    if (response.ok) { setMessage("Template deleted."); await load(); } else setMessage("Could not delete template.");
  }
  async function setVisibility(item: Row) {
    const visibility = item.status === "PUBLISHED" ? "PRIVATE" : "PUBLIC";
    const response = await fetch(`/api/admin/templates/${item.id}/visibility`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visibility }) });
    if (response.ok) { setMessage(`${item.title} is now ${visibility.toLowerCase()}.`); await load(); }
    else setMessage("Could not change template visibility.");
  }
  async function clearAll() {
    if (!window.confirm("Delete EVERY existing template? This permanently removes all admin-uploaded templates from the database.")) return;
    setBusy(true);
    try {
      const response = await fetch("/api/admin/templates", { method: "DELETE" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not delete templates.");
      setItems([]); setEditing(null); setDraft(empty); setMessage(`Deleted ${result.deleted} existing templates.`);
    } catch (err) { setMessage(err instanceof Error ? err.message : "Could not delete templates."); }
    finally { setBusy(false); }
  }
  async function logout() { await fetch("/api/admin/logout", { method: "POST" }); router.replace("/admin/login"); router.refresh(); }
  return <main style={{ minHeight: "100vh", background: "#faf7f2", color: "#302923", fontFamily: "Arial,sans-serif" }}>
    <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 5vw", background: "#fffdfa", borderBottom: "1px solid #eadfd4" }}>
      <a href="/" style={{ color: "#302923", textDecoration: "none", fontFamily: "Georgia,serif", fontSize: 24, fontWeight: 700 }}>InviteKart.</a>
      <button onClick={logout} style={{ padding: "9px 14px", background: "white", border: "1px solid #e5d9ce", borderRadius: 4, cursor: "pointer" }}>Sign out</button>
    </header>
    <section style={{ maxWidth: 1100, margin: "0 auto", padding: "34px 20px" }}>
      <p style={{ color: "#8d3f4b", fontSize: 11, letterSpacing: 2, fontWeight: 700 }}>PRIVATE ADMIN AREA</p>
      <h1 style={{ fontFamily: "Georgia,serif", fontSize: 36, margin: "6px 0" }}>Manage templates</h1>
      <p style={{ color: "#81776e", lineHeight: 1.6 }}>Upload your own invitation artwork, choose its category, and publish it when ready. Drafts are visible only here.</p>
      <form onSubmit={save} style={{ background: "#fffdfa", border: "1px solid #eee5dc", borderRadius: 8, padding: 22, marginTop: 24 }}>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: 22, marginTop: 0 }}>{editing ? "Edit template" : "Add a new template"}</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "0 18px" }}>
          <div><label style={label}>TEMPLATE NAME</label><input required value={draft.title} onChange={e => { const title = e.target.value; setDraft(old => ({ ...old, title, slug: editing ? old.slug : slugify(title), heading: old.heading === "You’re Invited" ? title : old.heading })); }} style={field} /></div>
          <div><label style={label}>URL SLUG</label><input required value={draft.slug} onChange={e => set("slug", slugify(e.target.value))} style={field} /></div>
          <div><label style={label}>CATEGORY</label><select value={draft.category} onChange={e => set("category", e.target.value)} style={field}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
          <div><label style={label}>LANGUAGE</label><select value={draft.language} onChange={e => set("language", e.target.value)} style={field}><option value="en">English</option><option value="hi">Hindi</option><option value="mr">Marathi</option><option value="kn">Kannada</option><option value="ta">Tamil</option><option value="te">Telugu</option></select></div>
          <div><label style={label}>HEADING SHOWN IN EDITOR</label><input required value={draft.heading} onChange={e => set("heading", e.target.value)} style={field} /></div>
          <div><label style={label}>SMALL TAGLINE</label><input value={draft.tag} onChange={e => set("tag", e.target.value)} style={field} /></div>
          <div><label style={label}>BACKGROUND COLOUR</label><input type="color" value={draft.background} onChange={e => set("background", e.target.value)} style={{ ...field, height: 42, padding: 3 }} /></div>
          <div><label style={label}>TEXT COLOUR</label><input type="color" value={draft.foreground} onChange={e => set("foreground", e.target.value)} style={{ ...field, height: 42, padding: 3 }} /></div>
        </div>
        <label style={label}>DESCRIPTION</label><textarea value={draft.description} onChange={e => set("description", e.target.value)} rows={2} style={field} />\n        {draft.category === "Wedding" && <><label style={label}>WEDDING INVITATION SECTIONS (ONE PER LINE: LABEL|TEXT)</label><textarea value={draft.weddingText} onChange={e => set("weddingText", e.target.value)} rows={12} style={{ ...field, fontFamily: "Arial,sans-serif", lineHeight: 1.6 }} /><small style={{ color: "#81776e" }}>Add or remove sections as needed. Each section becomes its own editable text item in the invitation editor. Use placeholders such as [Bride name], [Groom name], [Date], [Time] and [Venue].</small></>}
        <label style={label}>TEMPLATE IMAGE (PNG / JPG / WEBP · MAX 2 MB)</label><input type="file" accept="image/png,image/jpeg,image/webp" onChange={e => chooseImage(e.target.files?.[0])} style={{ ...field, padding: 8 }} />
        {draft.previewUrl && <img src={draft.previewUrl} alt="Template preview" style={{ display: "block", maxWidth: 180, maxHeight: 240, objectFit: "contain", marginTop: 12, border: "1px solid #eee5dc" }} />}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 18, alignItems: "center" }}>
          <label style={{ fontSize: 13 }}><input type="checkbox" checked={draft.status === "PUBLISHED"} onChange={e => set("status", e.target.checked ? "PUBLISHED" : "DRAFT")} /> Make public immediately (otherwise keep private)</label>
          <button disabled={busy} style={{ padding: "12px 20px", border: 0, borderRadius: 4, background: "#8d3f4b", color: "white", fontWeight: 700, cursor: "pointer" }}>{busy ? "Saving…" : editing ? "Save changes" : "Add template"}</button>
          {editing && <button type="button" onClick={() => { setEditing(null); setDraft(empty); }} style={{ padding: "12px 16px", border: "1px solid #e5d9ce", background: "white", borderRadius: 4, cursor: "pointer" }}>Cancel edit</button>}
        </div>
        {message && <p role="status" style={{ color: "#6b5146", fontSize: 13, marginBottom: 0 }}>{message}</p>}
      </form>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 14, marginTop: 34, flexWrap: "wrap" }}><h2 style={{ fontFamily: "Georgia,serif", fontSize: 24, margin: 0 }}>Your templates ({items.length})</h2><button type="button" disabled={busy || items.length === 0} onClick={() => void clearAll()} style={{ padding: "10px 14px", border: "1px solid #b94b50", borderRadius: 4, background: "white", color: "#a12f36", cursor: "pointer" }}>Delete all existing templates</button></div>
      {loading ? <p>Loading templates…</p> : <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
        {items.map(item => <article key={item.id} style={{ background: "#fffdfa", border: "1px solid #eee5dc", borderRadius: 7, padding: 12 }}>
          <img src={item.previewUrl} alt={item.title} style={{ width: "100%", height: 180, objectFit: "contain", background: "#f2eee8" }} />
          <strong style={{ display: "block", marginTop: 10 }}>{item.title}</strong><small style={{ color: "#81776e" }}>{item.occasion.replaceAll("_", " ")} · {item.status === "PUBLISHED" ? "PUBLIC" : "PRIVATE"}</small>
          <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}><button onClick={() => edit(item)} style={smallButton}>Edit</button><button onClick={() => void setVisibility(item)} style={smallButton}>{item.status === "PUBLISHED" ? "Make private" : "Make public"}</button><button onClick={() => void remove(item)} style={{ ...smallButton, color: "#a12f36" }}>Delete</button></div>
        </article>)}
        {items.length === 0 && <p>No custom templates yet. Add your first one above.</p>}
      </div>}
    </section>
  </main>;
}
const smallButton: React.CSSProperties = { flex: 1, padding: 9, border: "1px solid #e5d9ce", borderRadius: 4, background: "white", cursor: "pointer" };
