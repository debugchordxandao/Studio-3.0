import React, { useState, useRef, useEffect } from 'react';
import { Toolbar } from './Toolbar';
import { EditorPage, EditorHandle } from './EditorPage';
import { ChordSidebar } from './ChordSidebar';
import { exportAsPDF, exportAsPNG, exportAsDOCX } from './services/exportService';
import { Download, FileText, Image as ImageIcon, File as FileIcon, ChevronDown } from 'lucide-react';

export const NewLessonEditor: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const editorRef = useRef<EditorHandle>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleExecCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleExport = async (type: 'pdf' | 'png' | 'docx') => {
        setIsMenuOpen(false);
        setIsExporting(true);
        setTimeout(async () => {
            try {
                if (type === 'pdf') await exportAsPDF('print-area', 'Aula_Starkids.pdf');
                else if (type === 'png') await exportAsPNG('print-area', 'Aula_Starkids.png');
                else if (type === 'docx') exportAsDOCX('print-area', 'Aula_Starkids.docx');
            } catch (e) {
                console.error(e);
            } finally {
                setIsExporting(false);
            }
        }, 100);
    };

    const handleInsertChord = (imageSrc: string) => {
        const imgHtml = `<img src="${imageSrc}" style="height: 50px; vertical-align: middle; margin: 0 4px; display: inline-block;" alt="acorde" />&nbsp;`;
        editorRef.current?.insertHtmlAtCursor(imgHtml);
    };

    return (
        <div className="w-full flex flex-col items-center py-4 px-0 md:px-4 print:p-0 print:bg-white">
            <header className="w-full max-w-[1400px] flex flex-col md:flex-row justify-end items-center mb-8 gap-6 z-50 relative">
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        disabled={isExporting}
                        className={`font-lobster text-xl px-6 py-3 rounded-full text-white transition-all duration-200 transform flex items-center gap-2 bg-orange-500 shadow-[0_4px_0_#e65100] hover:-translate-y-1 hover:shadow-[0_6px_0_#e65100] active:translate-y-1 active:shadow-none disabled:opacity-70 disabled:cursor-not-allowed`}
                    >
                        {isExporting ? <span className="animate-bounce">Exportando...</span> : <><FileIcon size={24} /> Arquivo <ChevronDown size={20} className={`transition-transform ${isMenuOpen ? 'rotate-180' : ''}`} /></>}
                    </button>
                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border-2 border-sky-100 overflow-hidden animate-in fade-in z-50">
                            <div className="p-2 flex flex-col gap-1">
                                <button onClick={() => handleExport('pdf')} className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-sky-50 rounded-lg transition-colors font-poppins text-gray-700">
                                    <div className="bg-red-100 p-2 rounded-lg text-red-600"><Download size={20} /></div>
                                    <div><span className="block font-bold text-sm">Baixar PDF</span><span className="block text-xs text-gray-400">Impressão A4</span></div>
                                </button>
                                <button onClick={() => handleExport('png')} className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-sky-50 rounded-lg transition-colors font-poppins text-gray-700">
                                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><ImageIcon size={20} /></div>
                                    <div><span className="block font-bold text-sm">Baixar Imagem</span><span className="block text-xs text-gray-400">Formato PNG</span></div>
                                </button>
                                <button onClick={() => handleExport('docx')} className="flex items-center gap-3 w-full px-4 py-3 text-left hover:bg-sky-50 rounded-lg transition-colors font-poppins text-gray-700">
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FileText size={20} /></div>
                                    <div><span className="block font-bold text-sm">Baixar Word</span><span className="block text-xs text-gray-400">Documento Editável</span></div>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </header>

            <div className="w-full max-w-[1400px] flex flex-col gap-8">
                <Toolbar onExecCommand={handleExecCommand} />
                <div className="flex flex-col md:flex-row gap-8 items-start justify-center w-full">
                    <aside className="order-2 md:order-1 w-full md:w-auto flex justify-center md:block z-40">
                        <ChordSidebar onInsert={handleInsertChord} />
                    </aside>
                    <main className="order-1 md:order-2 flex-1 w-full flex justify-center">
                        <EditorPage id="print-area" ref={editorRef} />
                    </main>
                </div>
            </div>

            <footer className="mt-12 text-center font-poppins text-slate-400 font-medium drop-shadow-md pb-8">
                <p>Editor de Aulas Interativo • Starkids Studio</p>
            </footer>
        </div>
    );
};
