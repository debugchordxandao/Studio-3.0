import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import { STARKIDS_PALETTE } from '../constants';

interface EditorProps {
  // props
}

export interface EditorRef {
  insertImage: (dataUrl: string) => void;
}

const Editor = forwardRef<EditorRef, EditorProps>((props, ref) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    insertImage: (dataUrl: string) => {
      const editor = editorRef.current;
      if (!editor) return;

      editor.focus();
      document.execCommand('insertImage', false, dataUrl);
    }
  }));

  // Initialize with some content
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === "") {
        editorRef.current.innerHTML = `
            <h1 style="text-align: center; color: #0277bd; font-family: 'Lobster', cursive; font-size: 36px;">Nova Aula</h1>
            <p style="font-family: 'Poppins', sans-serif; font-size: 16px;">Clique aqui para começar a escrever sua aula...</p>
            <br>
        `;
    }
  }, []);

  // Toolbar Helpers
  const exec = (command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    // Keep focus on editor after click
    if(editorRef.current) editorRef.current.focus();
  };

  const preventLoseFocus = (e: React.MouseEvent) => {
    e.preventDefault();
  };

  return (
    <div className="flex flex-col items-center w-full h-full relative">
      
      {/* --- FLOATING TOOLBAR (PILL STYLE) --- */}
      <div 
        className="sticky top-6 z-50 bg-white rounded-full shadow-xl border border-gray-200 px-6 py-3 flex items-center gap-6 animate-slide-up transform transition-all hover:scale-[1.01]"
      >
        {/* Group 1: Styles (B I U) */}
        <div className="flex items-center gap-1 bg-blue-50 p-1 rounded-full px-3">
          <button 
            onMouseDown={preventLoseFocus}
            onClick={() => exec('bold')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm font-serif font-bold text-gray-700 transition-all"
            title="Negrito"
          >
            B
          </button>
          <button 
            onMouseDown={preventLoseFocus}
            onClick={() => exec('italic')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm font-serif italic text-gray-700 transition-all"
            title="Itálico"
          >
            I
          </button>
          <button 
            onMouseDown={preventLoseFocus}
            onClick={() => exec('underline')}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white hover:shadow-sm font-serif underline text-gray-700 transition-all"
            title="Sublinhado"
          >
            U
          </button>
        </div>

        <div className="w-[1px] h-8 bg-gray-200"></div>

        {/* Group 2: Font Size (T | A A A) */}
        <div className="flex items-center gap-2 bg-blue-50 p-1 rounded-full px-4">
          <span className="text-gray-400 font-mono text-xs mr-2 border-r border-gray-300 pr-3 h-4 flex items-center">T</span>
          
          <button 
            onMouseDown={preventLoseFocus}
            onClick={() => exec('fontSize', '2')} 
            className="text-xs font-bold text-gray-600 hover:text-starkids-blue transition-colors px-1"
            title="Pequeno"
          >
            A
          </button>
          <button 
            onMouseDown={preventLoseFocus}
            onClick={() => exec('fontSize', '3')} 
            className="text-base font-bold text-gray-600 hover:text-starkids-blue transition-colors px-1"
            title="Normal"
          >
            A
          </button>
          <button 
            onMouseDown={preventLoseFocus}
            onClick={() => exec('fontSize', '6')} 
            className="text-xl font-bold text-gray-600 hover:text-starkids-blue transition-colors px-1"
            title="Grande"
          >
            A
          </button>
        </div>

        <div className="w-[1px] h-8 bg-gray-200"></div>

        {/* Group 3: Colors */}
        <div className="flex items-center gap-2">
           {[
             { color: '#000000', name: 'Preto' },
             { color: '#8a2be2', name: 'Roxo' },
             { color: '#039be5', name: 'Azul' },
             { color: '#e57373', name: 'Salmão' },
             { color: '#43a047', name: 'Verde' },
             { color: '#fdd835', name: 'Amarelo' },
             { color: '#fb8c00', name: 'Laranja' },
             { color: '#d32f2f', name: 'Vermelho' },
           ].map((c) => (
             <button
               key={c.color}
               onMouseDown={preventLoseFocus}
               onClick={() => exec('foreColor', c.color)}
               className="w-6 h-6 rounded-full border border-gray-200 shadow-sm hover:scale-125 transition-transform"
               style={{ backgroundColor: c.color }}
               title={c.name}
             />
           ))}
        </div>

      </div>

      {/* --- EDITOR AREA --- */}
      <div className="w-full flex-1 overflow-y-auto p-8 custom-scroll flex justify-center bg-gray-200/50">
        {/* A4 Paper Simulation */}
        <div 
          ref={editorRef}
          contentEditable
          className="bg-white shadow-2xl w-full max-w-[800px] min-h-[1100px] p-12 outline-none font-poppins text-gray-800 mt-4 mb-20"
          style={{
              width: '210mm',
              minHeight: '297mm',
          }}
          onKeyDown={(e) => {
              if (e.key === 'Tab') {
                  e.preventDefault();
                  document.execCommand('insertText', false, '    ');
              }
          }}
        />
      </div>
    </div>
  );
});

Editor.displayName = 'Editor';
export default Editor;