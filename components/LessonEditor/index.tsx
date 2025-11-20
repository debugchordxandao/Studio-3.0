import React, { useState, useRef, useEffect } from 'react';
import { Toolbar } from './Toolbar';
import { EditorPage, EditorHandle } from './EditorPage';
import { ChordSidebar } from './ChordSidebar';
import { exportAsPDF, exportAsPNG, exportAsDOCX } from './services/exportService';
import { Download, FileText, Image as ImageIcon, File as FileIcon, ChevronDown } from 'lucide-react';
import { DownloadMenu } from '../DownloadMenu';

export const LessonEditor: React.FC = () => {
    const [isExporting, setIsExporting] = useState(false);
    const editorRef = useRef<EditorHandle>(null);

    const handleExecCommand = (command: string, value?: string) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleExport = async (type: 'pdf' | 'png' | 'docx') => {
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
                <DownloadMenu
                    isExporting={isExporting}
                    options={[
                        {
                            label: "Baixar PDF",
                            subLabel: "Impressão A4",
                            icon: <Download size={20} />,
                            onClick: () => handleExport('pdf'),
                            colorClass: "bg-red-100 text-red-600",
                        },
                        {
                            label: "Baixar Imagem",
                            subLabel: "Formato PNG",
                            icon: <ImageIcon size={20} />,
                            onClick: () => handleExport('png'),
                            colorClass: "bg-purple-100 text-purple-600",
                        },
                        {
                            label: "Baixar Word",
                            subLabel: "Documento Editável",
                            icon: <FileText size={20} />,
                            onClick: () => handleExport('docx'),
                            colorClass: "bg-blue-100 text-blue-600",
                        },
                    ]}
                />
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
