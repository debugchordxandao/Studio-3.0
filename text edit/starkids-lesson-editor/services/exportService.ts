import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { asBlob } from 'html-docx-js-typescript';

// Helper to trigger download
const downloadFile = (blob: Blob, fileName: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const exportAsPDF = async (elementId: string, fileName: string = 'aula-starkids.pdf') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });

    const imgWidth = 210; // A4 mm
    const pageHeight = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(fileName);
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Erro ao gerar PDF.');
  }
};

export const exportAsPNG = async (elementId: string, fileName: string = 'aula-starkids.png') => {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    
    canvas.toBlob((blob) => {
      if (blob) downloadFile(blob, fileName);
    });
  } catch (error) {
    console.error('Error generating PNG:', error);
    alert('Erro ao gerar Imagem.');
  }
};

export const exportAsDOCX = (editorId: string, fileName: string = 'aula-starkids.docx') => {
    const sourceDiv = document.querySelector(`#${editorId} [contenteditable="true"]`) as HTMLElement;
    if (!sourceDiv) {
        alert('Editor content not found');
        return;
    }

    // Create a clone to manipulate for export without affecting the view
    const clone = sourceDiv.cloneNode(true) as HTMLElement;

    // Function to inline styles for Word compatibility
    const traverseAndApply = (original: HTMLElement, clonedNode: HTMLElement) => {
        if (original.nodeType === 1) { // Element node
            const computed = window.getComputedStyle(original);
            
            clonedNode.style.color = computed.color;
            clonedNode.style.fontSize = computed.fontSize;
            clonedNode.style.fontWeight = computed.fontWeight;
            clonedNode.style.textAlign = computed.textAlign;
            clonedNode.style.textDecoration = computed.textDecoration;
            
            // Font substitution for Word (Lobster -> Comic Sans or standard cursive)
            if (computed.fontFamily.includes('Lobster')) {
                 clonedNode.style.fontFamily = "'Comic Sans MS', cursive";
                 // Often lobster is blue in our app
                 if (!clonedNode.style.color) clonedNode.style.color = '#039be5'; 
            } else {
                 clonedNode.style.fontFamily = "'Arial', sans-serif";
            }
        }

        for (let i = 0; i < original.childNodes.length; i++) {
            if (original.childNodes[i].nodeType === 1) {
                traverseAndApply(original.childNodes[i] as HTMLElement, clonedNode.childNodes[i] as HTMLElement);
            }
        }
    };

    traverseAndApply(sourceDiv, clone);

    const contentHtml = clone.innerHTML;

    const fullHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: 'Arial', sans-serif; font-size: 12pt; color: #333; }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body>
        ${contentHtml}
      </body>
      </html>
    `;

    try {
        asBlob(fullHtml, {
            orientation: 'portrait',
            margins: { top: 720, right: 720, bottom: 720, left: 720 } 
        }).then((blob: Blob | MediaSource) => {
            downloadFile(blob as Blob, fileName);
        });
    } catch (e) {
        console.error(e);
        alert("Erro ao gerar arquivo Word.");
    }
};