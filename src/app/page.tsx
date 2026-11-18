"use client";

import { useEffect, useMemo, useState } from "react";
import { languages, LanguageCode } from "@/lib/i18n";

type Template = { id:string; slug:string; title:string; description:string|null; occasion:string; language:string; previewUrl:string; isFree:boolean };
const occasions = [
  { name:"Wedding", icon:"💍", text:"Wedding invitations" },
  { name:"Birthday", icon:"🎂", text:"Birthday celebrations" },
  { name:"Engagement", icon:"💐", text:"Engagement ceremonies" },
  { name:"Baby shower", icon:"🍼", text:"Baby shower invites" },
  { name:"Housewarming", icon:"🏡", text:"Housewarming & Griha Pravesh" },
  { name:"Puja", icon:"🪔", text:"Puja & religious events" },
  { name:"Naming ceremony", icon:"🌼", text:"Naming ceremony" },
  { name:"Anniversary", icon:"🥂", text:"Anniversary celebrations" },
  { name:"Graduation", icon:"🎓", text:"Graduation parties" },
  { name:"Corporate", icon:"✉️", text:"Business events" },
  { name:"Festival", icon:"🎉", text:"Festivals & get-togethers" },
];
const categoryValue:Record<string,string> = { Wedding:"WEDDING", Birthday:"BIRTHDAY", Engagement:"ENGAGEMENT", "Baby shower":"BABY_SHOWER", Housewarming:"HOUSEWARMING", Puja:"OTHER", "Naming ceremony":"NAMING_CEREMONY", Anniversary:"OTHER", Graduation:"OTHER", Corporate:"OTHER", Festival:"OTHER" };
export default function Home() {
  const [templates,setTemplates]=useState<Template[]>([]);
  const [search,setSearch]=useState("");
  const [language,setLanguage]=useState<LanguageCode>("en");
  const [active,setActive]=useState("All");
  useEffect(()=>{fetch("/api/templates?language="+language).then(r=>r.ok?r.json():{templates:[]}).then(d=>setTemplates(d.templates||[])).catch(()=>setTemplates([]));},[language]);
  const filtered=useMemo(()=>templates.filter(t=>(active==="All"||t.occasion===categoryValue[active])&&(t.title.toLowerCase().includes(search.toLowerCase())||(t.description||"").toLowerCase().includes(search.toLowerCase()))),[templates,active,search]);
  return <main>
    <div className="top">MADE WITH LOVE IN INDIA · FREE DIGITAL INVITATIONS</div>
    <nav className="nav"><a className="brand" href="/">InviteKart<span>.</span></a><div className="navlinks"><a href="#occasions">Occasions</a><a href="/templates">Templates</a><a href="/editor">Invitation editor</a></div><div className="nav-actions"><select aria-label="Choose language" value={language} onChange={e=>setLanguage(e.target.value as LanguageCode)}>{languages.map(l=><option key={l.code} value={l.code}>{l.label}</option>)}</select><a className="btn" href="/templates">Create invitation ↗</a></div></nav>
    <header className="home-hero"><div className="hero-copy"><div className="eyebrow">YOUR MOMENT. YOUR INVITATION.</div><h1>Beautiful invitations for every <em>little big</em> moment.</h1><p>Make your own wedding card, birthday invite, puja patrika and more. Pick a design, add your details, and share it with everyone you love.</p><div className="hero-actions"><a className="btn" href="#occasion-browser">Explore invitation cards <span>→</span></a><a className="text-link" href="/editor">Open invitation maker</a></div><div className="hero-trust"><span>✦ Easy to personalize</span><span>✦ Made for Indian celebrations</span><span>✦ Share digitally</span></div></div>
      <div className="hero-art" aria-label="Decorative invitation card preview"><div className="hero-flower">✿</div><div className="hero-invite"><small>WITH THE BLESSINGS OF OUR FAMILIES</small><span className="hero-ornament">❧ ✧ ❧</span><strong>शुभ विवाह</strong><i>Save the Date</i><b>RIYA & ARJUN</b><span>21 · 02 · 2027</span><small>YOU ARE CORDIALLY INVITED</small></div><div className="hero-stamp">MADE<br/>WITH ♥</div></div>
    </header>
    <section className="steps-strip"><div><span>01</span><b>Choose a design</b><small>Find a style you love</small></div><div><span>02</span><b>Add your details</b><small>Make it personal</small></div><div><span>03</span><b>Preview & download</b><small>Ready to share</small></div></section>
    <section className="home-section" id="occasion-browser"><div className="section-heading"><div><div className="eyebrow">FIND THE RIGHT INVITE</div><h2>What are you celebrating?</h2><p>From wedding ceremonies to everyday celebrations, start with an occasion.</p></div><a className="text-link" href="/templates">Browse all templates →</a></div>
      <div className="occasion-grid">{occasions.map(o=><a href={"/templates?occasion="+encodeURIComponent(categoryValue[o.name]||"OTHER")} className="occasion-tile" key={o.name}><span>{o.icon}</span><div><b>{o.name}</b><small>{o.text}</small></div><i>↗</i></a>)}</div>
    </section>
    <section className="featured-section" id="occasions"><div className="section-heading"><div><div className="eyebrow">THE INVITEKART COLLECTION</div><h2>Find a design that feels like you</h2><p>Explore our latest invitation designs, ready for your personal touch.</p></div><a className="text-link" href="/templates">View all designs →</a></div>
      <div className="template-tools"><div className="search-box"><span>⌕</span><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search invitation designs..." aria-label="Search invitation designs"/></div><span className="template-count">{filtered.length} designs</span></div>
      <div className="home-template-grid">{filtered.slice(0,8).map(t=><a className="home-template-card" href={"/editor?template="+encodeURIComponent(t.slug||t.id)} key={t.id}><div className="home-template-image"><img src={t.previewUrl} alt={t.title}/><span>{t.isFree?"FREE":"PREMIUM"}</span></div><b>{t.title}</b><small>{t.occasion.replaceAll("_"," ")}</small></a>)}</div>
      {filtered.length===0&&<div className="empty-templates"><div>✧</div><h3>Fresh designs are on their way</h3><p>Our new collection is being prepared. Check back soon, or create a custom invitation in the editor.</p><a className="btn" href="/editor">Open invitation maker</a></div>}
    </section>
    <section className="language-band"><div><div className="eyebrow">SAY IT IN YOUR LANGUAGE</div><h2>Your words. Your culture. Your celebration.</h2><p>Create invitations in English, Hindi, Marathi, Kannada, Tamil and Telugu.</p></div><div className="language-chips">{languages.map(l=><button key={l.code} onClick={()=>{setLanguage(l.code);document.getElementById("occasions")?.scrollIntoView({behavior:"smooth"});}}>{l.label}</button>)}</div></section>
    <section className="closing-cta"><div className="eyebrow">LET THE CELEBRATION BEGIN</div><h2>Your perfect invitation is just a few clicks away.</h2><p>Choose a design, add the details, and send a little happiness.</p><a className="btn" href="/templates">Create your invitation for free →</a></section>
    <footer className="home-footer"><a className="brand" href="/">InviteKart<span>.</span></a><p>Thoughtful digital invitations for India's beautiful celebrations.</p><div><a href="/templates">Templates</a><a href="/editor">Invitation maker</a><a href="/admin/login">Admin</a></div><small>© {new Date().getFullYear()} InviteKart. All rights reserved.</small></footer>
  </main>;
}
