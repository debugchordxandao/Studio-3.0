import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Printer, Type, BookOpen, Eraser } from 'lucide-react';
import { DownloadMenu } from "./DownloadMenu";
import { Renderer, Stave, StaveNote, Accidental, Dot, Voice, Formatter, Beam } from 'vexflow';

// Constants
const A4_WIDTH = 794;
const A4_HEIGHT = 1123;
const MARGIN_X = 60;
const TOP_PADDING = 150;
const STAVE_VERTICAL_SPACING = 160;
const MEASURES_PER_LINE = 3;

const NOTE_COLORS: Record<string, string> = {
  'c': "#9c27b0",
  'd': "#03a9f4",
  'e': "#e91e63",
  'f': "#4caf50",
  'g': "#ffeb3b",
  'a': "#ff9800",
  'b': "#f44336"
};

interface ParsedNote {
  keys: string[];
  duration: string;
  accidental?: string;
  dot: boolean;
  isValid: boolean;
}

export const SheetMusicGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'guide'>('editor');
  const [title, setTitle] = useState("Peixe Vivo");
  const [notation, setNotation] = useState("C4/q D4/q E4/q F4/q G4/q A4/q B4/q C5/q\nC4/q D4/q E4/q F4/q G4/h E4/q C4/q\nR/q G4/q G4/8 F4/8 E4/q F4/q G4/q\nC5/q B4/q A4/q G4/q F4/q E4/q D4/q C4/q");
  const [error, setError] = useState<string | null>(null);
  const scoreOutputRef = useRef<HTMLDivElement>(null);

  // Helper: Colors
  const getNoteColor = (key: string) => {
    if (!key) return "#000000";
    const noteName = key.charAt(0).toLowerCase();
    return NOTE_COLORS[noteName] || "#000000";
  };

  // Helper: Rhythm
  const getBeats = (duration: string, dot = false) => {
    const d = duration.replace('r', '');
    let val = 1;
    if (d === 'w') val = 4;
    else if (d === 'h') val = 2;
    else if (d === 'q') val = 1;
    else if (d === '8') val = 0.5;
    else if (d === '16') val = 0.25;
    else if (d === '32') val = 0.125;
    if (dot) val *= 1.5;
    return val;
  };

  // Logic: Parser
  const parseMusicString = (input: string): ParsedNote[] => {
    const tokens = input.trim().split(/\s+/).filter(t => t.length > 0);
    const validDurations = ['w', 'h', 'q', '8', '16', '32', 'wr', 'hr', 'qr', '8r', '16r', '32r'];

    return tokens.map(token => {
      let keys = ["c/4"];
      let duration = "q";
      let accidental: string | undefined = undefined;
      let dot = false;

      const parts = token.split('/');
      if (parts.length > 0 && parts[0] !== "") {
        const keyPart = parts[0];
        if (keyPart.toLowerCase() === 'r') {
          keys = ["b/4"];
          duration = parts[1] ? parts[1] + "r" : "qr";
        } else {
          const match = keyPart.match(/^([a-gA-G])([#b]?)(\d?)$/);
          if (match) {
            const noteName = match[1].toLowerCase();
            const acc = match[2];
            const octave = match[3] || "4";
            keys = [`${noteName}${acc}/${octave}`];
            if (acc) accidental = acc;
          }
        }
      }
      if (parts.length > 1) {
        let durPart = parts[1];
        if (durPart.includes('d')) {
          dot = true;
          durPart = durPart.replace('d', '');
        }
        if (keys[0] === "b/4" && !durPart.endsWith('r')) {
          duration = durPart + "r";
        } else {
          duration = durPart;
        }
      }
      return { keys, duration, accidental, dot, isValid: validDurations.includes(duration) };
    }).filter(n => n.isValid);
  };

  const renderScore = useCallback(() => {
    if (!scoreOutputRef.current) return;

    // Clear previous
    scoreOutputRef.current.innerHTML = '';
    setError(null);

    try {
      const parsedNotes = parseMusicString(notation);

      // Group Measures
      const measures: ParsedNote[][] = [];
      let currentMeasure: ParsedNote[] = [];
      let currentBeats = 0;
      const BEATS_PER_MEASURE = 4;

      parsedNotes.forEach((note) => {
        const noteBeats = getBeats(note.duration, note.dot);
        if (currentBeats + noteBeats > BEATS_PER_MEASURE + 0.01) {
          measures.push(currentMeasure);
          currentMeasure = [];
          currentBeats = 0;
        }
        currentMeasure.push(note);
        currentBeats += noteBeats;
      });
      if (currentMeasure.length > 0) measures.push(currentMeasure);

      // Handle empty
      if (measures.length === 0) measures.push([{ keys: ["b/4"], duration: "wr", dot: false, isValid: true }]);

      // Calculate Layout
      const numLines = Math.ceil(measures.length / MEASURES_PER_LINE);
      const contentHeight = TOP_PADDING + (numLines * STAVE_VERTICAL_SPACING) + 100;
      const finalHeight = Math.max(A4_HEIGHT, contentHeight);

      // Init VexFlow Renderer
      const renderer = new Renderer(scoreOutputRef.current, Renderer.Backends.SVG);
      renderer.resize(A4_WIDTH, finalHeight);
      const ctx = renderer.getContext();

      // Draw Title
      ctx.save();
      // @ts-ignore - VexFlow types might be incomplete for setFont
      ctx.setFont("Lobster", 60, "normal");
      ctx.setFillStyle("#0288d1");
      const text = title || "Sem Título";
      // Simple centering approximation as measureText might vary
      const textWidth = text.length * 30;
      ctx.fillText(text, (A4_WIDTH - textWidth) / 2, 100);
      ctx.restore();

      // Draw Footer - REMOVED


      // Loop and Draw Measures
      const STAVE_WIDTH = (A4_WIDTH - (MARGIN_X * 2)) / MEASURES_PER_LINE;

      measures.forEach((measureNotes, index) => {
        const lineIndex = Math.floor(index / MEASURES_PER_LINE);
        const measureIndexInLine = index % MEASURES_PER_LINE;
        const x = MARGIN_X + (measureIndexInLine * STAVE_WIDTH);
        const y = TOP_PADDING + (lineIndex * STAVE_VERTICAL_SPACING);

        const stave = new Stave(x, y, STAVE_WIDTH);
        if (measureIndexInLine === 0) stave.addClef("treble");
        if (index === 0) stave.addTimeSignature("4/4");
        stave.setContext(ctx).draw();

        const vexNotes = measureNotes.map(pn => {
          const note = new StaveNote({
            keys: pn.keys,
            duration: pn.duration,
            autoStem: true,
          });
          if (pn.accidental) note.addModifier(new Accidental(pn.accidental));
          if (pn.dot) note.addModifier(new Dot());

          if (pn.keys[0] !== "b/4") {
            const color = getNoteColor(pn.keys[0]);
            note.setStyle({ fillStyle: color, strokeStyle: color });
          } else {
            note.setStyle({ fillStyle: "#666666", strokeStyle: "#666666" });
          }
          return note;
        });

        const voice = new Voice({ numBeats: 4, beatValue: 4 });
        voice.setStrict(false);
        voice.addTickables(vexNotes);

        const formatter = new Formatter();
        const availableWidth = STAVE_WIDTH - (measureIndexInLine === 0 ? 50 : 10);
        formatter.joinVoices([voice]).format([voice], availableWidth);

        voice.draw(ctx, stave);

        const beams = Beam.generateBeams(vexNotes);
        beams.forEach(beam => {
          beam.setStyle({ fillStyle: "#333333", strokeStyle: "#333333" });
          beam.setContext(ctx).draw();
        });
      });

    } catch (e) {
      console.error(e);
      setError("Erro na sintaxe musical.");
    }
  }, [notation, title]);

  useEffect(() => {
    renderScore();
  }, [renderScore]);

  const handlePrint = () => {
    window.print();
  };

  const clearEditor = () => {
    setNotation("");
    setTitle("Sem Título");
  };

  return (
    <div className="w-full h-full flex flex-col bg-gradient-to-br from-[#4fc3f7] to-[#0288d1] p-4 lg:p-8 rounded-3xl overflow-hidden">

      {/* Header */}
      <header className="shrink-0 w-full max-w-7xl mx-auto mb-6 flex justify-end items-center z-20 print:hidden">
        <DownloadMenu
          options={[
            {
              label: "Imprimir / PDF",
              subLabel: "Salvar como PDF",
              icon: <Printer size={20} />,
              onClick: handlePrint,
              colorClass: "text-blue-600 bg-blue-100",
            },
          ]}
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row gap-6 max-w-[1600px] mx-auto w-full overflow-hidden">

        {/* Left Panel: Controls */}
        <div className="w-full lg:w-[350px] shrink-0 flex flex-col gap-6 z-10 h-full overflow-hidden print:hidden">

          {/* Navigation Tabs */}
          <div className="flex bg-white/40 p-1.5 rounded-full backdrop-blur-sm shadow-sm border border-white/30">
            <button
              onClick={() => setActiveTab('editor')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-lg font-lobster transition-all duration-300 ${activeTab === 'editor' ? 'bg-white text-[#0288d1] shadow-md scale-100' : 'text-white hover:bg-white/20'}`}
            >
              <Type className="w-5 h-5" /> Editor
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-lg font-lobster transition-all duration-300 ${activeTab === 'guide' ? 'bg-white text-[#4caf50] shadow-md scale-100' : 'text-white hover:bg-white/20'}`}
            >
              <BookOpen className="w-5 h-5" /> Guia
            </button>
          </div>

          {/* Panel Body */}
          <div className="flex-1 bg-[rgba(255,255,255,0.95)] backdrop-blur rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-4 border-white/50 p-6 flex flex-col overflow-y-auto custom-scrollbar">

            {/* Editor View */}
            {activeTab === 'editor' && (
              <div className="flex flex-col gap-6 h-full animate-fade-in">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-[#0288d1] uppercase tracking-widest ml-1">Título da Música</label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full font-lobster text-2xl px-5 py-3 bg-[#f1f8ff] border-2 border-[#e1f5fe] text-[#01579b] rounded-2xl focus:outline-none focus:border-[#039be5] focus:ring-4 focus:ring-[#e1f5fe] transition-all placeholder-blue-200"
                    placeholder="Digite o título..."
                  />
                </div>

                <div className="flex flex-col gap-2 flex-1 min-h-[300px]">
                  <div className="flex justify-between items-center ml-1">
                    <label className="text-xs font-bold text-[#0288d1] uppercase tracking-widest">Notas Musicais</label>
                    <button
                      onClick={clearEditor}
                      className="text-xs font-bold text-red-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                      <Eraser className="w-3 h-3" /> Limpar
                    </button>
                  </div>
                  <textarea
                    value={notation}
                    onChange={(e) => setNotation(e.target.value)}
                    spellCheck={false}
                    className="w-full flex-1 bg-[#f1f8ff] text-slate-600 p-5 rounded-2xl border-2 border-[#e1f5fe] focus:border-[#039be5] focus:ring-4 focus:ring-[#e1f5fe] focus:outline-none font-mono text-sm leading-loose resize-none shadow-inner transition-all"
                    placeholder="Ex: C4/q D4/q E4/q..."
                  />
                  <p className="text-xs text-slate-400 font-medium ml-1">
                    Dica: Use C, D, E, F, G, A, B para notas e R para pausas.
                  </p>
                </div>
              </div>
            )}

            {/* Guide View */}
            {activeTab === 'guide' && (
              <div className="flex flex-col gap-8 animate-fade-in">
                {/* Colors */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#e91e63] border-b-2 border-[#fce4ec] pb-2">
                    <div className="p-1.5 bg-[#fce4ec] rounded-lg"><Type className="w-4 h-4" /></div>
                    <span className="text-sm font-bold uppercase tracking-widest">Cores das Notas</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(NOTE_COLORS).map(([note, color]) => (
                      <div key={note} className="flex items-center gap-3 p-3 rounded-xl bg-purple-100 border border-white/50 shadow-sm">
                        <div className="w-6 h-6 rounded-full shadow-inner border-2 border-white/50" style={{ backgroundColor: color }}></div>
                        <span className="text-sm font-bold text-slate-600 uppercase">{note}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rhythms */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[#009688] border-b-2 border-[#e0f2f1] pb-2">
                    <div className="p-1.5 bg-[#e0f2f1] rounded-lg"><BookOpen className="w-4 h-4" /></div>
                    <span className="text-sm font-bold uppercase tracking-widest">Figuras Rítmicas</span>
                  </div>
                  <div className="rounded-xl border-2 border-[#e0f2f1] overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-[#e0f2f1] text-[#00695c] uppercase text-xs font-bold">
                        <tr>
                          <th className="px-3 py-3 text-left">Símbolo</th>
                          <th className="px-3 py-3 text-left">Nome</th>
                          <th className="px-3 py-3 text-center">Nota</th>
                          <th className="px-3 py-3 text-center">Pausa</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 bg-white">
                        <tr>
                          <td className="px-3 py-2 text-2xl text-center text-slate-600">𝅝</td>
                          <td className="px-3 py-2 font-medium text-slate-700">Semibreve</td>
                          <td className="px-3 py-2 text-center"><code className="bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold border border-blue-100">w</code></td>
                          <td className="px-3 py-2 text-center"><code className="bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold border border-slate-200">wr</code></td>
                        </tr>
                        {/* Add more rows as needed */}
                        <tr className="bg-slate-50/50">
                          <td className="px-3 py-2 text-2xl text-center text-slate-600">𝅗𝅥</td>
                          <td className="px-3 py-2 font-medium text-slate-700">Mínima</td>
                          <td className="px-3 py-2 text-center"><code className="bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold border border-blue-100">h</code></td>
                          <td className="px-3 py-2 text-center"><code className="bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold border border-slate-200">hr</code></td>
                        </tr>
                        <tr>
                          <td className="px-3 py-2 text-2xl text-center text-slate-600">♩</td>
                          <td className="px-3 py-2 font-medium text-slate-700">Semínima</td>
                          <td className="px-3 py-2 text-center"><code className="bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold border border-blue-100">q</code></td>
                          <td className="px-3 py-2 text-center"><code className="bg-slate-100 text-slate-500 px-2 py-1 rounded font-bold border border-slate-200">qr</code></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Preview */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10 print:w-full print:absolute print:top-0 print:left-0 print:m-0">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 left-0 h-12 bg-white/20 rounded-t-[2rem] translate-y-4 scale-[0.98] -z-10 print:hidden"></div>

          <div className="flex-1 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col border-4 border-white print:shadow-none print:border-0 print:rounded-none">
            <div className="bg-slate-50 border-b border-slate-100 p-3 px-6 flex justify-between items-center print:hidden">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400"></span> Visualização A4
              </span>
              <span className="text-xs font-mono text-slate-300">210mm x 297mm</span>
            </div>

            <div className="flex-1 overflow-auto custom-scrollbar bg-slate-100/50 p-8 lg:p-12 flex justify-center items-start relative print:bg-white print:p-0 print:overflow-visible">

              {/* Error Message */}
              {error && (
                <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-red-500 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-2 animate-bounce font-bold text-sm print:hidden">
                  <span>⚠️ {error}</span>
                </div>
              )}

              {/* Printable Container */}
              <div
                ref={scoreOutputRef}
                className="bg-white shadow-2xl relative transition-transform duration-300 origin-top print:shadow-none print:w-full"
                style={{ width: '794px', minHeight: '1123px' }}
              >
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};
