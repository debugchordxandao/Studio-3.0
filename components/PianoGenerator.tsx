import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Download,
  Layers,
  Settings2,
  Keyboard,
  FileText,
  Plus,
  X,
  Trash2,
  Image as ImageIcon,
} from "lucide-react";
import { DownloadMenu } from "./DownloadMenu";
import {
  PIANO_CHORDS,
  PIANO_CONFIG,
  PIANO_KEY_DATA,
  BLACK_KEYS_INDICES,
  BLACK_KEY_NAMES,
  STARKIDS_LOGO_URL,
} from "../constants";
import { jsPDF } from "jspdf";

interface ChordStripItem {
  id: string;
  name: string;
  src: string;
}

export const PianoGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedChord, setSelectedChord] = useState<string>("");
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [chordStrip, setChordStrip] = useState<ChordStripItem[]>([]);

  // Load logo once
  useEffect(() => {
    const img = new Image();
    img.src = STARKIDS_LOGO_URL;
    img.onload = () => {
      setLogoImage(img);
      setIsLoaded(true);
    };
    img.onerror = () => {
      console.warn("Could not load logo from:", STARKIDS_LOGO_URL);
      setIsLoaded(true);
    };
  }, []);

  // Helper for rounded rectangles
  const roundRect = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  };

  const drawPiano = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const {
      width: W,
      height: H,
      paddingX,
      pianoHeight,
      keysCount,
      blackKeyHeight,
      capsuleHeight,
      blackKeyWidthRatio,
      capsuleWidthRatio,
    } = PIANO_CONFIG;

    const keyW = (W - paddingX * 2) / keysCount;
    const startX = paddingX;
    const startY = 500;

    // 1. Clear
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);

    const activeIndices = selectedChord ? PIANO_CHORDS[selectedChord] : [];

    // 2. Draw White Keys
    ctx.strokeStyle = "#222";
    ctx.lineWidth = 6;
    ctx.lineJoin = "round";

    for (let i = 0; i < keysCount; i++) {
      const kx = startX + i * keyW;
      const isActive = activeIndices.includes(i);
      const colorData = PIANO_KEY_DATA[i];

      if (isActive) {
        // Full Color
        ctx.fillStyle = colorData.color;
        ctx.fillRect(kx, startY, keyW, pianoHeight);

        // 3D Gloss Overlay
        const overlayGrad = ctx.createLinearGradient(
          kx,
          startY,
          kx + keyW,
          startY,
        );
        overlayGrad.addColorStop(0, "rgba(0,0,0,0.2)");
        overlayGrad.addColorStop(0.1, "rgba(255,255,255,0.2)");
        overlayGrad.addColorStop(0.5, "rgba(255,255,255,0.0)");
        overlayGrad.addColorStop(0.9, "rgba(255,255,255,0.2)");
        overlayGrad.addColorStop(1, "rgba(0,0,0,0.2)");
        ctx.fillStyle = overlayGrad;
        ctx.fillRect(kx, startY, keyW, pianoHeight);
      } else {
        // White
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(kx, startY, keyW, pianoHeight);
      }
      ctx.strokeRect(kx, startY, keyW, pianoHeight);
    }

    // 3. Draw Black Keys
    const bkW = keyW * blackKeyWidthRatio;
    const bkH = blackKeyHeight;

    BLACK_KEYS_INDICES.forEach((idx) => {
      const bx = startX + (idx + 1) * keyW - bkW / 2;
      const isActive = activeIndices.includes(100 + idx);
      const colorData = PIANO_KEY_DATA[idx];

      // Shadow
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(bx + 15, startY + 10, bkW, bkH);

      if (isActive) {
        // Color Filled
        ctx.fillStyle = colorData.color;
        ctx.fillRect(bx, startY, bkW, bkH);

        // Shine
        const grad = ctx.createLinearGradient(bx, startY, bx + bkW, startY);
        grad.addColorStop(0, "rgba(0,0,0,0.3)");
        grad.addColorStop(0.2, "rgba(255,255,255,0.3)");
        grad.addColorStop(0.8, "rgba(255,255,255,0.3)");
        grad.addColorStop(1, "rgba(0,0,0,0.3)");
        ctx.fillStyle = grad;
        ctx.fillRect(bx, startY, bkW, bkH);

        // Bottom Bevel
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(bx, startY + bkH - 15, bkW, 15);
      } else {
        // Standard Black Key
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(bx, startY, bkW, bkH);

        // Shine
        const grad = ctx.createLinearGradient(bx, startY, bx + bkW, startY);
        grad.addColorStop(0, "#333");
        grad.addColorStop(0.2, "#111");
        grad.addColorStop(0.8, "#111");
        grad.addColorStop(1, "#333");
        ctx.fillStyle = grad;
        ctx.fillRect(bx + 5, startY, bkW - 10, bkH - 15);

        // Bottom Bevel
        ctx.fillStyle = "#000";
        ctx.fillRect(bx, startY + bkH - 15, bkW, 15);
      }
    });

    // Final Border
    ctx.strokeRect(startX, startY, keyW * keysCount, pianoHeight);

    // 4. Draw Capsules (Labels)
    const drawCapsule = (
      cx: number,
      cy: number,
      w: number,
      h: number,
      color: string,
      text: string | string[],
    ) => {
      const x = cx - w / 2;
      const y = cy - h / 2;
      const radius = w / 2;

      // Shadow
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 4;

      // White Border (Outer capsule)
      ctx.fillStyle = "#FFF";
      roundRect(ctx, x - 6, y - 6, w + 12, h + 12, radius + 6);
      ctx.fill();

      // Inner Color
      ctx.fillStyle = color;
      roundRect(ctx, x, y, w, h, radius);
      ctx.fill();

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Text (Black)
      ctx.fillStyle = "#000";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (Array.isArray(text)) {
        const fontSize = Math.floor(w * 0.35);
        ctx.font = `bold ${fontSize}px 'Lobster'`;
        ctx.fillText(text[0], cx, cy - fontSize * 0.6);
        ctx.fillText(text[1], cx, cy + fontSize * 0.6);
      } else {
        const fontSize = Math.floor(w * 0.5);
        ctx.font = `bold ${fontSize}px 'Lobster'`;
        ctx.fillText(text as string, cx, cy);
      }
    };

    // Y position for capsules (below piano)
    const labelsY = startY + pianoHeight + 200;

    // 4.1 White Key Capsules
    activeIndices.forEach((idx) => {
      if (idx < 100) {
        const kx = startX + idx * keyW;
        const colorData = PIANO_KEY_DATA[idx];
        const capW = keyW * capsuleWidthRatio;
        const capX = kx + keyW / 2;

        drawCapsule(
          capX,
          labelsY,
          capW,
          capsuleHeight,
          colorData.color,
          colorData.note,
        );
      }
    });

    // 4.2 Black Key Capsules
    activeIndices.forEach((idx) => {
      if (idx >= 100) {
        const baseIdx = idx - 100;
        const colorData = PIANO_KEY_DATA[baseIdx];
        const names = BLACK_KEY_NAMES[baseIdx];

        // Center X of the black key
        const bx = startX + (baseIdx + 1) * keyW;

        const capW = keyW * capsuleWidthRatio * 0.9;

        if (names) {
          drawCapsule(bx, labelsY, capW, capsuleHeight, colorData.color, names);
        }
      }
    });

    // 5. Logo
    if (logoImage) {
      const lh = 350;
      const lw = (logoImage.width / logoImage.height) * lh;
      ctx.drawImage(logoImage, W / 2 - lw / 2, 20, lw, lh);
    } else {
      // Text fallback
      ctx.fillStyle = "#FFD700";
      ctx.shadowColor = "rgba(0,0,0,0.3)";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 3;

      ctx.strokeStyle = "#f57f17";
      ctx.lineWidth = 4;

      ctx.font = "120px 'Lobster'";
      ctx.textAlign = "center";

      ctx.strokeText("Starkids Music", W / 2, 220);
      ctx.fillText("Starkids Music", W / 2, 220);

      ctx.shadowColor = "transparent";
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.lineWidth = 1;
    }

    // Chord Name
    if (selectedChord && selectedChord !== "Piano Limpo") {
      ctx.save();
      ctx.textAlign = "right";
      ctx.font = "60px 'Poppins'";
      ctx.fillStyle = "#90a4ae";
      ctx.fillText(selectedChord, W - 60, H - 50);
      ctx.restore();
    }
  }, [selectedChord, logoImage]);

  // Draw whenever chord changes or logo loads
  useEffect(() => {
    if (isLoaded) {
      drawPiano();
    }
  }, [isLoaded, selectedChord, drawPiano]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const name = selectedChord || "Piano_Vazio";
    const link = document.createElement("a");
    link.download = `Starkids_Piano_${name.replace(/ /g, "_")}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const downloadAll = async () => {
    const options = Object.keys(PIANO_CHORDS).filter(
      (o) => o !== "Piano Limpo",
    );
    if (
      !confirm(
        `Gerar e baixar ${options.length} imagens? Isso pode levar alguns segundos.`,
      )
    )
      return;

    for (const chord of options) {
      setSelectedChord(chord);
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (canvasRef.current) {
        const link = document.createElement("a");
        link.download = `Starkids_Piano_${chord.replace(/ /g, "_")}.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
      }
    }
    setSelectedChord("");
  };

  const downloadPDF = () => {
    if (!canvasRef.current) return;
    const name = selectedChord || "Piano_Vazio";

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [PIANO_CONFIG.width, PIANO_CONFIG.height],
    });

    const imgData = canvasRef.current.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, PIANO_CONFIG.width, PIANO_CONFIG.height);

    pdf.save(`Starkids_Piano_${name.replace(/ /g, "_")}.pdf`);
  };

  // --- Chord Strip Logic ---

  const addToStrip = () => {
    if (!canvasRef.current || !selectedChord) return;
    const newItem: ChordStripItem = {
      id: Date.now().toString(),
      name: selectedChord,
      src: canvasRef.current.toDataURL("image/png"),
    };
    setChordStrip([...chordStrip, newItem]);
  };

  const removeFromStrip = (id: string) => {
    setChordStrip(chordStrip.filter((item) => item.id !== id));
  };

  const downloadStripImage = async () => {
    if (chordStrip.length === 0) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Configurações da fita
    const itemWidth = PIANO_CONFIG.width;
    const itemHeight = PIANO_CONFIG.height;
    const gap = 50; // Espaço entre acordes

    // Layout Horizontal
    canvas.width =
      itemWidth * chordStrip.length + gap * (chordStrip.length - 1);
    canvas.height = itemHeight;

    // Preencher fundo branco
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let currentX = 0;
    for (const item of chordStrip) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, currentX, 0);
          currentX += itemWidth + gap;
          resolve();
        };
        img.src = item.src;
      });
    }

    const link = document.createElement("a");
    link.download = `Starkids_Piano_Fita_${chordStrip.length}_Acordes_Horizontal.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Control Panel */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-sky-100 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-sky-400 via-yellow-400 to-orange-400 rounded-t-3xl"></div>

        <div className="flex items-center gap-5 w-full md:w-auto z-10">
          <div className="bg-sky-100 p-4 rounded-2xl text-sky-500 hidden md:block border-2 border-sky-200">
            <Keyboard size={32} />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm font-bold text-sky-400 uppercase tracking-wider mb-2 pl-1">
              Escolha o Acorde
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedChord}
                  onChange={(e) => setSelectedChord(e.target.value)}
                  className="w-full md:min-w-[300px] appearance-none bg-sky-50 border-2 border-sky-200 text-sky-700 text-xl font-lobster py-3 px-5 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-400 cursor-pointer hover:bg-white transition-all"
                >
                  <option value="">-- Piano Limpo --</option>
                  {Object.keys(PIANO_CHORDS)
                    .filter((c) => c !== "Piano Limpo")
                    .map((chord) => (
                      <option key={chord} value={chord}>
                        {chord}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-sky-400">
                  <Settings2 size={20} />
                </div>
              </div>
              <button
                onClick={addToStrip}
                disabled={!selectedChord}
                className="bg-sky-500 hover:bg-sky-600 disabled:bg-slate-300 text-white p-3 rounded-xl transition-colors shadow-md active:translate-y-0.5"
                title="Adicionar à fita"
              >
                <Plus size={24} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto z-10">
          <DownloadMenu
            options={[
              {
                label: "Baixar Imagem",
                subLabel: "Formato PNG",
                icon: <ImageIcon size={20} />,
                onClick: downloadImage,
                colorClass: "text-purple-600 bg-purple-100",
              },
              {
                label: "Baixar PDF",
                subLabel: "Impressão A4",
                icon: <FileText size={20} />,
                onClick: downloadPDF,
                colorClass: "text-red-600 bg-red-100",
              },
              {
                label: "Baixar Pack",
                subLabel: "Todos os Acordes",
                icon: <Layers size={20} />,
                onClick: downloadAll,
                colorClass: "text-green-600 bg-green-100",
              },
              ...(chordStrip.length > 0
                ? [
                  {
                    label: "Baixar Fita",
                    subLabel: "Sequência Horizontal",
                    icon: <Download size={20} />,
                    onClick: downloadStripImage,
                    colorClass: "text-blue-600 bg-blue-100",
                  },
                ]
                : []),
            ]}
          />
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-white rounded-[2rem] p-4 md:p-8 shadow-xl border-4 border-white ring-4 ring-sky-50 flex flex-col items-center relative">
        <div className="absolute top-4 left-8 px-4 py-1 bg-sky-100 rounded-full text-sky-600 text-xs font-bold uppercase tracking-widest">
          Visualização
        </div>
        <div className="w-full overflow-x-auto flex justify-center mt-6">
          <canvas
            ref={canvasRef}
            width={PIANO_CONFIG.width}
            height={PIANO_CONFIG.height}
            className="w-full h-auto max-w-[1000px] rounded-xl shadow-inner border border-slate-100"
          />
        </div>
      </div>

      {/* Chord Strip Area */}
      {chordStrip.length > 0 && (
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border-4 border-sky-100 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6 border-b-2 border-sky-50 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-sky-100 p-2 rounded-lg text-sky-500">
                <Layers size={24} />
              </div>
              <div>
                <h3 className="font-lobster text-2xl text-sky-600">
                  Fita de Acordes
                </h3>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                  {chordStrip.length} acordes na sequência
                </p>
              </div>
            </div>
          </div>
          {/* Botão movido para o menu Arquivo */}

          <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar px-2">
            {chordStrip.map((item, index) => (
              <div
                key={item.id}
                className="relative group shrink-0 w-72 bg-slate-50 rounded-2xl border-2 border-slate-200 p-3 transition-all hover:-translate-y-2 hover:shadow-lg"
              >
                <div className="absolute -top-3 -right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => removeFromStrip(item.id)}
                    className="bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors transform hover:scale-110"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="bg-white rounded-xl overflow-hidden border border-slate-100 mb-3 shadow-sm">
                  <img
                    src={item.src}
                    alt={item.name}
                    className="w-full h-auto object-contain"
                  />
                </div>
                <div className="text-center">
                  <span className="inline-block bg-sky-100 text-sky-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    #{index + 1}
                  </span>
                  <p className="font-lobster text-xl text-slate-700 truncate">
                    {item.name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div >
      )}
    </div >
  );
};
