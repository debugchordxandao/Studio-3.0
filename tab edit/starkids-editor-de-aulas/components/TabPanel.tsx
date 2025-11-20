import React, { useState } from 'react';
import { TAB_STRINGS } from '../constants';

interface TabPanelProps {
  onInsert: (dataUrl: string) => void;
}

const TabPanel: React.FC<TabPanelProps> = ({ onInsert }) => {
  const COLS = 8;
  // State: 6 rows (strings), 8 cols
  const [grid, setGrid] = useState<string[][]>(
    Array.from({ length: 6 }, () => Array(COLS).fill(""))
  );

  const handleInputChange = (row: number, col: number, val: string) => {
    // Permitir apenas números ou letras comuns de tablatura (h, p, /, etc) se desejar, 
    // mas limitando a 2 chars para caber no box.
    if (val.length > 2) return; 
    
    const newGrid = [...grid];
    newGrid[row] = [...newGrid[row]];
    newGrid[row][col] = val.toUpperCase(); // Força maiúsculas (ex: x -> X)
    setGrid(newGrid);
  };

  const handleClear = () => {
    setGrid(Array.from({ length: 6 }, () => Array(COLS).fill("")));
  };

  const generateTabImage = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const config = {
      width: 600,
      height: 180,
      startX: 40,
      rowHeight: 25, // distance between strings
      colWidth: 60,  // distance between steps
      topMargin: 20
    };

    canvas.width = config.width;
    canvas.height = config.height;

    ctx.fillStyle = 'rgba(255, 255, 255, 0)'; // Transparent
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Lines (Strings)
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#333';
    ctx.font = 'bold 18px Poppins';
    ctx.textBaseline = 'middle';

    for (let r = 0; r < 6; r++) {
      const y = config.topMargin + (r * config.rowHeight);
      
      // Draw String Name (Label)
      ctx.fillStyle = '#0277bd';
      ctx.textAlign = 'right';
      ctx.fillText(TAB_STRINGS[r], config.startX - 10, y);

      // Draw Horizontal Line
      ctx.beginPath();
      ctx.moveTo(config.startX, y);
      ctx.lineTo(config.width - 10, y);
      ctx.stroke();

      // Draw Numbers
      for (let c = 0; c < COLS; c++) {
        const val = grid[r][c];
        if (val) {
          const x = config.startX + (config.colWidth / 2) + (c * config.colWidth);
          
          // Measure text to create a white background box behind it
          // so the line doesn't cross through the number.
          const textMetrics = ctx.measureText(val);
          const bgWidth = textMetrics.width + 8;
          const bgHeight = 20;

          ctx.fillStyle = 'white';
          ctx.fillRect(x - bgWidth / 2, y - bgHeight / 2, bgWidth, bgHeight);

          ctx.fillStyle = '#000';
          ctx.textAlign = 'center';
          ctx.fillText(val, x, y + 1); // +1 for optical alignment
        }
      }
    }

    // Vertical Bars at ends
    const totalHeight = 5 * config.rowHeight;
    const startY = config.topMargin;
    const endY = startY + totalHeight;

    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(config.startX, startY);
    ctx.lineTo(config.startX, endY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(config.width - 10, startY);
    ctx.lineTo(config.width - 10, endY);
    ctx.stroke();

    onInsert(canvas.toDataURL());
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="bg-gray-50 p-3 rounded-xl shadow-inner border border-gray-200 overflow-x-auto">
        {/* Header Legend */}
        <div className="flex mb-2 items-center justify-between">
           <div className="text-xs text-gray-500 font-poppins italic w-full text-center">
             Digite os números (casas)
           </div>
        </div>

        {/* Grid Container */}
        <div className="flex flex-col gap-1 min-w-[280px]">
           {grid.map((row, rIndex) => (
             <div key={rIndex} className="flex items-center gap-2 h-10 relative isolate">
               
               {/* 1. A Linha da Corda (Background Visual) 
                   Usamos absolute para ela ficar atrás de tudo. 
                   z-0 garante que fique atrás dos inputs (que serão z-10) 
               */}
               <div className="absolute left-8 right-0 top-1/2 h-[2px] bg-gray-400 z-0 pointer-events-none transform -translate-y-1/2"></div>

               {/* 2. Label da Corda (e, B, G...) */}
               <div className="w-6 text-center font-bold text-starkids-blueDark font-poppins shrink-0 select-none z-10 bg-gray-50">
                 {TAB_STRINGS[rIndex]}
               </div>

               {/* 3. Inputs das Casas */}
               <div className="flex flex-1 justify-between z-10 px-1">
                 {row.map((cell, cIndex) => (
                   <input
                     key={`${rIndex}-${cIndex}`}
                     type="text"
                     inputMode="text"
                     value={cell}
                     onChange={(e) => handleInputChange(rIndex, cIndex, e.target.value)}
                     className={`
                       w-8 h-8 
                       shrink-0 
                       text-center 
                       font-bold 
                       text-sm 
                       text-gray-900 
                       bg-white 
                       border 
                       border-gray-300 
                       rounded-md 
                       shadow-sm 
                       outline-none 
                       focus:ring-2 
                       focus:ring-starkids-orange 
                       focus:border-starkids-orange 
                       focus:scale-110 
                       transition-transform
                       cursor-text
                     `}
                     placeholder=""
                   />
                 ))}
               </div>
             </div>
           ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={handleClear}
          className="flex-1 font-poppins text-sm py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-full transition-colors shadow-sm active:translate-y-0.5"
        >
          Limpar
        </button>
        <button 
          onClick={generateTabImage}
          className="flex-[2] font-lobster text-lg py-2 bg-starkids-orange hover:bg-orange-600 text-white rounded-full shadow-[0_3px_0_#e65100] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
        >
          <span>Inerir</span>
          <span className="text-2xl leading-none pb-1">↴</span>
        </button>
      </div>
    </div>
  );
};

export default TabPanel;