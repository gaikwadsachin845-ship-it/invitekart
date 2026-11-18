"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { weddingTemplates } from "@/lib/wedding-templates";

type FabricObject = {
  type?: string;
  text?: string;
  fill?: string;
  set?: (value: Record<string, unknown>) => void;
  setCoords?: () => void;
  initDimensions?: () => void;
};
type FabricCanvas = {
  add: (...objects: unknown[]) => void;
  setActiveObject: (object: unknown) => void;
  remove: (object: unknown) => void;
  getActiveObject: () => FabricObject | undefined;
  discardActiveObject: () => void;
  renderAll: () => void;
  toDataURL: (options: { format: string; multiplier: number }) => string;
  setBackgroundColor: (color: string, callback?: () => void) => void;
  dispose: () => void;
  toJSON: () => Record<string, unknown>;
  on: (event: string, handler: () => void) => void;
  off: (event: string, handler: () => void) => void;
};

export default function EditorPage() {
  const elementRef = useRef<HTMLCanvasElement | null>(null);
  const canvasRef = useRef<FabricCanvas | null>(null);
  const [ready, setReady] = useState(false);
  const [background, setBackground] = useState("#f5e9df");
  const [textColor, setTextColor] = useState("#754c47");
  const [status, setStatus] = useState("Your design is ready to edit");
  const [fontFamily, setFontFamily] = useState("Georgia");
  const [fontSize, setFontSize] = useState(24);
  const [bold, setBold] = useState(false);
  const [alignment, setAlignment] = useState("center");
  const [selectedText, setSelectedText] = useState("");
  const [shareTitle, setShareTitle] = useState("My InviteKart invitation");
  const [language, setLanguage] = useState("en");
  const [selectedIsText, setSelectedIsText] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const syncSelection = useCallback(() => {
    const selected = canvasRef.current?.getActiveObject();
    const isText = !!selected && ["textbox", "text", "i-text"].includes(selected.type || "");
    setSelectedIsText(isText);
    if (isText && selected) {
      setSelectedText(selected.text || "");
      setTextColor(typeof selected.fill === "string" ? selected.fill : "#754c47");
    } else {
      setSelectedText("");
    }
  }, []);

  useEffect(() => {
    let active = true;
    let instance: FabricCanvas | null = null;

    async function setup() {
      const presets: Record<string, { background: string; foreground: string; heading: string; tag: string; style?: string }> = {};
      const templateId = new URLSearchParams(window.location.search).get("template") || "";
      let chosen = weddingTemplates.find((item) => item.id === templateId) || presets[templateId];
      let customPreviewUrl: string | undefined;
      let customWeddingFields: Array<{ label?: string; text?: string }> = [];
      if (!chosen && templateId) {
        const response = await fetch("/api/templates");
        if (response.ok) {
          const data = await response.json();
          const custom = (data.templates || []).find((item: { id: string }) => item.id === templateId);
          if (custom) {
            const design = custom.designJson || {};
            chosen = { background: design.background || "#f5e9df", foreground: design.foreground || "#754c47", heading: design.heading || custom.title, tag: design.tag || "" };
            customPreviewUrl = custom.previewUrl;
          }
        }
      }
      const canvasBackground = chosen?.background || background;
      const canvasText = chosen?.foreground || textColor;
      if (chosen) { setBackground(chosen.background); setTextColor(chosen.foreground); }
      const fabric = await import("fabric");
      if (!active || !elementRef.current) return;
      instance = new fabric.Canvas(elementRef.current, {
        width: 420, height: 560, backgroundColor: canvasBackground,
        preserveObjectStacking: true, selection: true,
      }) as unknown as FabricCanvas;
      canvasRef.current = instance;

      if (customPreviewUrl) {
        const artwork = await fabric.FabricImage.fromURL(customPreviewUrl);
        artwork.set({
          left: 0, top: 0, scaleX: 420 / (artwork.width || 420),
          scaleY: 560 / (artwork.height || 560), selectable: false, evented: false,
        });
        instance.add(artwork);
      } else {
        const frame = new fabric.Rect({
          left: 22, top: 22, width: 376, height: 516, fill: "transparent",
          stroke: "#b78e70", strokeWidth: 1, selectable: false, evented: false,
        });
        const motif = chosen?.style === "indian" ? "✥   ॐ   ✥" : chosen?.style === "celestial" ? "☾   ✧   ☆" : chosen?.style === "floral" || chosen?.style === "botanical" ? "❀   ❧   ❀" : chosen?.style === "diya" ? "🪔   ✦   🪔" : chosen?.style === "balloons" ? "○   ◌   ○" : chosen?.style === "jungle" || chosen?.style === "woodland" ? "❧   ♧   ❧" : "✦   ❧   ✦";
        const ornament = new fabric.Text(chosen?.tag || motif, {
          left: 210, top: 105, originX: "center", fontSize: chosen ? 13 : 26,
          fill: canvasText, selectable: false, evented: false,
        });
        const heading = new fabric.Textbox(chosen?.heading || "You’re Invited", {
          left: 210, top: 175, originX: "center", width: 330, textAlign: "center",
          fontFamily: "Georgia", fontSize: 38, fill: canvasText, fontWeight: "bold",
        });
        const details = new fabric.Textbox("Together with our families\nwe invite you to celebrate\nour special day", {
          left: 210, top: 265, originX: "center", width: 320, textAlign: "center",
          fontFamily: "Georgia", fontSize: 19, lineHeight: 1.5, fill: canvasText,
        });
        const footer = new fabric.Textbox("21 February 2027  ·  6:30 PM\nThe Grand Celebration, Pune", {
          left: 210, top: 405, originX: "center", width: 330, textAlign: "center",
          fontFamily: "Arial", fontSize: 15, lineHeight: 1.6, fill: canvasText,
        });
        instance.add(frame, ornament, heading, details, footer);
      }
      const selectionEvents = ["selection:created", "selection:updated"];
      selectionEvents.forEach((event) => instance?.on(event, syncSelection));
      instance.on("selection:cleared", syncSelection);
      instance.renderAll();
      setReady(true);
    }

    setup().catch(() => setStatus("The editor could not be loaded. Please refresh the page."));
    return () => {
      active = false;
      instance?.dispose();
      canvasRef.current = null;
    };
  }, [syncSelection]);

  function addText() {
    if (!canvasRef.current) return;
    import("fabric").then(({ Textbox }) => {
      const text = new Textbox("Edit this text", {
        left: 75, top: 470, width: 270, fontSize: 22,
        fill: textColor, fontFamily: "Georgia", textAlign: "center",
      });
      canvasRef.current?.add(text);
      canvasRef.current?.setActiveObject(text);
      canvasRef.current?.renderAll();
      syncSelection();
      setStatus("Text added — use the text editor to personalise it");
    });
  }

  function addShape() {
    if (!canvasRef.current) return;
    import("fabric").then(({ Rect }) => {
      canvasRef.current?.add(new Rect({
        left: 130, top: 330, width: 150, height: 70, fill: "transparent",
        stroke: textColor, strokeWidth: 2, rx: 8, ry: 8,
      }));
      setStatus("Decorative frame added");
    });
  }

  async function addImage(file?: File) {
    if (!file || !canvasRef.current) return;
    if (!file.type.startsWith("image/")) {
      setStatus("Please choose an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setStatus("Please choose an image smaller than 5 MB");
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const { FabricImage } = await import("fabric");
      const image = await FabricImage.fromURL(url);
      const maxSide = 220;
      const scale = Math.min(maxSide / (image.width || maxSide), maxSide / (image.height || maxSide), 1);
      image.set({ left: 100, top: 170, scaleX: scale, scaleY: scale });
      canvasRef.current?.add(image);
      canvasRef.current?.setActiveObject(image);
      canvasRef.current?.renderAll();
      syncSelection();
      setStatus("Photo added — select it and drag the corners to resize");
    } catch {
      setStatus("This image could not be added");
    } finally {
      URL.revokeObjectURL(url);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function deleteSelected() {
    const canvas = canvasRef.current;
    const selected = canvas?.getActiveObject();
    if (!canvas || !selected) {
      setStatus("Select an item on the invitation first");
      return;
    }
    canvas.remove(selected);
    canvas.discardActiveObject();
    canvas.renderAll();
    syncSelection();
    setStatus("Selected item removed");
  }

  function changeBackground(color: string) {
    setBackground(color);
    canvasRef.current?.setBackgroundColor(color, () => canvasRef.current?.renderAll());
  }

  function changeTextColor(color: string) {
    setTextColor(color);
    const selected = canvasRef.current?.getActiveObject();
    selected?.set?.({ fill: color });
    canvasRef.current?.renderAll();
  }

  function updateSelectedText(value: string) {
    setSelectedText(value);
    const canvas = canvasRef.current;
    const selected = canvas?.getActiveObject();
    if (!selected || !["textbox", "text", "i-text"].includes(selected.type || "")) return;
    selected.set?.({ text: value });
    selected.initDimensions?.();
    selected.setCoords?.();
    canvas?.renderAll();
  }

  function changeFontSize(value: number) {
    setFontSize(value);
    const canvas = canvasRef.current;
    const selected = canvas?.getActiveObject();
    if (selected && ["textbox", "text", "i-text"].includes(selected.type || "")) {
      selected.set?.({ fontSize: value });
      selected.initDimensions?.();
      selected.setCoords?.();
      canvas?.renderAll();
    }
  }

  function applyTextSettings() {
    const canvas = canvasRef.current;
    const selected = canvas?.getActiveObject();
    if (!selected || !["textbox", "text", "i-text"].includes(selected.type || "")) {
      setStatus("Select a text item on the invitation first");
      return;
    }
    selected.set?.({
      fontFamily, fontSize, fontWeight: bold ? "bold" : "normal", textAlign: alignment,
    });
    selected.initDimensions?.();
    selected.setCoords?.();
    canvas?.renderAll();
    setStatus("Text formatting updated");
  }

  async function saveAndShare() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setStatus("Saving your invitation…");
    try {
      const response = await fetch("/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: shareTitle.trim() || "My InviteKart invitation", language, designJson: canvas.toJSON() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save invitation");
      const shareUrl = `${window.location.origin}/invite/${result.shareId}`;
      await navigator.clipboard.writeText(shareUrl);
      setStatus("Saved! Share link copied to your clipboard.");
    } catch {
      setStatus("Could not save or copy the link. Please check your connection and try again.");
    }
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
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "16px 5vw", background: "#fffdfa", borderBottom: "1px solid #eadfd4", flexWrap: "wrap" }}>
        <a href="/" style={{ color: "#302923", textDecoration: "none", fontFamily: "Georgia, serif", fontSize: 25, fontWeight: 700 }}>InviteKart<span style={{ color: "#8d3f4b" }}>.</span></a>
        <div style={{ fontSize: 13, color: "#81776e" }}>Invitation Studio</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}><button onClick={saveAndShare} disabled={!ready} style={secondaryButton}>Save & share ↗</button><button onClick={downloadPng} disabled={!ready} style={primaryButton}>Download PNG ↓</button></div>
      </header>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "30px 20px" }}>
        <div style={{ marginBottom: 22 }}>
          <div style={{ color: "#8d3f4b", letterSpacing: 2, fontSize: 11, fontWeight: 700 }}>DESIGN YOUR MOMENT</div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 34, margin: "8px 0" }}>Personalise your invitation</h1>
          <p style={{ color: "#81776e", margin: 0 }}>Select any text or photo on the card. Edit the wording, change its style, or drag its corners to resize.</p>
        </div>

        <div className="ik-editor-layout" style={{ display: "grid", gridTemplateColumns: "250px minmax(0, 1fr) 270px", gap: 22, alignItems: "start" }}>
          <aside style={panelStyle}>
            <h3 style={panelHeading}>Add elements</h3>
            <button style={toolButton} onClick={addText}>＋ Add text</button>
            <button style={toolButton} onClick={addShape}>▢ Add decorative frame</button>
            <button style={toolButton} onClick={() => fileInputRef.current?.click()}>＋ Upload photo</button>
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" hidden onChange={e => addImage(e.target.files?.[0])} />
            <button style={{ ...toolButton, color: "#9a3434" }} onClick={deleteSelected}>⌫ Delete selected</button>
            <p style={{ fontSize: 12, color: "#81776e", lineHeight: 1.6 }}>Tip: Select an item on the card. Drag it to move, use the corner handles to resize, and use the top handle to rotate.</p>
            <div style={{ borderTop: "1px solid #eee5dc", margin: "18px 0" }} />
            <h3 style={panelHeading}>Share details</h3>
            <label style={fieldLabel}>INVITATION TITLE</label>
            <input value={shareTitle} onChange={e => setShareTitle(e.target.value)} maxLength={100} style={textInput} />
            <label style={fieldLabel}>LANGUAGE</label>
            <select value={language} onChange={e => setLanguage(e.target.value)} style={selectInput}>
              <option value="en">English</option><option value="hi">हिन्दी</option><option value="mr">मराठी</option><option value="kn">ಕನ್ನಡ</option><option value="ta">தமிழ்</option><option value="te">తెలుగు</option>
            </select>
          </aside>

          <section style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, minWidth: 0 }}>
            <div style={{ width: "100%", overflowX: "auto", display: "flex", justifyContent: "center", padding: 12, background: "#eee7df", borderRadius: 8 }}>
              <div style={{ background: "white", boxShadow: "0 12px 35px #33241c20", lineHeight: 0 }}>
                <canvas ref={elementRef} />
              </div>
            </div>
            <div role="status" aria-live="polite" style={{ fontSize: 12, color: "#6e655d", minHeight: 18, textAlign: "center" }}>{ready ? status : "Loading editor…"}</div>
          </section>

          <aside style={panelStyle}>
            <h3 style={panelHeading}>Edit selected item</h3>
            {selectedIsText ? (
              <>
                <label style={fieldLabel}>YOUR TEXT</label>
                <textarea aria-label="Selected invitation text" value={selectedText} onChange={e => updateSelectedText(e.target.value)} rows={5} style={textAreaInput} />
                <p style={{ fontSize: 11, color: "#81776e", lineHeight: 1.5 }}>Changes appear on the card as you type. Add names, event details, date, time and venue here.</p>
              </>
            ) : (
              <p style={{ fontSize: 12, color: "#81776e", lineHeight: 1.6 }}>Select a text item on the card to edit its wording. Select a photo to move, resize or rotate it.</p>
            )}
            <label style={fieldLabel}>BACKGROUND COLOR</label>
            <input aria-label="Background color" type="color" value={background} onChange={e => changeBackground(e.target.value)} style={colorInput} />
            <label style={fieldLabel}>SELECTED TEXT COLOR</label>
            <input aria-label="Text color" type="color" value={textColor} onChange={e => changeTextColor(e.target.value)} style={colorInput} />
            <label style={fieldLabel}>FONT FAMILY</label>
            <select aria-label="Font family" value={fontFamily} onChange={e => setFontFamily(e.target.value)} style={selectInput}>
              <option>Georgia</option><option>Arial</option><option>Times New Roman</option><option>Verdana</option><option>Courier New</option>
            </select>
            <label style={fieldLabel}>FONT SIZE · {fontSize}px</label>
            <input aria-label="Font size" type="range" min="10" max="64" value={fontSize} onChange={e => changeFontSize(Number(e.target.value))} style={{ width: "100%" }} />
            <label style={{ ...toolButton, display: "flex", alignItems: "center", gap: 8 }}>
              <input type="checkbox" checked={bold} onChange={e => setBold(e.target.checked)} /> Bold text
            </label>
            <label style={fieldLabel}>TEXT ALIGNMENT</label>
            <select aria-label="Text alignment" value={alignment} onChange={e => setAlignment(e.target.value)} style={selectInput}>
              <option value="left">Left</option><option value="center">Center</option><option value="right">Right</option>
            </select>
            <button style={toolButton} onClick={applyTextSettings}>Apply text formatting</button>
          </aside>
        </div>
      </section>

      <style>{`@media(max-width:900px){.ik-editor-layout{grid-template-columns:1fr!important}.ik-editor-layout aside{width:100%}} canvas{max-width:100%;height:auto!important}`}</style>
    </main>
  );
}

const secondaryButton: React.CSSProperties = { border: "1px solid #8d3f4b", background: "white", color: "#8d3f4b", padding: "12px 15px", borderRadius: 4, fontWeight: 700, cursor: "pointer" };
const primaryButton: React.CSSProperties = { border: 0, background: "#8d3f4b", color: "white", padding: "12px 17px", borderRadius: 4, fontWeight: 700, cursor: "pointer" };
const panelStyle: React.CSSProperties = { background: "#fffdfa", border: "1px solid #eee5dc", borderRadius: 7, padding: 18 };
const panelHeading: React.CSSProperties = { fontFamily: "Georgia, serif", fontSize: 18, margin: "0 0 15px" };
const toolButton: React.CSSProperties = { width: "100%", display: "block", margin: "9px 0", padding: "11px 12px", textAlign: "left", border: "1px solid #e8ded4", background: "#fff", borderRadius: 4, color: "#403832", cursor: "pointer", fontSize: 13 };
const fieldLabel: React.CSSProperties = { display: "block", fontSize: 11, fontWeight: 700, color: "#6e655d", margin: "13px 0 7px" };
const colorInput: React.CSSProperties = { width: "100%", height: 42, border: "1px solid #e8ded4", background: "white", padding: 4, borderRadius: 4 };
const selectInput: React.CSSProperties = { width: "100%", padding: 10, border: "1px solid #e8ded4", background: "white", borderRadius: 4, color: "#403832" };
const textInput: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: 10, border: "1px solid #e8ded4", background: "white", borderRadius: 4, color: "#403832" };
const textAreaInput: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: 10, border: "1px solid #e8ded4", background: "white", borderRadius: 4, color: "#403832", resize: "vertical", font: "13px Arial, sans-serif" };
