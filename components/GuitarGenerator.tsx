import React, { useEffect, useRef, useState, useCallback } from "react";
import { Download, Layers, Plus, X, Music, Settings2, Image as ImageIcon } from "lucide-react";
import { DownloadMenu } from "./DownloadMenu";

// --- CONSTANTS ---

const STARKIDS_PALETTE: Record<string, string> = {
  C: "#8a2be2",
  D: "#039be5",
  E: "#e57373",
  F: "#43a047",
  G: "#fdd835",
  A: "#fb8c00",
  B: "#d32f2f",
};

const NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

// Standard Tuning (E A D G B E) -> Indices 4, 9, 2, 7, 11, 4
const TUNING = [4, 9, 2, 7, 11, 4];

const CHORDS: Record<string, number[]> = {
  // --- MAIORES ---
  "C (Dó Maior)": [-1, 3, 2, 0, 1, 0],
  "D (Ré Maior)": [-1, -1, 0, 2, 3, 2],
  "E (Mi Maior)": [0, 2, 2, 1, 0, 0],
  "F (Fá Maior)": [1, 3, 3, 2, 1, 1],
  "G (Sol Maior)": [3, 2, 0, 0, 0, 3],
  "A (Lá Maior)": [-1, 0, 2, 2, 2, 0],
  "B (Si Maior)": [-1, 2, 4, 4, 4, 2],

  // --- MENORES ---
  "Cm (Dó Menor)": [-1, 3, 5, 5, 4, 3],
  "Dm (Ré Menor)": [-1, -1, 0, 2, 3, 1],
  "Em (Mi Menor)": [0, 2, 2, 0, 0, 0],
  "Fm (Fá Menor)": [1, 3, 3, 1, 1, 1],
  "Gm (Sol Menor)": [3, 5, 5, 3, 3, 3],
  "Am (Lá Menor)": [-1, 0, 2, 2, 1, 0],
  "Bm (Si Menor)": [-1, 2, 4, 4, 3, 2],

  // --- SÉTIMAS (DOMINANTES) ---
  "C7 (Dó com 7ª)": [-1, 3, 2, 3, 1, 0],
  "D7 (Ré com 7ª)": [-1, -1, 0, 2, 1, 2],
  "E7 (Mi com 7ª)": [0, 2, 0, 1, 0, 0],
  "F7 (Fá com 7ª)": [1, 3, 1, 2, 1, 1],
  "G7 (Sol com 7ª)": [3, 2, 0, 0, 0, 1],
  "A7 (Lá com 7ª)": [-1, 0, 2, 0, 2, 0],
  "B7 (Si com 7ª)": [-1, 2, 1, 2, 0, 2],

  // --- SÉTIMAS MAIORES (Major 7) ---
  "Cmaj7 (Dó 7M)": [-1, 3, 2, 0, 0, 0],
  "Dmaj7 (Ré 7M)": [-1, -1, 0, 2, 2, 2],
  "Emaj7 (Mi 7M)": [0, 2, 1, 1, 0, 0],
  "Fmaj7 (Fá 7M)": [-1, -1, 3, 2, 1, 0],
  "Gmaj7 (Sol 7M)": [3, 2, 0, 0, 0, 2],
  "Amaj7 (Lá 7M)": [-1, 0, 2, 1, 2, 0],
};

const CONFIG = {
  width: 1000,
  height: 1200,
  gridX: 150,
  gridY: 250,
  cellWidth: 140,
  cellHeight: 160,
  numStrings: 6,
  numFrets: 5,
  nutThickness: 25,
};

interface StripItem {
  id: number;
  name: string;
  src: string;
}

export const GuitarGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedChord, setSelectedChord] = useState<string>("C (Dó Maior)");
  const [stripData, setStripData] = useState<StripItem[]>([]);

  const getNoteColor = (stringIdx: number, fret: number) => {
    if (fret < 0) return "#000";
    const openNoteVal = TUNING[stringIdx];
    const currentNoteVal = (openNoteVal + fret) % 12;
    const noteName = NOTES[currentNoteVal];
    const naturalNote = noteName.replace("#", "");
    return STARKIDS_PALETTE[naturalNote] || "#333";
  };

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const positions = CHORDS[selectedChord] || [-1, -1, -1, -1, -1, -1];

    // Background
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

    const gridW = (CONFIG.numStrings - 1) * CONFIG.cellWidth;
    const gridH = CONFIG.numFrets * CONFIG.cellHeight;

    // Strings (Vertical)
    ctx.strokeStyle = "#333";
    ctx.lineCap = "butt";
    for (let i = 0; i < CONFIG.numStrings; i++) {
      const x = CONFIG.gridX + i * CONFIG.cellWidth;
      const stringNum = 6 - i;
      ctx.lineWidth = 2 + stringNum * 1.5;
      ctx.beginPath();
      ctx.moveTo(x, CONFIG.gridY);
      ctx.lineTo(x, CONFIG.gridY + gridH);
      ctx.stroke();
    }

    // Frets (Horizontal)
    ctx.lineWidth = 4;
    for (let i = 0; i <= CONFIG.numFrets; i++) {
      const y = CONFIG.gridY + i * CONFIG.cellHeight;
      ctx.beginPath();
      ctx.moveTo(CONFIG.gridX, y);
      ctx.lineTo(CONFIG.gridX + gridW, y);
      ctx.stroke();
    }

    // Nut (Pestana)
    ctx.lineWidth = CONFIG.nutThickness;
    ctx.strokeStyle = "#111";
    ctx.beginPath();
    ctx.moveTo(CONFIG.gridX - 5, CONFIG.gridY);
    ctx.lineTo(CONFIG.gridX + gridW + 5, CONFIG.gridY);
    ctx.stroke();

    // Dots
    positions.forEach((fret, i) => {
      const x = CONFIG.gridX + i * CONFIG.cellWidth;

      if (fret === -1) {
        ctx.fillStyle = "#555";
        ctx.font = "bold 60px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("X", x, CONFIG.gridY - 40);
      } else if (fret > 0) {
        const color = getNoteColor(i, fret);
        const y =
          CONFIG.gridY + fret * CONFIG.cellHeight - CONFIG.cellHeight / 2;
        ctx.beginPath();
        ctx.arc(x, y, 45, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
      }
    });

    // Title
    const displayTitle = selectedChord.split(" ")[0];
    ctx.fillStyle = "#333";
    ctx.font = "bold 140px 'Lobster'";
    ctx.textAlign = "center";
    ctx.fillText(displayTitle, CONFIG.width / 2, 160);
  }, [selectedChord]);

  useEffect(() => {
    draw();
  }, [draw]);

  const downloadCurrent = () => {
    if (!canvasRef.current) return;
    const name = selectedChord.split(" ")[0];
    const link = document.createElement("a");
    link.download = `Starkids_${name}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const addToStrip = () => {
    if (!canvasRef.current) return;
    const chordName = selectedChord.split(" ")[0];
    const dataUrl = canvasRef.current.toDataURL("image/png");
    const id = Date.now();

    setStripData([...stripData, { id, name: chordName, src: dataUrl }]);
  };

  const removeFromStrip = (id: number) => {
    setStripData(stripData.filter((item) => item.id !== id));
  };

  const downloadStrip = async () => {
    if (stripData.length === 0) return;

    const tempCanvas = document.createElement("canvas");
    const tCtx = tempCanvas.getContext("2d");
    if (!tCtx) return;

    const singleW = CONFIG.width;
    const singleH = CONFIG.height;

    tempCanvas.width = singleW * stripData.length;
    tempCanvas.height = singleH;

    let loaded = 0;
    for (const [i, item] of stripData.entries()) {
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => {
          tCtx.drawImage(img, i * singleW, 0);
          loaded++;
          resolve();
        };
        img.src = item.src;
      });
    }

    const link = document.createElement("a");
    link.download = "Starkids_Progressao_Completa.png";
    link.href = tempCanvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Control Panel */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-orange-100 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-red-400 to-purple-400 rounded-t-3xl"></div>

        <div className="flex items-center gap-5 w-full md:w-auto z-10">
          <div className="bg-orange-100 p-4 rounded-2xl text-orange-500 hidden md:block border-2 border-orange-200">
            <Music size={32} />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm font-bold text-orange-400 uppercase tracking-wider mb-2 pl-1">
              Escolha o Acorde
            </label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <select
                  value={selectedChord}
                  onChange={(e) => setSelectedChord(e.target.value)}
                  className="w-full md:min-w-[300px] appearance-none bg-orange-50 border-2 border-orange-200 text-orange-800 text-xl font-lobster py-3 px-5 rounded-xl focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 cursor-pointer hover:bg-white transition-all"
                >
                  {Object.keys(CHORDS).map((chord) => (
                    <option key={chord} value={chord}>
                      {chord}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-orange-400">
                  <Settings2 size={20} />
                </div>
              </div>
              <button
                onClick={addToStrip}
                className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-xl transition-colors shadow-md active:translate-y-0.5"
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
                onClick: downloadCurrent,
                colorClass: "text-purple-600 bg-purple-100",
              },
              ...(stripData.length > 0
                ? [
                  {
                    label: "Baixar Fita",
                    subLabel: "Sequência Horizontal",
                    icon: <Download size={20} />,
                    onClick: downloadStrip,
                    colorClass: "text-blue-600 bg-blue-100",
                  },
                ]
                : []),
            ]}
          />
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-white rounded-[2rem] p-4 md:p-8 shadow-xl border-4 border-white ring-4 ring-orange-50 flex flex-col items-center relative">
        <div className="absolute top-4 left-8 px-4 py-1 bg-orange-100 rounded-full text-orange-600 text-xs font-bold uppercase tracking-widest">
          Visualização
        </div>
        <div className="w-full overflow-x-auto flex justify-center mt-6">
          <canvas
            ref={canvasRef}
            width={CONFIG.width}
            height={CONFIG.height}
            className="w-full h-auto max-w-[400px] rounded-xl shadow-inner border border-slate-100"
          />
        </div>
      </div>

      {/* Chord Strip Area */}
      {stripData.length > 0 && (
        <div className="bg-white rounded-[2rem] p-6 shadow-xl border-4 border-orange-100 animate-fade-in-up">
          <div className="flex justify-between items-center mb-6 border-b-2 border-orange-50 pb-4">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 p-2 rounded-lg text-orange-500">
                <Layers size={24} />
              </div>
              <div>
                <h3 className="font-lobster text-2xl text-orange-600">
                  Fita de Progressão
                </h3>
                <p className="text-slate-400 text-sm font-bold uppercase tracking-wider">
                  {stripData.length} acordes na sequência
                </p>
              </div>
            </div>
            {/* Botão movido para o menu Arquivo */}
          </div>

          <div className="flex gap-6 overflow-x-auto pb-6 custom-scrollbar px-2">
            {stripData.map((item, index) => (
              <div
                key={item.id}
                className="relative group shrink-0 w-60 bg-slate-50 rounded-2xl border-2 border-slate-200 p-3 transition-all hover:-translate-y-2 hover:shadow-lg"
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
                  <span className="inline-block bg-orange-100 text-orange-600 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    #{index + 1}
                  </span>
                  <p className="font-lobster text-xl text-slate-700 truncate">
                    {item.name}
                  </p>
                </div>
                {index < stripData.length - 1 && (
                  <div className="absolute top-1/2 -right-8 transform -translate-y-1/2 text-orange-300 text-3xl font-bold z-0">
                    ➜
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
