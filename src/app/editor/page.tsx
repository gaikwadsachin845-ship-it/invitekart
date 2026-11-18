"use client";

import { useEffect, useRef, useState } from "react";

type FabricCanvas = {
  add: (...objects: unknown[]) => void;
  remove: (object: unknown) => void;
  getActiveObject: () => unknown;
  discardActiveObject: () => void;
  renderAll: () => void;
  toDataURL: (options: { format: string; multiplier: number }) => string;
  setBackgroundColor: (color: string, callback?: () => void) => void;
  dispose: () => void;
};

export default function EditorPage() {
  const elementRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<FabricCanvas | null>(null);
  const [ready, setReady] = useState(false);
  const [background, setBackground] = useState("#f5e9df");
  const [textColor, setTextColor] = useState("#754c47");
  const [status, setStatus] = useState("Your design is ready to edit");

  useEffect(() => {
    let active = true;
    let instance: FabricCanvas | null = null;

    async function setup() {
      const presets: Record<string, { background: string; foreground: string; heading: string; tag: string }> = {
        "blush-wedding": { background: "#f2e4df", foreground: "#8a4b50", heading: "Together Forever", tag: "A CELEBRATION OF LOVE" },
        "royal-wedding": { background: "#eee4cf", foreground: "#8a6a34", heading: "शुभ विवाह", tag: "आप सादर आमंत्रित हैं" },
        "garden-birthday": { background: "#e9eadc", foreground: "#52664e", heading: "Let’s Celebrate!", tag: "YOU’RE INVITED TO A BIRTHDAY" },
        "confetti-birthday": { background: "#f8e8d2", foreground: "#a65d3b", heading: "Make a Wish!", tag: "BIRTHDAY PARTY" },
        "minimal-engagement": { background: "#e5e8ed", foreground: "#53647a", heading: "The Beginning", tag: "JOIN OUR ENGAGEMENT" },
        "floral-baby": { background: "#f5e7e8", foreground: "#a45e76", heading: "A Little One Is On The Way", tag: "BABY SHOWER" },
        "housewarming": { background: "#eee6d9", foreground: "#78634b", heading: "Home Sweet Home", tag: "PLEASE JOIN OUR HOUSEWARMING" },
        "diwali": { background: "#f5e1c5", foreground: "#9a4d20", heading: "शुभ दीपावली", tag: "HAPPY DIWALI" },
      };
      const chosen = presets[new URLSearchParams(window.location.search).get("template") || ""];
      const canvasBackground = chosen?.background || background;
      const canvasText = chosen?.foreground || textColor;
      if (chosen) { setBackground(chosen.background); setTextColor(chosen.foreground); }
      const fabric = await import("fabric");
      if (!active || !elementRef.current) return;
      instance = new fabric.Canvas(elementRef.current, {
        width: 420,
        height: 560,
        backgroundColor: canvasBackground,
        preserveObjectStacking: true,
        selection: true,
      }) as unknown as FabricCanvas;
      canvasRef.current = instance;

      const frame = new fabric.Rect({
        left: 22, top: 22, width: 376, height: 516,
        fill: "transparent", stroke: "#b78e70", strokeWidth: 1,
        selectable: false, evented: false,
      });
      const ornament = new fabric.Text(chosen?.tag || "✦   ❧   ✦", {
        left: 210, top: 105, originX: "center", fontSize: chosen ? 13 : 26,
        fill: canvasText, selectable: false, evented: false,
      });
      const heading = new fabric.Textbox(chosen?.heading || "You’re Invited", {
        left: 210, top: 175, originX: "center", width: 330,
        textAlign: "center", fontFamily: "Georgia", fontSize: 38,
        fill: canvasText, fontWeight: "bold",
      });
      const details = new fabric.Textbox("Together with our families\nwe invite you to celebrate\nour special day", {
        left: 210, top: 265, originX: "center", width: 320,
        textAlign: "center", fontFamily: "Georgia", fontSize: 19,
        lineHeight: 1.5, fill: canvasText,
      });
      const footer = new fabric.Textbox("21 February 2027  ·  6:30 PM\nThe Grand Celebration, Pune", {
        left: 210, top: 405, originX: "center", width: 330,
        textAlign: "center", fontFamily: "Arial", fontSize: 15,
        lineHeight: 1.6, fill: canvasText,
      });
      instance.add(frame, ornament, heading, details, footer);
      instance.renderAll();
      setReady(true);
    }

    setup().catch(() => setStatus("The editor could not be loaded. Please refresh the page."));
    return () => {
      active = false;
      instance?.dispose();
      canvasRef.current = null;
    };
  }, []);

  function addText() {
    if (!canvasRef.current) return;
    import("fabric").then(({ Textbox }) => {
      const text = new Textbox("Edit this text", {
        left: 75, top: 470, width: 270, fontSize: 22,
        fill: textColor, fontFamily: "Georgia",
        textAlign: "center",
      });
      canvasRef.current?.add(text);
      setStatus("Text added — select it to move or resize");
    });
  }

  function addShape() {
    if (!canvasRef.current) return;
    import("fabric").then(({ Rect }) => {
      canvasRef.current?.add(new Rect({
        left: 130, top: 330, width: 150, height: 70,
        fill: "transparent", stroke: textColor, strokeWidth: 2,
        rx: 8, ry: 8,
      }));
      setStatus("Decorative frame added");
    });
  }

  async function addImage(file?: File) {
    if (!file || !canvasRef.current) return;
    const url = URL.createObjectURL(file);
    try {
      const { FabricImage } = await import("fabric");
      const image = await FabricImage.fromURL(url);
      const maxSide = 180;
      const scale = Math.min(maxSide / (image.width || maxSide), maxSide / (image.height || maxSide), 1);
      image.set({ left: 120, top: 180, scaleX: scale, scaleY: scale });
      canvasRef.current?.add(image);
      setStatus("Photo added — drag the corners to resize");
    } catch {
      setStatus("This image could not be added");
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  function deleteSelected() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const selected = canvas.getActiveObject();
    if (!selected) {
      setStatus("Select an item on the invitation first");
      return;
    }
    canvas.remove(selected);
    canvas.discardActiveObject();
    canvas.renderAll();
    setStatus("Selected item removed");
  }

  function changeBackground(color: string) {
    setBackground(color);
    canvasRef.current?.setBackgroundColor(color, () => canvasRef.current?.renderAll());
  }

  function changeTextColor(color: string) {
    setTextColor(color);
    const canvas = canvasRef.current;
    const selected = canvas?.getActiveObject() as { set?: (value: object) => void } | undefined;
    selected?.set?.({ fill: color });
    canvas?.renderAll();
  }

  function downloadPng() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.discardActiveObject();
    canvas.renderAll();
    const link = document.createElement("a");
    link.download = "my-invitekart-invitation.png";
    link.href = canvas.toDataURL({ format: "png", multiplier: 2 });
    link.click();
    setStatus("PNG downloaded successfully");
  }

  return (
    <main style={{ minHeight: "100vh", background: "#faf7f2", color: "#302923", fontFamily: "Arial, sans-serif" }}>
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 5vw", background: "#fffdfa", borderBottom: "1px solid #eadfd4" }}>
        <a href="/" style={{ color: "#302923", textDecoration: "none", fontFamily: "Georgia, serif", fontSize: 25, fontWeight: 700 }}>InviteKart<span style={{ color: "#8d3f4b" }}>.</span></a>
        <div style={{ fontSize: 13, color: "#81776e" }}>Invitation Studio</div>
        <button onClick={downloadPng} disabled={!ready} style={primaryButton}>Download PNG ↓</button>
      </header>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 20px" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ color: "#8d3f4b", letterSpacing: 2, fontSize: 11, fontWeight: 700 }}>DESIGN YOUR MOMENT</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 34, margin: "8px 0" }}>Advanced invitation editor</h1>
          <p style={{ color: "#81776e", margin: 0 }}>Select any text or object on the invitation to move, resize, rotate or edit it.</p>
        </div>

        <div className="ik-editor-layout" style={{ display: "grid", gridTemplateColumns: "250px minmax(0, 1fr) 250px", gap: 22, alignItems: "start" }}>
          <aside style={panelStyle}>
            <h3 style={panelHeading}>Add elements</h3>
            <button style={toolButton} onClick={addText}>＋ Add text</button>
            <button style={toolButton} onClick={addShape}>▢ Add decorative frame</button>
            <label style={{ ...toolButton, display: "block", textAlign: "center", cursor: "pointer" }}>
              ＋ Upload photo
              <input type="file" accept="image/*" hidden onChange={e => addImage(e.target.files?.[0])} />
            </label>
            <button style={{ ...toolButton, color: "#9a3434" }} onClick={deleteSelected}>⌫ Delete selected</button>
            <p style={{ fontSize: 12, color: "#81776e", lineHeight: 1.6 }}>Tip: Click an item on the card. Drag it to reposition, or use its corner handles to resize and rotate.</p>
          </aside>

          <section style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div style={{ width: "100%", overflowX: "auto", display: "flex", justifyContent: "center", padding: 12, background: "#eee7df", borderRadius: 8 }}>
              <div style={{ background: "white", boxShadow: "0 12px 35px #33241c20", lineHeight: 0 }}>
                <canvas ref={elementRef} />
              </div>
            </div>
            <div role="status" style={{ fontSize: 12, color: "#6e655d", minHeight: 18 }}>{ready ? status : "Loading editor…"}</div>
          </section>

          <aside style={panelStyle}>
            <h3 style={panelHeading}>Design settings</h3>
            <label style={fieldLabel}>BACKGROUND COLOR</label>
            <input aria-label="Background color" type="color" value={background} onChange={e => changeBackground(e.target.value)} style={colorInput} />
            <label style={fieldLabel}>TEXT / OBJECT COLOR</label>
            <input aria-label="Text color" type="color" value={textColor} onChange={e => changeTextColor(e.target.value)} style={colorInput} />
            <div style={{ borderTop: "1px solid #eee5dc", margin: "18px 0" }} />
            <h3 style={panelHeading}>Coming next</h3>
            <ul style={{ paddingLeft: 18, color: "#81776e", fontSize: 12, lineHeight: 1.9 }}>
              <li>Template gallery inside editor</li>
              <li>Undo and redo history</li>
              <li>More fonts and stickers</li>
              <li>Save and share invitations</li>
              <li>PDF export</li>
            </ul>
          </aside>
        </div>
      </section>

      <style>{`@media(max-width:900px){.ik-editor-layout{grid-template-columns:1fr!important}.ik-editor-layout aside{width:100%}} canvas{max-width:100%;height:auto!important}`}</style>
    </main>
  );
}

const primaryButton: React.CSSProperties = { border: 0, background: "#8d3f4b", color: "white", padding: "12px 17px", borderRadius: 4, fontWeight: 700, cursor: "pointer" };
const panelStyle: React.CSSProperties = { background: "#fffdfa", border: "1px solid #eee5dc", borderRadius: 7, padding: 18 };
const panelHeading: React.CSSProperties = { fontFamily: "Georgia, serif", fontSize: 18, margin: "0 0 15px" };
const toolButton: React.CSSProperties = { width: "100%", display: "block", margin: "9px 0", padding: "11px 12px", textAlign: "left", border: "1px solid #e8ded4", background: "#fff", borderRadius: 4, color: "#403832", cursor: "pointer", fontSize: 13 };
const fieldLabel: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#6e655d", margin: "13px 0 7px" };
const colorInput: React.CSSProperties = { width: "100%", height: 42, border: "1px solid #e8ded4", background: "white", padding: 4, borderRadius: 4 };
