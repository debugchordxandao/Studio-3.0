import React, { useState, useRef } from 'react';
import ChordPanel from './components/ChordPanel';
import TabPanel from './components/TabPanel';
import TextTabPanel from './components/TextTabPanel';
import RhythmPanel from './components/RhythmPanel';
import Editor, { EditorRef } from './components/Editor';

enum ToolTab {
  CHORDS = 'chords',
  TABS = 'tabs',
  TEXT_IMPORT = 'text',
  RHYTHMS = 'rhythms'
}

export default function App() {
  const [activeTab, setActiveTab] = useState<ToolTab>(ToolTab.CHORDS);
  const editorRef = useRef<EditorRef>(null);

  const handleInsert = (dataUrl: string) => {
    if (editorRef.current) {
      editorRef.current.insertImage(dataUrl);
    }
  };

  return (
    <div className="h-screen w-full flex overflow-hidden bg-gradient-to-b from-skyStart to-skyEnd">
      
      {/* Sidebar */}
      <aside className="w-full md:w-[400px] bg-white/95 backdrop-blur-sm shadow-2xl flex flex-col z-10 flex-shrink-0 border-r border-white/50">
        {/* Header */}
        <div className="p-5 pb-2 text-center border-b border-starkids-blue/20">
          <h1 className="font-lobster text-4xl text-starkids-blueDark drop-shadow-sm">Starkids</h1>
          <p className="font-poppins text-xs text-starkids-purple font-bold tracking-wider uppercase mt-1">Editor de Aulas</p>
        </div>

        {/* Tabs Toggle - Agora com 4 colunas */}
        <div className="grid grid-cols-4 p-2 gap-1 bg-gray-50/50">
          <button 
            onClick={() => setActiveTab(ToolTab.CHORDS)}
            className={`py-2 rounded-lg font-lobster text-sm md:text-base transition-all leading-tight ${
              activeTab === ToolTab.CHORDS 
              ? 'bg-starkids-blue text-white shadow-md scale-100 z-10' 
              : 'text-starkids-blue hover:bg-blue-50 scale-95 opacity-70'
            }`}
            title="Acordes"
          >
            Acordes
          </button>
          <button 
            onClick={() => setActiveTab(ToolTab.TABS)}
            className={`py-2 rounded-lg font-lobster text-sm md:text-base transition-all leading-tight ${
              activeTab === ToolTab.TABS 
              ? 'bg-starkids-orange text-white shadow-md scale-100 z-10' 
              : 'text-starkids-orange hover:bg-orange-50 scale-95 opacity-70'
            }`}
            title="Grade"
          >
            Grade
          </button>
          <button 
            onClick={() => setActiveTab(ToolTab.TEXT_IMPORT)}
            className={`py-2 rounded-lg font-lobster text-sm md:text-base transition-all leading-tight ${
              activeTab === ToolTab.TEXT_IMPORT 
              ? 'bg-starkids-purple text-white shadow-md scale-100 z-10' 
              : 'text-starkids-purple hover:bg-purple-50 scale-95 opacity-70'
            }`}
            title="Texto"
          >
            Texto
          </button>
          <button 
            onClick={() => setActiveTab(ToolTab.RHYTHMS)}
            className={`py-2 rounded-lg font-lobster text-sm md:text-base transition-all leading-tight ${
              activeTab === ToolTab.RHYTHMS 
              ? 'bg-starkids-green text-white shadow-md scale-100 z-10' 
              : 'text-starkids-green hover:bg-green-50 scale-95 opacity-70'
            }`}
            title="Ritmos"
          >
            Ritmos
          </button>
        </div>

        {/* Tool Content */}
        <div className="flex-1 overflow-y-auto p-4 custom-scroll flex flex-col">
           
           {/* Acordes */}
           <div className={`flex-1 ${activeTab === ToolTab.CHORDS ? 'block' : 'hidden'}`}>
              <ChordPanel onInsert={handleInsert} />
              <div className="mt-6 p-3 bg-yellow-50 rounded-xl border border-yellow-200 text-xs font-poppins text-yellow-800">
                <p className="font-bold mb-1">💡 Dica:</p>
                Escolha o acorde e insira. Ideal para cifras.
              </div>
           </div>

           {/* Grade Manual */}
           <div className={`flex-1 ${activeTab === ToolTab.TABS ? 'block' : 'hidden'}`}>
              <TabPanel onInsert={handleInsert} />
              <div className="mt-6 p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs font-poppins text-blue-800">
                <p className="font-bold mb-1">🎸 Grade Manual:</p>
                Digite casa por casa. Ótimo para riffs curtos.
              </div>
           </div>

           {/* Texto ASCII */}
           <div className={`flex-1 flex flex-col ${activeTab === ToolTab.TEXT_IMPORT ? 'flex' : 'hidden'}`}>
              <TextTabPanel onInsert={handleInsert} />
              <div className="mt-6 p-3 bg-purple-50 rounded-xl border border-purple-200 text-xs font-poppins text-purple-800">
                <p className="font-bold mb-1">📄 Texto da Internet:</p>
                Cole tablaturas do CifraClub ou sites similares aqui. O sistema corrige o alinhamento automaticamente!
              </div>
           </div>

           {/* Ritmos */}
           <div className={`flex-1 flex flex-col ${activeTab === ToolTab.RHYTHMS ? 'flex' : 'hidden'}`}>
              <RhythmPanel onInsert={handleInsert} />
              <div className="mt-6 p-3 bg-green-50 rounded-xl border border-green-200 text-xs font-poppins text-green-800">
                <p className="font-bold mb-1">🥁 Levadas:</p>
                Monte o padrão rítmico da música usando as setas.
              </div>
           </div>

        </div>
        
        {/* Footer */}
        <div className="p-3 text-center border-t border-gray-100 bg-white">
          <p className="text-[10px] text-gray-400 font-poppins">v2.2 • Design by Starkids Dev</p>
        </div>
      </aside>

      {/* Main Content (Editor) */}
      <main className="flex-1 relative overflow-hidden flex flex-col items-center bg-gray-200/50">
        <Editor ref={editorRef} />
        
        {/* Floating Logo */}
        <div className="absolute bottom-5 right-10 opacity-5 pointer-events-none select-none">
           <div className="font-lobster text-8xl text-starkids-blue">Starkids</div>
        </div>
      </main>
    </div>
  );
}