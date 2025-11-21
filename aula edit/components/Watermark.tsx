import React from 'react';

export const Watermark: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-[0.08] overflow-hidden">
        <svg viewBox="0 0 200 200" className="w-[80%] h-[80%] text-starkids-blue fill-current">
           <path d="M100 10 L125 70 L190 75 L145 120 L160 185 L100 155 L40 185 L55 120 L10 75 L75 70 Z" />
        </svg>
    </div>
  );
};