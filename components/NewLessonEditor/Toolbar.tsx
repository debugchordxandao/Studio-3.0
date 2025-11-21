import React from 'react';
import { STARKIDS_COLORS, FONT_SIZES } from './types';
import { Bold, Italic, Underline, Type } from 'lucide-react';

interface ToolbarProps {
  onExecCommand: (command: string, value?: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onExecCommand }) => {
  return (
    <div className="relative z-10 bg-white p-4 rounded-[30px] shadow-xl border-4 border-white flex flex-wrap gap-4 items-center justify-center w-full max-w-4xl mx-auto mb-8 transition-all">

      {/* Text Formatting Group */}
      <div className="flex items-center gap-2 bg-sky-50 px-3 py-2 rounded-full border border-sky-100">
        <button onClick={() => onExecCommand('bold')} className="p-2 hover:bg-white hover:text-starkids-blue rounded-full transition-colors text-gray-600" title="Negrito">
          <Bold size={20} />
        </button>
        <button onClick={() => onExecCommand('italic')} className="p-2 hover:bg-white hover:text-starkids-blue rounded-full transition-colors text-gray-600" title="Itálico">
          <Italic size={20} />
        </button>
        <button onClick={() => onExecCommand('underline')} className="p-2 hover:bg-white hover:text-starkids-blue rounded-full transition-colors text-gray-600" title="Sublinhado">
          <Underline size={20} />
        </button>
      </div>

      {/* Font Size Group */}
      <div className="flex items-center gap-2 bg-sky-50 px-3 py-2 rounded-full border border-sky-100">
        <Type size={18} className="text-gray-400 ml-1" />
        <div className="h-6 w-px bg-gray-200 mx-1"></div>
        {FONT_SIZES.map((size) => (
          <button
            key={size.value}
            onClick={() => onExecCommand('fontSize', size.value)}
            className={`font-poppins font-semibold text-gray-600 hover:text-starkids-purple transition-colors px-2 ${size.value === '3' ? 'text-sm' : size.value === '5' ? 'text-lg' : 'text-2xl'}`}
            title={`Tamanho: ${size.label}`}
          >
            A
          </button>
        ))}
      </div>

      <div className="hidden md:block h-8 w-px bg-gray-200"></div>

      {/* Color Picker Group */}
      <div className="flex items-center gap-3 flex-wrap justify-center">
        {STARKIDS_COLORS.map((color) => (
          <button
            key={color.name}
            onClick={() => onExecCommand('foreColor', color.hex)}
            className="w-8 h-8 rounded-full border-2 border-white shadow-sm hover:scale-125 transition-transform duration-200 ring-2 ring-transparent hover:ring-gray-200 focus:outline-none"
            style={{ backgroundColor: color.hex }}
            title={color.label}
          />
        ))}
      </div>
    </div>
  );
};