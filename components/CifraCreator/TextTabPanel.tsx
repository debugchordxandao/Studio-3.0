import React, { useState } from 'react';

interface TextTabPanelProps {
    onInsert: (dataUrl: string) => void;
}

const TextTabPanel: React.FC<TextTabPanelProps> = ({ onInsert }) => {
    const [text, setText] = useState<string>("");

    const handleConvert = () => {
        if (!text.trim()) return;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Configurações Estéticas
        const fontSize = 20; // Fonte maior para clareza
        const lineHeight = 28;
        const fontFamily = '"Consolas", "Courier New", monospace';
        const padding = 24;

        // Cores do Design System (MONOCROMÁTICO AZUL)
        const colors = {
            bg: '#f0f9ff',       // Sky Start (suave)
            border: '#b3e5fc',   // Borda sutil
            lines: '#4fc3f7',    // Azul Claro (estrutura) - Light Blue 300
            notes: '#01579b',    // Azul Escuro Forte (notas) - Light Blue 900
            text: '#0277bd'      // Azul Médio (texto genérico)
        };

        const lines = text.split('\n');

        // 1. Calcular Dimensões
        ctx.font = `bold ${fontSize}px ${fontFamily}`;

        // Como é monospace, medimos um caractere largo para ter a largura fixa da célula
        const charWidth = ctx.measureText('W').width;

        let maxLineLength = 0;
        lines.forEach(line => {
            if (line.length > maxLineLength) maxLineLength = line.length;
        });

        // Largura baseada no maior número de caracteres
        const contentWidth = maxLineLength * charWidth;
        const contentHeight = lines.length * lineHeight;

        canvas.width = contentWidth + (padding * 2);
        canvas.height = contentHeight + (padding * 2);

        // 2. Desenhar Fundo (Retângulo Arredondado)
        ctx.fillStyle = colors.bg;
        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 2;

        // Função helper para rounded rect (compatibilidade geral)
        const drawRoundedRect = (x: number, y: number, w: number, h: number, r: number) => {
            ctx.beginPath();
            ctx.moveTo(x + r, y);
            ctx.lineTo(x + w - r, y);
            ctx.quadraticCurveTo(x + w, y, x + w, y + r);
            ctx.lineTo(x + w, y + h - r);
            ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
            ctx.lineTo(x + r, y + h);
            ctx.quadraticCurveTo(x, y + h, x, y + h - r);
            ctx.lineTo(x, y + r);
            ctx.quadraticCurveTo(x, y, x + r, y);
            ctx.closePath();
        };

        drawRoundedRect(2, 2, canvas.width - 4, canvas.height - 4, 16);
        ctx.fill();
        ctx.stroke();

        // 3. Renderização "Smart" do Texto
        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.textBaseline = 'top';

        lines.forEach((line, lineIndex) => {
            const startY = padding + (lineIndex * lineHeight);
            let startX = padding;

            // Analisa caractere por caractere
            for (let i = 0; i < line.length; i++) {
                const char = line[i];

                // Lógica de Cores
                if (/[\dhpbrxs\/\\~^]/i.test(char)) {
                    // É nota ou símbolo técnico? -> AZUL ESCURO FORTE
                    ctx.fillStyle = colors.notes;
                } else if (/[-|+_]/i.test(char)) {
                    // É estrutura da tablatura? -> AZUL CLARO
                    ctx.fillStyle = colors.lines;
                } else {
                    // Texto genérico -> AZUL MÉDIO
                    ctx.fillStyle = colors.text;
                }

                ctx.fillText(char, startX, startY);

                // Avança o cursor
                startX += charWidth;
            }
        });

        onInsert(canvas.toDataURL());
    };

    return (
        <div className="flex flex-col gap-4 w-full h-full">
            <div className="flex-1 flex flex-col">
                <label className="block font-poppins font-semibold text-sky-800 mb-2 text-sm uppercase flex justify-between">
                    <span>Cole sua Tablatura (ASCII):</span>
                    <span className="text-[10px] bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full normal-case">Monospace</span>
                </label>

                <div className="relative flex-1 w-full shadow-inner rounded-xl overflow-hidden border-2 border-sky-200 focus-within:border-purple-300 focus-within:ring-2 focus-within:ring-purple-100 transition-all">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={`e|--0--2--3--|\nB|--1--3--0--|\nG|--0--2--0--|`}
                        className="w-full h-full p-4 font-mono text-sm bg-white text-gray-700 outline-none resize-none whitespace-pre leading-relaxed"
                        spellCheck={false}
                    />
                </div>

                <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-400 font-poppins italic">
                        O sistema irá colorir em tons de azul.
                    </span>
                </div>
            </div>

            <button
                onClick={handleConvert}
                disabled={!text.trim()}
                className="w-full font-lobster text-xl py-3 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-blue-600 hover:to-sky-500 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-full shadow-[0_4px_0_rgba(0,0,0,0.2)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2 transform hover:scale-[1.02]"
            >
                <span>🎨 Gerar Tablatura Azul</span>
            </button>
        </div>
    );
};

export default TextTabPanel;
