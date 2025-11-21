import React from 'react';
import { useAdmin, Lesson } from './Admin/AdminContext';
import { Video, PlayCircle } from 'lucide-react';

export const LessonFeed: React.FC = () => {
    const { lessons } = useAdmin();

    return (
        <div className="w-full max-w-7xl mx-auto pt-32 px-4 pb-12">
            <div className="text-center mb-12">
                <h1 className="font-lobster text-5xl md:text-6xl text-white mb-4 drop-shadow-[2px_2px_0_#0277bd]">
                    Aulas & Tutoriais
                </h1>
                <p className="text-white/90 font-poppins text-lg max-w-2xl mx-auto">
                    Explore nossa biblioteca de conteúdos exclusivos para dominar seu instrumento favorito.
                </p>
            </div>

            {lessons.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-white/10 backdrop-blur-sm rounded-3xl border-2 border-white/20 text-white">
                    <Video size={64} className="mb-4 opacity-50" />
                    <h3 className="text-2xl font-bold font-lobster mb-2">Nenhuma aula encontrada</h3>
                    <p className="text-white/70 font-poppins">Fique ligado! Em breve teremos novidades por aqui.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {lessons.map((lesson) => (
                        <div key={lesson.id} className="bg-white rounded-2xl shadow-xl overflow-hidden hover:transform hover:scale-[1.02] transition-all duration-300 group">
                            {/* Video Thumbnail Area */}
                            <div className="relative aspect-video bg-slate-900 group-hover:brightness-110 transition-all">
                                {lesson.videoUrl.includes('youtube') ? (
                                    <img
                                        src={`https://img.youtube.com/vi/${lesson.videoUrl.split('v=')[1]?.split('&')[0]}/hqdefault.jpg`}
                                        alt={lesson.title}
                                        className="w-full h-full object-cover opacity-90"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/20">
                                        <Video size={48} />
                                    </div>
                                )}

                                {/* Play Button Overlay */}
                                <a
                                    href={lesson.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                        <PlayCircle size={32} className="text-white ml-1" />
                                    </div>
                                </a>

                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider rounded-full border border-white/20">
                                        {lesson.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <h3 className="font-bold text-xl text-slate-800 mb-2 line-clamp-2 leading-tight">
                                    {lesson.title}
                                </h3>
                                <p className="text-slate-500 text-sm line-clamp-3 mb-4">
                                    {lesson.description}
                                </p>
                                <a
                                    href={lesson.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sky-600 font-bold text-sm hover:text-sky-700 transition-colors"
                                >
                                    Assistir Agora
                                    <PlayCircle size={16} />
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
