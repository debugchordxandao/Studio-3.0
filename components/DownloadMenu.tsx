import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, File as FileIcon } from 'lucide-react';

interface DownloadOption {
    label: string;
    subLabel?: string;
    icon: React.ReactNode;
    onClick: () => void;
    colorClass: string; // e.g. "text-red-600 bg-red-100"
}

interface DownloadMenuProps {
    options: DownloadOption[];
    disabled?: boolean;
    isExporting?: boolean;
    label?: string;
}

export const DownloadMenu: React.FC<DownloadMenuProps> = ({
    options,
    disabled,
    isExporting,
    label = "Arquivo"
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative z-50" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled || isExporting}
                className={`font-lobster text-xl px-6 py-3 rounded-full text-white transition-all duration-200 transform flex items-center gap-2 bg-orange-500 shadow-[0_4px_0_#e65100] hover:-translate-y-1 hover:shadow-[0_6px_0_#e65100] active:translate-y-1 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed`}
            >
                {isExporting ? (
                    <span className="animate-bounce">Processando...</span>
                ) : (
                    <>
                        <FileIcon size={24} /> {label}
                        <ChevronDown size={20} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                    </>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border-2 border-sky-100 overflow-hidden animate-in fade-in z-50">
                    <div className="p-2 flex flex-col gap-1">
                        {options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    option.onClick();
                                    setIsOpen(false);
                                }}
                                className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-sky-50 rounded-lg transition-colors font-poppins text-gray-700 group"
                            >
                                <div className={`p-2 rounded-lg ${option.colorClass} group-hover:scale-110 transition-transform`}>
                                    {option.icon}
                                </div>
                                <div>
                                    <span className="block font-bold text-sm">{option.label}</span>
                                    {option.subLabel && <span className="block text-xs text-gray-400">{option.subLabel}</span>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
