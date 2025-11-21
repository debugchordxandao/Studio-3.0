import React, { useState } from 'react';
import { useAdmin, FeatureToggles } from './AdminContext';
import { ToggleLeft, ToggleRight, Layout, Music, Gamepad2, PenTool, Mic, FileText, BookOpen, Video } from 'lucide-react';

export const SiteControl: React.FC = () => {
    const { features, setFeaturesState } = useAdmin();
    const [tempFeatures, setTempFeatures] = useState<FeatureToggles>(features);
    const [saveMessage, setSaveMessage] = useState<string>('');

    // Sync tempFeatures with features when features change (e.g. loaded from localStorage)
    React.useEffect(() => {
        setTempFeatures(features);
    }, [features]);

    const toggleTempFeature = (key: keyof FeatureToggles) => {
        setTempFeatures(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setFeaturesState(tempFeatures);
        setSaveMessage('Alterações salvas com sucesso!');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    const featureConfig: { key: keyof FeatureToggles; label: string; icon: React.ReactNode; color: string }[] = [
        { key: 'lessons', label: 'Aulas (Feed)', icon: <BookOpen size={20} />, color: 'text-blue-500' },
        { key: 'lessonEditor', label: 'Editor de Aulas', icon: <Video size={20} />, color: 'text-indigo-500' },
        { key: 'piano', label: 'Piano', icon: <Music size={20} />, color: 'text-pink-500' },
        { key: 'guitar', label: 'Violão', icon: <Music size={20} />, color: 'text-orange-500' },
        { key: 'cifra', label: 'Cifras', icon: <FileText size={20} />, color: 'text-yellow-500' },
        { key: 'scales', label: 'Escalas', icon: <Music size={20} />, color: 'text-green-500' },
        { key: 'sheetMusic', label: 'Partituras', icon: <FileText size={20} />, color: 'text-purple-500' },
        { key: 'memoryGame', label: 'Jogos (Memory)', icon: <Gamepad2 size={20} />, color: 'text-red-500' },
        { key: 'quiz', label: 'Quiz Acordes', icon: <Gamepad2 size={20} />, color: 'text-indigo-500' },
        { key: 'idGenerator', label: 'Carteirinha', icon: <Layout size={20} />, color: 'text-cyan-500' },
        { key: 'design', label: 'Design', icon: <PenTool size={20} />, color: 'text-teal-500' },
        { key: 'podcasts', label: 'Podcasts', icon: <Mic size={20} />, color: 'text-rose-500' },
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h3 className="font-bold text-lg text-slate-800">Controle de Funcionalidades</h3>
                    <p className="text-sm text-slate-500">Ative ou desative módulos do site em tempo real.</p>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featureConfig.map(feature => (
                        <div
                            key={feature.key}
                            className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between ${tempFeatures[feature.key]
                                ? 'border-sky-500 bg-sky-50'
                                : 'border-slate-200 bg-white opacity-75'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg bg-white shadow-sm ${feature.color}`}>
                                    {feature.icon}
                                </div>
                                <span className="font-bold text-slate-700">{feature.label}</span>
                            </div>

                            <button
                                onClick={() => toggleTempFeature(feature.key)}
                                className={`transition-colors ${tempFeatures[feature.key] ? 'text-sky-500' : 'text-slate-400'}`}
                            >
                                {tempFeatures[feature.key] ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </button>
                        </div>
                    ))}
                </div>
                <div className="p-4 flex justify-end items-center border-t border-slate-200 bg-slate-50/50">
                    {saveMessage && <span className="text-sm text-green-600 mr-4">{saveMessage}</span>}
                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                    >
                        Salvar Alterações
                    </button>
                </div>
            </div>
        </div>
    );
};
