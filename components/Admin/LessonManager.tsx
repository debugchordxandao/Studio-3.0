import React, { useState } from 'react';
import { useAdmin, Lesson } from './AdminContext';
import { Plus, Trash2, Edit2, Video, Save, X } from 'lucide-react';

export const LessonManager: React.FC = () => {
    const { lessons, addLesson, updateLesson, deleteLesson } = useAdmin();
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [formData, setFormData] = useState<Omit<Lesson, 'id'>>({
        title: '',
        videoUrl: '',
        category: 'Piano',
        description: ''
    });

    const resetForm = () => {
        setFormData({ title: '', videoUrl: '', category: 'Piano', description: '' });
        setIsEditing(null);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing) {
            updateLesson(isEditing, formData);
        } else {
            addLesson(formData);
        }
        resetForm();
    };

    const handleEdit = (lesson: Lesson) => {
        setIsEditing(lesson.id);
        setFormData({
            title: lesson.title,
            videoUrl: lesson.videoUrl,
            category: lesson.category,
            description: lesson.description
        });
    };

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">

            {/* --- FORM --- */}
            <div className="w-full lg:w-1/3">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden sticky top-8">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                        <h3 className="font-bold text-lg text-slate-800">
                            {isEditing ? 'Editar Aula' : 'Nova Aula'}
                        </h3>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Título da Aula</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 outline-none"
                                placeholder="Ex: Introdução ao Piano"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">URL do Vídeo (YouTube)</label>
                            <input
                                type="text"
                                required
                                value={formData.videoUrl}
                                onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 outline-none"
                                placeholder="https://youtube.com/..."
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Categoria</label>
                            <select
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 outline-none bg-white"
                            >
                                <option value="Piano">Piano</option>
                                <option value="Violão">Violão</option>
                                <option value="Teoria">Teoria</option>
                                <option value="Exercícios">Exercícios</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Descrição</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-sky-500 outline-none h-24 resize-none"
                                placeholder="Breve descrição da aula..."
                            />
                        </div>

                        <div className="flex gap-2 mt-2">
                            {isEditing && (
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="flex-1 py-2 rounded-lg border border-slate-300 text-slate-500 font-bold hover:bg-slate-50"
                                >
                                    Cancelar
                                </button>
                            )}
                            <button
                                type="submit"
                                className="flex-1 py-2 rounded-lg bg-sky-500 text-white font-bold hover:bg-sky-600 shadow-md flex items-center justify-center gap-2"
                            >
                                {isEditing ? <Save size={18} /> : <Plus size={18} />}
                                {isEditing ? 'Salvar' : 'Adicionar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* --- LIST --- */}
            <div className="w-full lg:w-2/3">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-slate-800">Biblioteca de Aulas ({lessons.length})</h3>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {lessons.length === 0 ? (
                            <div className="p-12 text-center text-slate-400">
                                <Video size={48} className="mx-auto mb-4 opacity-20" />
                                <p>Nenhuma aula cadastrada ainda.</p>
                            </div>
                        ) : (
                            lessons.map(lesson => (
                                <div key={lesson.id} className="p-4 hover:bg-slate-50 transition-colors flex items-start gap-4 group">
                                    <div className="w-32 h-20 bg-slate-200 rounded-lg overflow-hidden flex-shrink-0 relative">
                                        {/* Thumbnail placeholder logic could go here */}
                                        <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                                            <Video size={24} />
                                        </div>
                                        {lesson.videoUrl.includes('youtube') && (
                                            <img
                                                src={`https://img.youtube.com/vi/${lesson.videoUrl.split('v=')[1]?.split('&')[0]}/mqdefault.jpg`}
                                                alt="thumb"
                                                className="w-full h-full object-cover"
                                                onError={(e) => (e.currentTarget.style.display = 'none')}
                                            />
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-slate-700">{lesson.title}</h4>
                                            <span className="text-[10px] uppercase tracking-wider font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">
                                                {lesson.category}
                                            </span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{lesson.description}</p>
                                    </div>

                                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(lesson)}
                                            className="p-2 text-sky-500 hover:bg-sky-50 rounded-lg"
                                            title="Editar"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => deleteLesson(lesson.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                                            title="Excluir"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
};
