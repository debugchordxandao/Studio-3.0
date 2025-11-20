import React, { useState, useRef, useEffect } from 'react';
import { CHORDS, NOTES, TUNING, STARKIDS_PALETTE } from '../constants';

interface ChordPanelProps {
  onInsert: (dataUrl: string) => void;
}

const ChordPanel: React.FC<ChordPanelProps> = ({ onInsert }) => {
  const [selectedChord, setSelectedChord] = useState<string>(Object.keys(CHORDS)[0]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getNoteColor = (stringIdx: number, fret: number) => {
    if (fret < 0) return "#000";
    const openNoteVal = TUNING[stringIdx];
    const currentNoteVal = (openNoteVal + fret) % 12;
    let noteName = NOTES[currentNoteVal];
    const naturalNote = noteName.replace("#", ""); 
    return STARKIDS_PALETTE[naturalNote] || "#333";
  };

  const drawChord = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const positions = CHORDS[selectedChord] || [-1,-1,-1,-1,-1,-1];
    
    // Config
    const config = {
      width: 400, height: 500,
      gridX: 60, gridY: 100,
      cellWidth: 56, cellHeight: 64,
      numStrings: 6, numFrets: 5, nutThickness: 10
    };

    // Clear
    ctx.clearRect(0, 0, config.width, config.height); // Transparent background for insertion

    const gridW = (config.numStrings - 1) * config.cellWidth;
    const gridH = config.numFrets * config.cellHeight;
    
    // Strings (Vertical)
    ctx.strokeStyle = "#333";
    ctx.lineCap = "butt";
    for (let i = 0; i < config.numStrings; i++) {
      const x = config.gridX + (i * config.cellWidth);
      const stringNum = 6 - i; 
      ctx.lineWidth = 1 + (stringNum * 0.6);
      ctx.beginPath();
      ctx.moveTo(x, config.gridY);
      ctx.lineTo(x, config.gridY + gridH);
      ctx.stroke();
    }

    // Frets (Horizontal)
    ctx.lineWidth = 2;
    for (let i = 0; i <= config.numFrets; i++) {
      const y = config.gridY + (i * config.cellHeight);
      ctx.beginPath();
      ctx.moveTo(config.gridX, y);
      ctx.lineTo(config.gridX + gridW, y);
      ctx.stroke();
    }

    // Nut
    ctx.lineWidth = config.nutThickness;
    ctx.strokeStyle = "#111";
    ctx.beginPath();
    ctx.moveTo(config.gridX - 2, config.gridY);
    ctx.lineTo(config.gridX + gridW + 2, config.gridY);
    ctx.stroke();

    // Dots & Xs
    positions.forEach((fret, i) => {
      const x = config.gridX + (i * config.cellWidth);
      
      if (fret === -1) {
        ctx.fillStyle = "#555";
        ctx.font = "bold 24px Poppins";
        ctx.textAlign = "center";
        ctx.fillText("X", x, config.gridY - 20);
      } else if (fret > 0) {
        const color = getNoteColor(i, fret);
        const y = config.gridY + (fret * config.cellHeight) - (config.cellHeight / 2);
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (fret === 0) {
         // Open string indicator (optional, but nice)
         ctx.strokeStyle = "#333";
         ctx.lineWidth = 2;
         ctx.beginPath();
         ctx.arc(x, config.gridY - 25, 6, 0, 2 * Math.PI);
         ctx.stroke();
      }
    });

    // Title
    const displayTitle = selectedChord.split(" ")[0]; 
    ctx.fillStyle = "#0277bd";
    ctx.font = "bold 50px 'Lobster'";
    ctx.textAlign = "center";
    // Shadow effect
    ctx.shadowColor = "white";
    ctx.shadowBlur = 0;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.fillText(displayTitle, config.width / 2, 60);
    
    // Reset shadow
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
  };

  useEffect(() => {
    drawChord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedChord]);

  const handleInsert = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      // Scale down for insertion to document
      const tempCanvas = document.createElement('canvas');
      const tCtx = tempCanvas.getContext('2d');
      const scale = 0.4; // Smaller for text editor
      tempCanvas.width = canvas.width * scale;
      tempCanvas.height = canvas.height * scale;
      if (tCtx) {
        tCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
        onInsert(tempCanvas.toDataURL());
      }
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <div className="w-full">
        <label className="block font-poppins font-semibold text-starkids-blueDark mb-2 text-sm uppercase">
          Selecione o Acorde:
        </label>
        <select 
          value={selectedChord}
          onChange={(e) => setSelectedChord(e.target.value)}
          className="w-full font-poppins p-2 border-2 border-starkids-blue rounded-xl bg-skyStart text-starkids-blueDark outline-none focus:ring-2 focus:ring-starkids-purple"
        >
          {Object.keys(CHORDS).map(chord => (
            <option key={chord} value={chord}>{chord}</option>
          ))}
        </select>
      </div>

      <div className="bg-white p-2 rounded-xl shadow-md border-2 border-gray-100">
        <canvas 
          ref={canvasRef} 
          width={400} 
          height={500} 
          className="w-[200px] h-auto" 
        />
      </div>

      <button 
        onClick={handleInsert}
        className="w-full font-lobster text-lg py-2 bg-starkids-green hover:bg-green-600 text-white rounded-full shadow-[0_3px_0_#2e7d32] active:shadow-none active:translate-y-1 transition-all"
      >
        Inserir Acorde
      </button>
    </div>
  );
};

export default ChordPanel;