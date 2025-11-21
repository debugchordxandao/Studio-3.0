import React, { useEffect, useRef } from 'react';
import {
    GUITAR_CONFIG as CONFIG,
    GUITAR_CHORDS as CHORDS,
    GUITAR_TUNING as TUNING,
    GUITAR_NOTES as NOTES,
    GUITAR_PALETTE as STARKIDS_PALETTE
} from '../../constants';

interface ChordCanvasProps {
    chordName: string;
    className?: string;
}

export const ChordCanvas: React.FC<ChordCanvasProps> = ({ chordName, className }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const getNoteColor = (stringIdx: number, fret: number) => {
        if (fret < 0) return "#000";
        const openNoteVal = TUNING[stringIdx];
        const currentNoteVal = (openNoteVal + fret) % 12;
        const noteName = NOTES[currentNoteVal];
        const naturalNote = noteName.replace("#", "");
        return STARKIDS_PALETTE[naturalNote] || "#333";
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const positions = CHORDS[chordName] || [-1, -1, -1, -1, -1, -1];

        // Fundo
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, CONFIG.width, CONFIG.height);

        const gridW = (CONFIG.numStrings - 1) * CONFIG.cellWidth;
        const gridH = CONFIG.numFrets * CONFIG.cellHeight;

        // Cordas (Verticais)
        ctx.strokeStyle = "#333";
        ctx.lineCap = "butt";
        for (let i = 0; i < CONFIG.numStrings; i++) {
            const x = CONFIG.gridX + (i * CONFIG.cellWidth);
            const stringNum = 6 - i;
            ctx.lineWidth = 2 + (stringNum * 1.5);
            ctx.beginPath();
            ctx.moveTo(x, CONFIG.gridY);
            ctx.lineTo(x, CONFIG.gridY + gridH);
            ctx.stroke();
        }

        // Trastes (Horizontais)
        ctx.lineWidth = 4;
        for (let i = 0; i <= CONFIG.numFrets; i++) {
            const y = CONFIG.gridY + (i * CONFIG.cellHeight);
            ctx.beginPath();
            ctx.moveTo(CONFIG.gridX, y);
            ctx.lineTo(CONFIG.gridX + gridW, y);
            ctx.stroke();
        }

        // Pestana
        ctx.lineWidth = CONFIG.nutThickness;
        ctx.strokeStyle = "#111";
        ctx.beginPath();
        ctx.moveTo(CONFIG.gridX - 5, CONFIG.gridY);
        ctx.lineTo(CONFIG.gridX + gridW + 5, CONFIG.gridY);
        ctx.stroke();

        // Bolinhas
        positions.forEach((fret, i) => {
            const x = CONFIG.gridX + (i * CONFIG.cellWidth);

            if (fret === -1) {
                ctx.fillStyle = "#555";
                ctx.font = "bold 60px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("X", x, CONFIG.gridY - 40);
            } else if (fret > 0) {
                const color = getNoteColor(i, fret);
                const y = CONFIG.gridY + (fret * CONFIG.cellHeight) - (CONFIG.cellHeight / 2);
                ctx.beginPath();
                ctx.arc(x, y, 45, 0, 2 * Math.PI);
                ctx.fillStyle = color;
                ctx.fill();
            } else if (fret === 0) {
                // Opcional: Desenhar um círculo vazio ou letra acima da pestana para cordas soltas,
                // mas mantendo fiel ao código original, cordas soltas (0) não desenham nada específico 
                // além de não ter o X. O código original só desenha se fret > 0 ou fret == -1.
            }
        });

        // NOTA: Não desenhamos o título aqui, pois é um Quiz!

    }, [chordName]);

    return (
        <canvas
            ref={canvasRef}
            width={CONFIG.width}
            height={CONFIG.height}
            className={`w-full h-auto rounded-lg shadow-inner border border-gray-100 ${className}`}
        />
    );
};
