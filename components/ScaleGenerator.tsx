import React, { useEffect, useRef, useState, useCallback } from "react";
import { Download, Layers, Settings2, Keyboard, FileText, Image as ImageIcon } from "lucide-react";
import { DownloadMenu } from "./DownloadMenu";
import {
  PIANO_SCALES,
  SCALE_CONFIG,
  PIANO_KEY_DATA,
  BLACK_KEYS_INDICES,
  BLACK_KEY_NAMES,
  STARKIDS_LOGO_URL,
} from "../constants";
import { jsPDF } from "jspdf";

export const ScaleGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedScale, setSelectedScale] = useState<string>("");
  const [logoImage, setLogoImage] = useState<HTMLImageElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
    } = SCALE_CONFIG;

    const keyW = (W - paddingX * 2) / keysCount;
    const startX = paddingX;
    const startY = 500;

    // 1. Clear
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);

    const scaleData = selectedScale ? PIANO_SCALES[selectedScale] : null;
    const activeIndices = scaleData ? scaleData.indices : [];

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
        // White Inactive (with subtle gradient)
        const whiteGrad = ctx.createLinearGradient(
          kx,
          startY,
          kx + keyW,
          startY,
        );
        whiteGrad.addColorStop(0, "#dbdbdb");
        whiteGrad.addColorStop(0.1, "#ffffff");
        whiteGrad.addColorStop(0.9, "#ffffff");
        whiteGrad.addColorStop(1, "#dbdbdb");
        ctx.fillStyle = whiteGrad;
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

        ctx.fillStyle = "rgba(0,0,0,0.4)";
        ctx.fillRect(bx, startY + bkH - 15, bkW, 15);
      } else {
        // Black Inactive
        ctx.fillStyle = "#1a1a1a";
        ctx.fillRect(bx, startY, bkW, bkH);

        const grad = ctx.createLinearGradient(bx, startY, bx + bkW, startY);
        grad.addColorStop(0, "#333");
        grad.addColorStop(0.2, "#111");
        grad.addColorStop(0.8, "#111");
        grad.addColorStop(1, "#333");
        ctx.fillStyle = grad;
        ctx.fillRect(bx + 5, startY, bkW - 10, bkH - 15);

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

      // White Border (Outer)
      ctx.fillStyle = "#FFF";
      roundRect(ctx, x - 6, y - 6, w + 12, h + 12, radius + 6);
      ctx.fill();

      // Inner Color
      ctx.fillStyle = color;
      roundRect(ctx, x, y, w, h, radius);
      ctx.fill();

      ctx.shadowColor = "transparent";

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

    // Y position for capsules
    const labelsY = startY + pianoHeight + 200;

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

    activeIndices.forEach((idx) => {
      if (idx >= 100) {
        const baseIdx = idx - 100;
        const bx = startX + (baseIdx + 1) * keyW;
        const colorData = PIANO_KEY_DATA[baseIdx];
        const names = BLACK_KEY_NAMES[baseIdx];
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
      ctx.fillStyle = "#ff9800";
      ctx.font = "120px 'Lobster'";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // CHANGED: Updated Text
      ctx.fillText("Starkids Studio", W / 2, 180);
    }

    // 6. INFO BOX (Dedilhado Table)
    if (selectedScale && scaleData) {
      ctx.save();
      ctx.textAlign = "left";

      // Title in corner
      ctx.font = "bold 60px 'Poppins'";
      ctx.fillStyle = "#333";
      const titleW = ctx.measureText(selectedScale).width;
      ctx.fillText(selectedScale, W - 50 - titleW, H - 50);

      // --- TABLE DRAWING ---
      const boxX = 50;
      const boxY = 1600;
      const boxW = 950;
      const boxH = 360;

      // Box Shadow
      ctx.shadowColor = "rgba(0,0,0,0.15)";
      ctx.shadowBlur = 20;
      ctx.shadowOffsetY = 5;

      // White Background
      ctx.fillStyle = "#ffffff";
      roundRect(ctx, boxX, boxY, boxW, boxH, 20);
      ctx.fill();
      ctx.shadowColor = "transparent";

      // Header (Blue)
      ctx.fillStyle = "#0288d1";
      ctx.beginPath();
      ctx.moveTo(boxX + 20, boxY); // Top Left
      ctx.lineTo(boxX + boxW - 20, boxY); // Top Right
      ctx.quadraticCurveTo(boxX + boxW, boxY, boxX + boxW, boxY + 20);
      ctx.lineTo(boxX + boxW, boxY + 80);
      ctx.lineTo(boxX, boxY + 80);
      ctx.lineTo(boxX, boxY + 20);
      ctx.quadraticCurveTo(boxX, boxY, boxX + 20, boxY);
      ctx.fill();

      // Header Title
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 40px 'Poppins'";
      ctx.fillText("TABELA DE DEDILHADO", boxX + 40, boxY + 55);

      // --- ROWS ---
      const col1X = boxX + 40; // Labels
      const col2X = boxX + 450; // Values

      const row1Y = boxY + 150; // Left Hand
      const row2Y = boxY + 230; // Right Hand
      const row3Y = boxY + 310; // Accidentals

      // Left Hand
      ctx.fillStyle = "#555";
      ctx.font = "bold 35px 'Poppins'";
      ctx.fillText("Mão Esquerda:", col1X, row1Y);

      ctx.fillStyle = "#000";
      ctx.font = "40px 'Poppins'";
      ctx.fillText(scaleData.fingeringLeft, col2X, row1Y);

      // Divider 1
      ctx.strokeStyle = "#eee";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(boxX + 30, row1Y + 30);
      ctx.lineTo(boxX + boxW - 30, row1Y + 30);
      ctx.stroke();

      // Right Hand
      ctx.fillStyle = "#555";
      ctx.font = "bold 35px 'Poppins'";
      ctx.fillText("Mão Direita:", col1X, row2Y);

      ctx.fillStyle = "#000";
      ctx.font = "40px 'Poppins'";
      ctx.fillText(scaleData.fingeringRight, col2X, row2Y);

      // Divider 2
      ctx.beginPath();
      ctx.moveTo(boxX + 30, row2Y + 30);
      ctx.lineTo(boxX + boxW - 30, row2Y + 30);
      ctx.stroke();

      // Accidentals
      ctx.fillStyle = "#d32f2f"; // Red
      ctx.font = "bold 35px 'Poppins'";
      ctx.fillText("Acidentes:", col1X, row3Y);

      ctx.fillStyle = "#d32f2f";
      ctx.font = "35px 'Poppins'";
      ctx.fillText(scaleData.accidentals, col2X, row3Y);

      // Outer Stroke
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#0288d1";
      roundRect(ctx, boxX, boxY, boxW, boxH, 20);
      ctx.stroke();

      ctx.restore();
    }
  }, [selectedScale, logoImage]);

  // Draw whenever selection changes or logo loads
  useEffect(() => {
    if (isLoaded) {
      drawPiano();
    }
  }, [isLoaded, selectedScale, drawPiano]);

  const downloadImage = () => {
    if (!canvasRef.current) return;
    const name = selectedScale || "Escala_Vazia";
    const link = document.createElement("a");
    link.download = `Starkids_Escala_${name.replace(/ /g, "_")}.png`;
    link.href = canvasRef.current.toDataURL("image/png");
    link.click();
  };

  const downloadAll = async () => {
    const options = Object.keys(PIANO_SCALES);
    if (
      !confirm(
        `Gerar e baixar ${options.length} imagens? Isso pode levar alguns segundos.`,
      )
    )
      return;

    for (const scale of options) {
      setSelectedScale(scale);
      // Wait for render
      await new Promise((resolve) => setTimeout(resolve, 400));

      if (canvasRef.current) {
        const link = document.createElement("a");
        link.download = `Starkids_Escala_${scale.replace(/ /g, "_")}.png`;
        link.href = canvasRef.current.toDataURL("image/png");
        link.click();
      }
    }
    setSelectedScale("");
  };

  const downloadPDF = () => {
    if (!canvasRef.current) return;
    const name = selectedScale || "Escala_Vazia";

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: [SCALE_CONFIG.width, SCALE_CONFIG.height],
    });

    const imgData = canvasRef.current.toDataURL("image/png");
    pdf.addImage(imgData, "PNG", 0, 0, SCALE_CONFIG.width, SCALE_CONFIG.height);

    pdf.save(`Starkids_Escala_${name.replace(/ /g, "_")}.pdf`);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Control Panel */}
      <div className="bg-white rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6 relative">
        {/* Decor */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 rounded-t-3xl"></div>

        <div className="flex items-center gap-5 w-full md:w-auto z-10">
          <div className="bg-purple-100 p-4 rounded-2xl text-purple-500 hidden md:block border-2 border-purple-200">
            <Keyboard size={32} />
          </div>
          <div className="flex flex-col w-full">
            <label className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2 pl-1">
              Selecione a Escala
            </label>
            <div className="relative">
              <select
                value={selectedScale}
                onChange={(e) => setSelectedScale(e.target.value)}
                className="w-full md:min-w-[350px] appearance-none bg-purple-50 border-2 border-purple-200 text-purple-700 text-xl font-lobster py-3 px-5 rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 cursor-pointer hover:bg-white transition-all"
              >
                <option value="">-- Selecione uma Escala --</option>
                {Object.keys(PIANO_SCALES).map((scale) => (
                  <option key={scale} value={scale}>
                    {scale}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-purple-400">
                <Settings2 size={20} />
              </div>
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
                subLabel: "Todas as Escalas",
                icon: <Layers size={20} />,
                onClick: downloadAll,
                colorClass: "text-green-600 bg-green-100",
              },
            ]}
          />
        </div>
      </div>

      {/* Preview Area */}
      <div className="bg-white rounded-[2rem] p-4 md:p-8 shadow-xl border-4 border-white ring-4 ring-purple-50 flex flex-col items-center relative">
        <div className="absolute top-4 left-8 px-4 py-1 bg-purple-100 rounded-full text-purple-600 text-xs font-bold uppercase tracking-widest">
          Visualização
        </div>
        <div className="w-full overflow-x-auto flex justify-center mt-6">
          <canvas
            ref={canvasRef}
            width={SCALE_CONFIG.width}
            height={SCALE_CONFIG.height}
            className="w-full h-auto max-w-[1000px] rounded-xl shadow-inner border border-slate-100"
          />
        </div>
      </div>
    </div>
  );
};
