
import React, { useState, useEffect } from 'react';
import { VideoLesson } from '../types';
import { getEmbedUrl, getYouTubeId, getDriveId, getVideoSource } from '../utils';

// ==============================================
// COMPONENTE CARD DE VÍDEO
// ==============================================
const VideoCard: React.FC<{ video: VideoLesson; onDelete: (id: string) => void }> = ({ video, onDelete }) => {
  const embedUrl = getEmbedUrl(video.videoUrl, video.source);

  if (!embedUrl) return null;

  return (
    <div className="bg-white rounded-[30px] shadow-lg border-4 border-white overflow-hidden flex flex-col transform transition-transform duration-300 hover:-translate-y-1 h-full">
      {/* Container do Vídeo (Aspect Ratio 16:9 fixo) */}
      <div className="relative w-full pt-[56.25%] bg-black">
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={embedUrl}
          title={video.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>

      {/* Rodapé do Card */}
      <div className="p-4 bg-skyStart/20 flex flex-col gap-3 flex-1 justify-between">
        <h3 className="font-lobster text-xl text-starkids-darkBlue leading-tight text-center line-clamp-2">
          {video.title}
        </h3>
        
        <button
          onClick={() => onDelete(video.id)}
          className="w-full font-lobster text-lg py-2 rounded-full text-white bg-starkids-red shadow-starkid shadow-red-800 hover:bg-red-600 active:translate-y-1 active:shadow-none transition-all"
        >
          🗑️ Excluir
        </button>
      </div>
    </div>
  );
};

// ==============================================
// COMPONENTE GALERIA PRINCIPAL
// ==============================================
const VideoGallery: React.FC = () => {
  const [videos, setVideos] = useState<VideoLesson[]>([]);
  const [inputUrl, setInputUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 1. Carregar vídeos salvos ao abrir a página
  useEffect(() => {
    const saved = localStorage.getItem('starkids_videos_v2'); // Chave nova para evitar conflito de tipo
    if (saved) {
      try {
        setVideos(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar vídeos salvos");
      }
    }
  }, []);

  // 2. Salvar vídeos sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('starkids_videos_v2', JSON.stringify(videos));
  }, [videos]);

  // Função para adicionar vídeo
  const handleAddVideo = async () => {
    const cleanUrl = inputUrl.trim();
    const source = getVideoSource(cleanUrl);

    // Validação de Fonte
    if (!source) {
      alert('Link não reconhecido! Use links do YouTube ou Google Drive.');
      return;
    }

    // Validação de ID
    let videoId = '';
    if (source === 'youtube') videoId = getYouTubeId(cleanUrl) || '';
    if (source === 'drive') videoId = getDriveId(cleanUrl) || '';

    if (!videoId) {
      alert(`Link inválido do ${source === 'youtube' ? 'YouTube' : 'Google Drive'}.`);
      return;
    }

    // Verifica duplicatas
    if (videos.some(v => v.videoUrl === cleanUrl)) {
      alert('Este vídeo já está na galeria!');
      setInputUrl('');
      return;
    }

    setIsLoading(true);
    let videoTitle = '';

    if (source === 'youtube') {
      videoTitle = 'Vídeo do YouTube';
      try {
        // Tenta pegar o título do YouTube automaticamente
        const response = await fetch(`https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`);
        const data = await response.json();
        if (data.title) videoTitle = data.title;
      } catch (error) {
        console.log("Erro ao buscar título do YouTube.");
      }
    } else {
      // Drive não permite buscar título sem API Key, usamos um padrão
      videoTitle = `Aula Google Drive (${new Date().toLocaleDateString()})`;
    }

    const newVideo: VideoLesson = {
      id: Date.now().toString(),
      title: videoTitle,
      videoUrl: cleanUrl,
      source: source
    };

    setVideos(prev => [newVideo, ...prev]);
    setInputUrl('');
    setIsLoading(false);
  };

  // Função para deletar vídeo
  const handleDelete = (id: string) => {
    setVideos(prev => prev.filter(v => v.id !== id));
  };

  // Permitir adicionar com Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAddVideo();
  };

  return (
    <div className="w-full max-w-5xl flex flex-col gap-8 pb-20 animate-slide-up">
      
      {/* === ÁREA DE ADICIONAR === */}
      <div className="bg-white p-6 rounded-[40px] shadow-xl border-4 border-starkids-orange mx-auto w-full max-w-3xl">
        <div className="flex flex-col gap-2 mb-2">
          <label className="font-poppins text-sm text-starkids-blue font-bold ml-4">
            Adicionar Vídeo (YouTube ou Google Drive):
          </label>
          <div className="flex flex-col md:flex-row gap-3 w-full">
            <input 
              type="text" 
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Cole o link aqui..." 
              className="flex-1 font-poppins text-lg py-3 px-6 rounded-full border-2 border-starkids-lightBlue bg-starkids-skyStart/20 text-starkids-darkBlue focus:outline-none focus:ring-2 focus:ring-starkids-blue transition-all"
            />
            <button 
              onClick={handleAddVideo}
              disabled={isLoading || !inputUrl}
              className={`font-lobster text-xl px-8 py-3 rounded-full text-white bg-starkids-green shadow-starkid shadow-green-700 transition-all flex items-center justify-center gap-2
                ${(isLoading || !inputUrl) ? 'opacity-50 cursor-not-allowed' : 'hover:-translate-y-1 active:translate-y-0 active:shadow-none'}
              `}
            >
              {isLoading ? 'Buscando...' : '➕ Adicionar'}
            </button>
          </div>
          <p className="text-xs text-gray-400 font-poppins ml-4">
            * Para Google Drive, certifique-se que o vídeo está como "Qualquer pessoa com o link".
          </p>
        </div>
      </div>

      {/* === LISTA DE VÍDEOS === */}
      {videos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 px-2">
          {videos.map((video) => (
            <VideoCard 
              key={video.id} 
              video={video} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      ) : (
        // Estado Vazio
        <div className="text-center py-12 opacity-60">
          <p className="font-lobster text-3xl text-starkids-darkBlue">Sua galeria está vazia!</p>
          <p className="font-poppins mt-2">Cole um link do YouTube ou Google Drive acima.</p>
        </div>
      )}

    </div>
  );
};

export default VideoGallery;
