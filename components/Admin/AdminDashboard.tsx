import React, { useState } from 'react';
import { useAdmin, SystemMessageType } from './AdminContext';
import { LayoutDashboard, Megaphone, Music, Palette, LogOut, Save, Power, Settings, Video, Users, Shield } from 'lucide-react';
import { SiteControl } from './SiteControl';
import { LessonManager } from './LessonManager';
import { UserManager } from './UserManager';
import { UserPermissionsManager } from './UserPermissionsManager';
import { ThemeCustomizer } from './ThemeCustomizer';

interface AdminDashboardProps {
    onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const { systemMessage, setSystemMessage } = useAdmin();
    const [activeModule, setActiveModule] = useState('dashboard');

    // Local state for the form to avoid constant context updates on typing
    const [msgText, setMsgText] = useState(systemMessage.text);
    const [msgType, setMsgType] = useState<SystemMessageType>(systemMessage.type);
    const [msgActive, setMsgActive] = useState(systemMessage.active);

    const handleSaveBroadcast = () => {
        setSystemMessage({
            text: msgText,
            type: msgType,
            active: msgActive
        });
        alert('Configurações de Aviso Salvas!');
    };

    return (
        <div className="min-h-screen w-full flex bg-slate-100 font-sans text-slate-800">

            {/* --- SIDEBAR --- */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
                <div className="p-6 border-b border-slate-800 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="font-lobster text-2xl text-white">S</span>
                    </div>
                    <div>
                        <h1 className="font-lobster text-xl tracking-wide">Moderador</h1>
                        <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Admin Panel</p>
                    </div>
                </div>

                <nav className="flex-1 p-4 flex flex-col gap-2">
                    <SidebarItem
                        icon={<LayoutDashboard size={20} />}
                        label="Visão Geral"
                        active={activeModule === 'dashboard'}
                        onClick={() => setActiveModule('dashboard')}
                    />
                    <SidebarItem
                        icon={<Settings size={20} />}
                        label="Controle do Site"
                        active={activeModule === 'site-control'}
                        onClick={() => setActiveModule('site-control')}
                    />
                    <SidebarItem
                        icon={<Video size={20} />}
                        label="Gerenciador de Aulas"
                        active={activeModule === 'lessons'}
                        onClick={() => setActiveModule('lessons')}
                    />
                    <SidebarItem
                        icon={<Megaphone size={20} />}
                        label="Sistema de Avisos"
                        active={activeModule === 'broadcast'}
                        onClick={() => setActiveModule('broadcast')}
                    />
                    <SidebarItem
                        icon={<Users size={20} />}
                        label="Gerenciar Usuários"
                        active={activeModule === 'users'}
                        onClick={() => setActiveModule('users')}
                    />
                    <SidebarItem
                        icon={<Shield size={20} />}
                        label="Permissões de Usuário"
                        active={activeModule === 'permissions'}
                        onClick={() => setActiveModule('permissions')}
                    />
                    <SidebarItem
                        icon={<Music size={20} />}
                        label="Gerenciar Acordes"
                        active={activeModule === 'chords'}
                        onClick={() => setActiveModule('chords')}
                    />
                    <SidebarItem
                        icon={<Palette size={20} />}
                        label="Temas & Cores"
                        active={activeModule === 'themes'}
                        onClick={() => setActiveModule('themes')}
                    />
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-bold text-sm">Sair do Admin</span>
                    </button>
                </div>
            </aside>

            {/* --- MAIN CONTENT --- */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
                    <h2 className="font-poppins font-bold text-xl text-slate-700">
                        {activeModule === 'broadcast' && '📢 Sistema de Broadcast'}
                        {activeModule === 'dashboard' && '📊 Visão Geral'}
                        {activeModule === 'site-control' && '⚙️ Controle do Site'}
                        {activeModule === 'lessons' && '🎬 Gerenciador de Aulas'}
                        {activeModule === 'users' && '👥 Gerenciar Usuários'}
                        {activeModule === 'permissions' && '🛡️ Permissões de Usuário'}
                        {activeModule === 'chords' && '🎸 Gerenciar Acordes'}
                        {activeModule === 'themes' && '🎨 Temas & Cores'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-xs font-mono bg-slate-200 px-2 py-1 rounded text-slate-600">v1.1.0-admin</span>
                        <div className="w-8 h-8 bg-sky-500 rounded-full border-2 border-white shadow-md"></div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8">

                    {activeModule === 'site-control' && <SiteControl />}

                    {activeModule === 'lessons' && <LessonManager />}

                    {activeModule === 'users' && <UserManager />}

                    {activeModule === 'permissions' && <UserPermissionsManager />}

                    {activeModule === 'broadcast' && (
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">Configurar Aviso Global</h3>
                                        <p className="text-sm text-slate-500">Esta mensagem aparecerá no topo de todas as páginas.</p>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 ${msgActive ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-500'}`}>
                                        <div className={`w-2 h-2 rounded-full ${msgActive ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></div>
                                        {msgActive ? 'Ativo' : 'Inativo'}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col gap-6">

                                    {/* Message Input */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Mensagem do Aviso</label>
                                        <input
                                            type="text"
                                            value={msgText}
                                            onChange={(e) => setMsgText(e.target.value)}
                                            placeholder="Ex: Manutenção programada para sexta-feira..."
                                            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition-all font-poppins"
                                        />
                                    </div>

                                    {/* Type Selection */}
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Alerta</label>
                                        <div className="grid grid-cols-3 gap-4">
                                            <TypeButton
                                                type="info"
                                                selected={msgType === 'info'}
                                                onClick={() => setMsgType('info')}
                                                label="Informação (Azul)"
                                                color="bg-sky-500"
                                            />
                                            <TypeButton
                                                type="warning"
                                                selected={msgType === 'warning'}
                                                onClick={() => setMsgType('warning')}
                                                label="Atenção (Amarelo)"
                                                color="bg-yellow-500"
                                            />
                                            <TypeButton
                                                type="alert"
                                                selected={msgType === 'alert'}
                                                onClick={() => setMsgType('alert')}
                                                label="Perigo (Vermelho)"
                                                color="bg-red-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Toggle Active */}
                                    <div className="flex items-center justify-between bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-lg ${msgActive ? 'bg-green-100 text-green-600' : 'bg-slate-200 text-slate-500'}`}>
                                                <Power size={24} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700">Status do Aviso</p>
                                                <p className="text-xs text-slate-500">Ligue para exibir no site imediatamente.</p>
                                            </div>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={msgActive}
                                                onChange={(e) => setMsgActive(e.target.checked)}
                                                className="sr-only peer"
                                            />
                                            <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sky-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-sky-500"></div>
                                        </label>
                                    </div>

                                </div>

                                <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-end">
                                    <button
                                        onClick={handleSaveBroadcast}
                                        className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform active:scale-95 transition-all"
                                    >
                                        <Save size={18} />
                                        Salvar Alterações
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeModule === 'dashboard' && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveModule('site-control')}>
                                    <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mb-4">
                                        <Settings size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800 mb-2">Controle do Site</h3>
                                    <p className="text-sm text-slate-500">Gerencie quais módulos estão visíveis para os alunos.</p>
                                </div>

                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveModule('lessons')}>
                                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
                                        <Video size={24} />
                                    </div>
                                    <h3 className="font-bold text-lg text-slate-800 mb-2">Gerenciador de Aulas</h3>
                                    <p className="text-sm text-slate-500">Adicione, edite ou remova aulas da plataforma.</p>
                                </div>
                            </div>
                        </div>
                    )}


                    {activeModule === 'themes' && <ThemeCustomizer />}

                    {activeModule !== 'broadcast' && activeModule !== 'dashboard' && activeModule !== 'site-control' && activeModule !== 'lessons' && activeModule !== 'users' && activeModule !== 'permissions' && activeModule !== 'themes' && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                            <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                                <LayoutDashboard size={40} />
                            </div>
                            <p className="text-lg font-medium">Módulo em desenvolvimento...</p>
                        </div>
                    )}

                </div>
            </main>
        </div>
    );
};

// --- Subcomponents ---

const SidebarItem: React.FC<{ icon: React.ReactNode, label: string, active: boolean, onClick: () => void }> = ({ icon, label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
            ? 'bg-sky-500 text-white shadow-lg shadow-sky-900/20 font-bold'
            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
    >
        {icon}
        <span className="text-sm">{label}</span>
    </button>
);

const TypeButton: React.FC<{ type: string, selected: boolean, onClick: () => void, label: string, color: string }> = ({ selected, onClick, label, color }) => (
    <button
        onClick={onClick}
        className={`relative p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${selected
            ? 'border-sky-500 bg-sky-50 ring-2 ring-sky-200 ring-offset-2'
            : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
    >
        <div className={`w-8 h-8 rounded-full ${color} shadow-sm`}></div>
        <span className={`text-xs font-bold ${selected ? 'text-slate-800' : 'text-slate-500'}`}>{label}</span>
        {selected && (
            <div className="absolute top-2 right-2 w-3 h-3 bg-sky-500 rounded-full border-2 border-white"></div>
        )}
    </button>
);
