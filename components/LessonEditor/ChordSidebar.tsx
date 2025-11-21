import React, { useState, useEffect, useRef } from 'react';
import { NOTE_COLORS, PIANO_CHORDS, GUITAR_CHORDS } from './types';
import { PlusCircle, Music2, Guitar } from 'lucide-react';

interface ChordSidebarProps {
    onInsert: (imageSrc: string) => void;
}

type Instrument = 'piano' | 'guitar';

const getNoteColor = (semitone: number): string => {
    const normalized = semitone % 12;
    switch (normalized) {
        case 0: return NOTE_COLORS["C"];
        case 1: return NOTE_COLORS["C"];
        case 2: return NOTE_COLORS["D"];
        case 3: return NOTE_COLORS["D"];
        case 4: return NOTE_COLORS["E"];
        case 5: return NOTE_COLORS["F"];
        case 6: return NOTE_COLORS["F"];
        case 7: return NOTE_COLORS["G"];
        case 8: return NOTE_COLORS["G"];
        case 9: return NOTE_COLORS["A"];
        case 10: return NOTE_COLORS["A"];
        case 11: return NOTE_COLORS["B"];
        default: return '#000';
    }
};

export const ChordSidebar: React.FC<ChordSidebarProps> = ({ onInsert }) => {
    const [instrument, setInstrument] = useState<Instrument>('piano');
    const [selectedChordKey, setSelectedChordKey] = useState<string>('C (Dó)');
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const availableChords = instrument === 'piano' ? Object.keys(PIANO_CHORDS) : Object.keys(GUITAR_CHORDS);

    useEffect(() => {
        if (!availableChords.includes(selectedChordKey)) setSelectedChordKey(availableChords[0]);
    }, [instrument, availableChords, selectedChordKey]);

    useEffect(() => { draw(); }, [instrument, selectedChordKey]);

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        if (instrument === 'piano') drawPiano(ctx, PIANO_CHORDS[selectedChordKey] || []);
        else drawGuitar(ctx, GUITAR_CHORDS[selectedChordKey] || []);
    };

    const drawPiano = (ctx: CanvasRenderingContext2D, keys: number[]) => {
        const numVisibleKeys = 10;
        const whiteKeyWidth = ctx.canvas.width / numVisibleKeys;
        const whiteKeyHeight = 120;
        const blackKeyWidth = whiteKeyWidth * 0.6;
        const blackKeyHeight = 75;
        const startY = 10;

        const blackKeyMap: Record<number, { gap: number, semitone: number }> = {
            101: { gap: 1, semitone: 3 }, 103: { gap: 3, semitone: 6 },
            104: { gap: 4, semitone: 8 }, 105: { gap: 5, semitone: 10 },
            107: { gap: 7, semitone: 1 }, 108: { gap: 8, semitone: 3 },
            110: { gap: 10, semitone: 6 }, 111: { gap: 11, semitone: 8 }, 112: { gap: 12, semitone: 10 }
        };

        const indices = keys.map(k => {
            if (k < 100) return k;
            return blackKeyMap[k]?.gap || 0;
        });

        const maxKeyIndex = Math.max(...indices);
        let startKeyIndex = 0;
        if (maxKeyIndex >= numVisibleKeys) {
            startKeyIndex = Math.max(0, maxKeyIndex - numVisibleKeys + 2);
        }

        const basePattern = [0, 2, 4, 5, 7, 9, 11];
        const getWhiteKeySemitone = (idx: number) => {
            const octave = Math.floor(idx / 7);
            const note = basePattern[idx % 7];
            return note + (octave * 12);
        };

        for (let i = 0; i < numVisibleKeys; i++) {
            const currentKeyIndex = startKeyIndex + i;
            const x = i * whiteKeyWidth;
            ctx.fillStyle = '#ffffff'; ctx.strokeStyle = '#333'; ctx.lineWidth = 2;
            ctx.fillRect(x, startY, whiteKeyWidth, whiteKeyHeight);
            ctx.strokeRect(x, startY, whiteKeyWidth, whiteKeyHeight);

            if (keys.includes(currentKeyIndex)) {
                const semitone = getWhiteKeySemitone(currentKeyIndex);
                ctx.fillStyle = getNoteColor(semitone);
                ctx.beginPath(); ctx.arc(x + whiteKeyWidth / 2, startY + whiteKeyHeight - 20, whiteKeyWidth * 0.3, 0, Math.PI * 2); ctx.fill();
            }
        }

        for (let i = 0; i < numVisibleKeys - 1; i++) {
            const visualGapIndex = i;
            const actualGapIndex = startKeyIndex + i;
            const gapInOctave = actualGapIndex % 7;
            if (gapInOctave === 2 || gapInOctave === 6) continue;

            const x = ((visualGapIndex + 1) * whiteKeyWidth) - (blackKeyWidth / 2);
            const activeCode = Object.keys(blackKeyMap).find(code => blackKeyMap[parseInt(code)].gap === actualGapIndex);
            const isPressed = activeCode && keys.includes(parseInt(activeCode));

            ctx.fillStyle = '#333';
            ctx.fillRect(x, startY, blackKeyWidth, blackKeyHeight);

            if (isPressed && activeCode) {
                const semitone = blackKeyMap[parseInt(activeCode)].semitone;
                ctx.fillStyle = getNoteColor(semitone);
                ctx.beginPath(); ctx.arc(x + blackKeyWidth / 2, startY + blackKeyHeight - 12, blackKeyWidth * 0.3, 0, Math.PI * 2); ctx.fill();
            }
        }
    };

    const drawGuitar = (ctx: CanvasRenderingContext2D, frets: number[]) => {
        const w = 200; const h = 200; const offsetX = 30; const offsetY = 40;
        const stringGap = 30; const fretGap = 35; const numStrings = 6; const numFrets = 5;
        const stringTuning = [4, 9, 2, 7, 11, 4];

        ctx.lineWidth = 6; ctx.strokeStyle = '#333';
        ctx.beginPath(); ctx.moveTo(offsetX, offsetY); ctx.lineTo(offsetX + (numStrings - 1) * stringGap, offsetY); ctx.stroke();
        ctx.lineWidth = 2;
        for (let i = 0; i < numStrings; i++) {
            const x = offsetX + i * stringGap;
            ctx.beginPath(); ctx.moveTo(x, offsetY); ctx.lineTo(x, offsetY + numFrets * fretGap); ctx.stroke();
        }
        for (let i = 1; i <= numFrets; i++) {
            const y = offsetY + i * fretGap;
            ctx.beginPath(); ctx.moveTo(offsetX, y); ctx.lineTo(offsetX + (numStrings - 1) * stringGap, y); ctx.stroke();
        }
        frets.forEach((fret, stringIndex) => {
            const x = offsetX + stringIndex * stringGap;
            if (fret === -1) {
                ctx.font = "bold 18px Poppins"; ctx.fillStyle = "#555"; ctx.textAlign = "center"; ctx.fillText("X", x, offsetY - 12);
            } else if (fret === 0) {
                ctx.strokeStyle = "#555"; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x, offsetY - 15, 5, 0, Math.PI * 2); ctx.stroke();
            } else {
                const y = offsetY + (fret * fretGap) - (fretGap / 2);
                const noteVal = (stringTuning[stringIndex] + fret) % 12;
                ctx.fillStyle = getNoteColor(noteVal);
                ctx.beginPath(); ctx.arc(x, y, 11, 0, Math.PI * 2); ctx.fill();
            }
        });
    };

    const handleInsertClick = () => {
        if (canvasRef.current) {
            onInsert(canvasRef.current.toDataURL('image/png'));
        }
    };

    return (
        <div className="w-full md:w-[320px] flex-shrink-0 bg-white/90 backdrop-blur-sm rounded-[30px] border-4 border-white shadow-xl p-6 flex flex-col gap-6 h-fit md:sticky md:top-28">
            <h3 className="font-lobster text-3xl text-sky-500 text-center border-b-2 border-sky-100 pb-2">Inserir Acorde</h3>
            <div className="flex bg-sky-100 p-1.5 rounded-full shadow-inner">
                <button onClick={() => setInstrument('piano')} className={`flex-1 py-2 px-2 rounded-full font-poppins font-semibold text-sm transition-all flex items-center justify-center gap-2 ${instrument === 'piano' ? 'bg-white text-sky-500 shadow-md scale-105' : 'text-gray-500 hover:text-sky-500'}`}>
                    <Music2 size={18} /> Piano
                </button>
                <button onClick={() => setInstrument('guitar')} className={`flex-1 py-2 px-2 rounded-full font-poppins font-semibold text-sm transition-all flex items-center justify-center gap-2 ${instrument === 'guitar' ? 'bg-white text-purple-500 shadow-md scale-105' : 'text-gray-500 hover:text-purple-500'}`}>
                    <Guitar size={18} /> Violão
                </button>
            </div>
            <div className="flex flex-col gap-2">
                <label className="text-xs font-poppins font-bold text-gray-400 uppercase ml-2 tracking-wider">Selecione o Acorde:</label>
                <select value={selectedChordKey} onChange={(e) => setSelectedChordKey(e.target.value)} className="w-full p-3 rounded-xl border-2 border-sky-200 bg-sky-50 font-poppins text-lg text-sky-500 font-bold focus:outline-none cursor-pointer">
                    {availableChords.map(chord => <option key={chord} value={chord}>{chord}</option>)}
                </select>
            </div>
            <div className="bg-white rounded-xl border-2 border-gray-100 shadow-inner p-4 flex justify-center items-center min-h-[200px] overflow-hidden relative">
                <div className="absolute top-2 right-2 text-[10px] text-gray-300 font-bold uppercase">Preview</div>
                <canvas ref={canvasRef} width={instrument === 'piano' ? 400 : 220} height={instrument === 'piano' ? 140 : 260} className="max-w-full max-h-full object-contain" />
            </div>
            <button onClick={handleInsertClick} className="group w-full py-3.5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-lobster text-xl rounded-full shadow-[0_4px_0_#2e7d32] hover:shadow-[0_6px_0_#2e7d32] hover:-translate-y-0.5 active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2">
                <PlusCircle size={24} className="group-hover:rotate-90 transition-transform" /> INSERIR NO TEXTO
            </button>
        </div>
    );
};
