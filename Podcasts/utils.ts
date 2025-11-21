
/**
 * Extrai o ID do YouTube de qualquer formato de link.
 */
export const getYouTubeId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

/**
 * Extrai o ID do Google Drive.
 * Suporta: /file/d/ID/view, open?id=ID, etc.
 */
export const getDriveId = (url: string): string | null => {
  if (!url) return null;
  
  // Padrão 1: .../file/d/ID...
  const matchFile = url.match(/\/d\/(.+?)(\/|$)/);
  if (matchFile && matchFile[1]) return matchFile[1];

  // Padrão 2: ...id=ID...
  const matchId = url.match(/id=(.+?)(&|$)/);
  if (matchId && matchId[1]) return matchId[1];

  return null;
};

/**
 * Detecta a fonte do vídeo baseada na URL
 */
export const getVideoSource = (url: string): 'youtube' | 'drive' | null => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('drive.google.com')) return 'drive';
  return null;
};

/**
 * Gera a URL de Embed apropriada baseada na fonte.
 */
export const getEmbedUrl = (url: string, source: 'youtube' | 'drive'): string => {
  if (source === 'youtube') {
    const id = getYouTubeId(url);
    if (!id) return '';
    return `https://www.youtube-nocookie.com/embed/${id}`;
  }

  if (source === 'drive') {
    const id = getDriveId(url);
    if (!id) return '';
    // Link de preview do Drive (funciona em iframe)
    return `https://drive.google.com/file/d/${id}/preview`;
  }

  return '';
};

/**
 * Converte link do Google Drive para link direto de download/stream (usado nos Podcasts).
 */
export const getDirectDriveLink = (url: string): string => {
  if (!url) return '';
  const id = getDriveId(url); // Reutiliza a função robusta acima
  if (id) {
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }
  return url;
};
