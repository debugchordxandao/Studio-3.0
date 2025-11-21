import React, { useState, useEffect } from 'react';
import { Palette, RotateCcw, Save, Sparkles, Check } from 'lucide-react';
import { useAdmin, ThemeConfig } from './AdminContext';

const presetThemes: { name: string; config: ThemeConfig; gradient: string }[] = [
    {
        name: 'Starkids Original',
        config: { primaryColor: '#0ea5e9', secondaryColor: '#8b5cf6', accentColor: '#f59e0b' },
        gradient: 'from-sky-500 to-purple-500'
    },
    {
        name: 'Ocean Blue',
        config: { primaryColor: '#0284c7', secondaryColor: '#06b6d4', accentColor: '#3b82f6' },
        gradient: 'from-blue-600 to-cyan-500'
    },
    {
        name: 'Sunset Orange',
        config: { primaryColor: '#ea580c', secondaryColor: '#f97316', accentColor: '#fb923c' },
        gradient: 'from-orange-600 to-orange-400'
    },
    {
        name: 'Forest Green',
        config: { primaryColor: '#059669', secondaryColor: '#10b981', accentColor: '#34d399' },
        gradient: 'from-emerald-600 to-emerald-400'
    },
    {
        name: 'Purple Dream',
        config: { primaryColor: '#7c3aed', secondaryColor: '#a855f7', accentColor: '#c084fc' },
        gradient: 'from-violet-600 to-purple-400'
    },
    {
        name: 'Rose Pink',
        config: { primaryColor: '#e11d48', secondaryColor: '#f43f5e', accentColor: '#fb7185' },
        gradient: 'from-rose-600 to-rose-400'
    }
];

export const ThemeCustomizer: React.FC = () => {
    const { theme, setTheme } = useAdmin();
    const [currentTheme, setCurrentTheme] = useState<ThemeConfig>(theme);
    const [selectedPreset, setSelectedPreset] = useState<string>('Starkids Original');
    const [showSaveSuccess, setShowSaveSuccess] = useState(false);

    // Sync with context theme on mount
    useEffect(() => {
        setCurrentTheme(theme);
    }, [theme]);

    const handleColorChange = (key: keyof ThemeConfig, value: string) => {
        setCurrentTheme(prev => ({ ...prev, [key]: value }));
        setSelectedPreset(''); // Clear preset selection when manually changing colors
    };

    const applyPreset = (preset: typeof presetThemes[0]) => {
        setCurrentTheme(preset.config);
        setSelectedPreset(preset.name);
    };

    const handleSave = () => {
        setTheme(currentTheme);
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
    };

    const handleReset = () => {
        const defaultTheme = presetThemes[0].config;
        setCurrentTheme(defaultTheme);
        setSelectedPreset('Starkids Original');
        setTheme(defaultTheme);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-pink-100 to-purple-100 text-purple-600 rounded-xl">
                    <Palette size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-lobster text-slate-800">Temas & Cores</h2>
                    <p className="text-slate-500">Personalize a aparência do sistema com suas cores favoritas.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Color Pickers */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Custom Colors Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <Sparkles size={20} className="text-purple-500" />
                            Cores Personalizadas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <ColorPicker
                                label="Cor Primária"
                                description="Cor principal do sistema"
                                color={currentTheme.primaryColor}
                                onChange={(color) => handleColorChange('primaryColor', color)}
                            />
                            <ColorPicker
                                label="Cor Secundária"
                                description="Cor de destaque"
                                color={currentTheme.secondaryColor}
                                onChange={(color) => handleColorChange('secondaryColor', color)}
                            />
                            <ColorPicker
                                label="Cor de Acento"
                                description="Cor para detalhes"
                                color={currentTheme.accentColor}
                                onChange={(color) => handleColorChange('accentColor', color)}
                            />
                        </div>
                    </div>

                    {/* Preset Themes Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Temas Pré-definidos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {presetThemes.map((preset) => (
                                <button
                                    key={preset.name}
                                    onClick={() => applyPreset(preset)}
                                    className={`relative p-4 rounded-xl border-2 transition-all hover:scale-105 ${selectedPreset === preset.name
                                        ? 'border-purple-500 ring-4 ring-purple-100'
                                        : 'border-slate-200 hover:border-slate-300'
                                        }`}
                                >
                                    <div className={`w-full h-20 rounded-lg bg-gradient-to-r ${preset.gradient} mb-3 shadow-md`} />
                                    <p className="text-sm font-bold text-slate-700">{preset.name}</p>
                                    {selectedPreset === preset.name && (
                                        <div className="absolute top-2 right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                            <Check size={14} className="text-white" strokeWidth={3} />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Preview */}
                <div className="space-y-6">
                    {/* Preview Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sticky top-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Preview</h3>
                        <div className="space-y-4">
                            {/* Button Preview */}
                            <div>
                                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Botão Primário</p>
                                <button
                                    style={{ backgroundColor: currentTheme.primaryColor }}
                                    className="w-full py-3 rounded-xl text-white font-bold shadow-lg"
                                >
                                    Exemplo de Botão
                                </button>
                            </div>

                            {/* Badge Preview */}
                            <div>
                                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Badge</p>
                                <div className="flex gap-2">
                                    <span
                                        style={{ backgroundColor: currentTheme.secondaryColor }}
                                        className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                                    >
                                        Secundário
                                    </span>
                                    <span
                                        style={{ backgroundColor: currentTheme.accentColor }}
                                        className="px-3 py-1 rounded-full text-white text-sm font-semibold"
                                    >
                                        Acento
                                    </span>
                                </div>
                            </div>

                            {/* Gradient Preview */}
                            <div>
                                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Gradiente</p>
                                <div
                                    style={{
                                        background: `linear-gradient(135deg, ${currentTheme.primaryColor}, ${currentTheme.secondaryColor})`
                                    }}
                                    className="w-full h-24 rounded-xl shadow-md"
                                />
                            </div>

                            {/* Card Preview */}
                            <div>
                                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">Card com Borda</p>
                                <div
                                    style={{ borderColor: currentTheme.primaryColor }}
                                    className="border-4 rounded-xl p-4 bg-slate-50"
                                >
                                    <h4 className="font-bold text-slate-700">Exemplo de Card</h4>
                                    <p className="text-sm text-slate-500">Com borda colorida</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                        <button
                            onClick={handleSave}
                            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                            <Save size={20} />
                            Salvar Tema
                        </button>
                        <button
                            onClick={handleReset}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all"
                        >
                            <RotateCcw size={18} />
                            Restaurar Padrão
                        </button>
                    </div>

                    {/* Success Message */}
                    {showSaveSuccess && (
                        <div className="bg-green-500 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in-up">
                            <Check size={20} strokeWidth={3} />
                            <span className="font-bold">Tema salvo com sucesso!</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Color Picker Component
const ColorPicker: React.FC<{
    label: string;
    description: string;
    color: string;
    onChange: (color: string) => void;
}> = ({ label, description, color, onChange }) => {
    return (
        <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">{label}</label>
            <p className="text-xs text-slate-500 mb-3">{description}</p>
            <div className="flex items-center gap-3">
                <input
                    type="color"
                    value={color}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-16 h-16 rounded-xl border-2 border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
                />
                <div className="flex-1">
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="#000000"
                    />
                </div>
            </div>
        </div>
    );
};
