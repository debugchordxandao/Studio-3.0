import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import { Watermark } from './Watermark';

interface EditorPageProps {
    id: string;
}

export interface EditorHandle {
    focus: () => void;
    insertHtmlAtCursor: (html: string) => void;
}

export const EditorPage = forwardRef<EditorHandle, EditorPageProps>(({ id }, ref) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const savedRange = useRef<Range | null>(null);

    const saveSelection = () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            if (contentRef.current && contentRef.current.contains(range.commonAncestorContainer)) {
                savedRange.current = range.cloneRange();
            }
        }
    };

    useImperativeHandle(ref, () => ({
        focus: () => contentRef.current?.focus(),
        insertHtmlAtCursor: (html: string) => {
            contentRef.current?.focus();
            const sel = window.getSelection();
            if (!sel) return;
            if (savedRange.current) {
                sel.removeAllRanges();
                sel.addRange(savedRange.current);
            }
            document.execCommand('insertHTML', false, html);
            saveSelection();
        }
    }));

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, text);
    };

    const handleInteract = () => saveSelection();

    return (
        <div className="relative w-full flex justify-center pb-20">
            <div
                id={id}
                className="relative bg-white w-full max-w-[210mm] min-h-[297mm] shadow-2xl md:mx-auto transform transition-transform lesson-editor-watermark"
            >
                <Watermark />
                <div
                    ref={contentRef}
                    contentEditable
                    onPaste={handlePaste}
                    onBlur={handleInteract}
                    onKeyUp={handleInteract}
                    onMouseUp={handleInteract}
                    className="relative z-10 w-full h-full min-h-[297mm] p-[20mm] outline-none font-poppins text-gray-800 prose prose-lg max-w-none selection:bg-sky-500/20"
                    style={{ lineHeight: '1.6' }}
                    suppressContentEditableWarning={true}
                >
                    <h2 className="text-4xl font-lobster text-sky-500 text-center mb-8">Título da Aula</h2>
                    <p>Clique aqui para começar a escrever sua aula...</p>
                    <p>Utilize a barra lateral para inserir diagramas de acordes!</p>
                    <p><br /></p>
                </div>
                <div className="absolute bottom-0 w-full h-4 bg-gradient-to-r from-purple-500 via-sky-500 to-green-500 opacity-80"></div>
            </div>
        </div>
    );
});
EditorPage.displayName = 'EditorPage';
