import React, { useState } from 'react';
import { STARKIDS_PALETTE } from './constants';

interface RhythmPanelProps {
    onInsert: (dataUrl: string) => void;
}

type RhythmMove = 'DOWN' | 'UP' | 'MUTE' | 'PAUSE';

const RhythmPanel: React.FC<RhythmPanelProps> = ({ onInsert }) => {
    const [moves, setMoves] = useState<RhythmMove[]>([]);

    const addMove = (move: RhythmMove) => {
        if (moves.length < 16) { // Limit to prevent overflow issues
            setMoves([...moves, move]);
        }
    };

    const removeLast = () => {
        setMoves(moves.slice(0, -1));
    };

    const clearMoves = () => {
        setMoves([]);
    };

    const generateRhythmImage = () => {
        if (moves.length === 0) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configurações de Desenho
        const stepWidth = 50;
        const height = 80;
        const padding = 10;

        canvas.width = (moves.length * stepWidth) + (padding * 2);
        canvas.height = height;

        // Fundo Transparente (não preenchemos rect)

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        moves.forEach((move, i) => {
            const cx = padding + (i * stepWidth) + (stepWidth / 2); // Center X of this step
            const cy = height / 2;

            const arrowSize = 25;
            const arrowHeadSize = 12;

            ctx.lineWidth = 6;

            switch (move) {
                case 'DOWN':
                    // Seta Laranja para Baixo
                    ctx.strokeStyle = STARKIDS_PALETTE['A']; // Orange
                    ctx.beginPath();
                    // Haste
                    ctx.moveTo(cx, cy - arrowSize);
                    ctx.lineTo(cx, cy + arrowSize);
                    // Cabeça
                    ctx.moveTo(cx - arrowHeadSize, cy + arrowSize - arrowHeadSize);
                    ctx.lineTo(cx, cy + arrowSize);
                    ctx.lineTo(cx + arrowHeadSize, cy + arrowSize - arrowHeadSize);
                    ctx.stroke();
                    break;

                case 'UP':
                    // Seta Azul para Cima
                    ctx.strokeStyle = STARKIDS_PALETTE['D']; // Blue
                    ctx.beginPath();
                    // Haste
                    ctx.moveTo(cx, cy + arrowSize);
                    ctx.lineTo(cx, cy - arrowSize);
                    // Cabeça
                    ctx.moveTo(cx - arrowHeadSize, cy - arrowSize + arrowHeadSize);
                    ctx.lineTo(cx, cy - arrowSize);
                    ctx.lineTo(cx + arrowHeadSize, cy - arrowSize + arrowHeadSize);
                    ctx.stroke();
                    break;

                case 'MUTE':
                    // X Vermelho
                    ctx.strokeStyle = STARKIDS_PALETTE['B']; // Red
                    ctx.lineWidth = 5;
                    const xSize = 15;
                    ctx.beginPath();
                    ctx.moveTo(cx - xSize, cy - xSize);
                    ctx.lineTo(cx + xSize, cy + xSize);
                    ctx.moveTo(cx + xSize, cy - xSize);
                    ctx.lineTo(cx - xSize, cy + xSize);
                    ctx.stroke();
                    break;

                case 'PAUSE':
                    // Tracinho Cinza (Pausa)
                    ctx.strokeStyle = '#9ca3af'; // Gray
                    ctx.lineWidth = 4;
                    ctx.beginPath();
                    ctx.moveTo(cx - 8, cy);
                    ctx.lineTo(cx + 8, cy);
                    ctx.stroke();
                    break;
            }
        });

        onInsert(canvas.toDataURL());
    };

    // Helper para ícones do preview
    const getIcon = (move: RhythmMove) => {
        switch (move) {
            case 'DOWN': return <span className="text-orange-500 text-3xl font-bold">↓</span>;
            case 'UP': return <span className="text-sky-500 text-3xl font-bold">↑</span>;
            case 'MUTE': return <span className="text-red-500 text-2xl font-bold">✕</span>;
            case 'PAUSE': return <span className="text-gray-400 text-xl font-bold">−</span>;
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            {/* Controls */}
            <div className="grid grid-cols-4 gap-2">
                <button
                    onClick={() => addMove('DOWN')}
                    className="aspect-square rounded-xl bg-orange-100 border-2 border-orange-200 flex flex-col items-center justify-center hover:bg-orange-200 active:scale-95 transition-all group"
                    title="Batida para Baixo"
                >
                    <span className="text-3xl group-hover:translate-y-1 transition-transform">⬇️</span>
                </button>

                <button
                    onClick={() => addMove('UP')}
                    className="aspect-square rounded-xl bg-blue-100 border-2 border-blue-200 flex flex-col items-center justify-center hover:bg-blue-200 active:scale-95 transition-all group"
                    title="Batida para Cima"
                >
                    <span className="text-3xl group-hover:-translate-y-1 transition-transform">⬆️</span>
                </button>

                <button
                    onClick={() => addMove('MUTE')}
                    className="aspect-square rounded-xl bg-red-100 border-2 border-red-200 flex flex-col items-center justify-center hover:bg-red-200 active:scale-95 transition-all"
                    title="Abafado / Percussivo"
                >
                    <span className="text-3xl text-red-500 font-bold">✕</span>
                </button>

                <button
                    onClick={() => addMove('PAUSE')}
                    className="aspect-square rounded-xl bg-gray-100 border-2 border-gray-200 flex flex-col items-center justify-center hover:bg-gray-200 active:scale-95 transition-all"
                    title="Pausa / Espaço"
                >
                    <span className="text-3xl text-gray-500 font-bold">➖</span>
                </button>
            </div>

            {/* Preview Area */}
            <div className="flex-1 bg-white rounded-xl border-2 border-dashed border-gray-300 p-4 flex flex-col relative overflow-hidden">
                <span className="text-xs text-gray-400 font-poppins uppercase tracking-wider mb-2 text-center">Preview da Sequência</span>

                <div className="flex-1 flex items-center gap-2 overflow-x-auto custom-scroll pb-2 px-2">
                    {moves.length === 0 && (
                        <div className="w-full text-center text-gray-300 italic text-sm">
                            Adicione movimentos...
                        </div>
                    )}
                    {moves.map((m, i) => (
                        <div key={i} className="flex-shrink-0 w-10 h-14 bg-gray-50 rounded flex items-center justify-center shadow-sm border border-gray-100">
                            {getIcon(m)}
                        </div>
                    ))}
                </div>

                {/* Small controls inside preview */}
                {moves.length > 0 && (
                    <div className="absolute top-2 right-2">
                        <button
                            onClick={removeLast}
                            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-600 px-2 py-1 rounded-md"
                            title="Remover último"
                        >
                            ⌫
                        </button>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
                <button
                    onClick={clearMoves}
                    className="flex-1 font-poppins text-sm py-3 bg-gray-400 hover:bg-gray-500 text-white rounded-full transition-colors shadow-sm active:translate-y-0.5"
                >
                    Limpar
                </button>
                <button
                    onClick={generateRhythmImage}
                    disabled={moves.length === 0}
                    className="flex-[2] font-lobster text-lg py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:shadow-none text-white rounded-full shadow-[0_3px_0_#2e7d32] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2"
                >
                    Inserir Ritmo 🎵
                </button>
            </div>
        </div>
    );
};

export default RhythmPanel;
