import React, { useState, useEffect } from 'react';
import { useAdmin, User, UserPermissions, createDefaultPermissions } from './AdminContext';
import {
    Check, X, Save, Video, Edit3, Music, Guitar, FileText,
    ListMusic, FileMusic, Gamepad2, HelpCircle, CreditCard,
    Palette, Mic, Shield, CheckSquare, Square
} from 'lucide-react';

/**
 * Component to manage per‑user feature permissions.
 * It is rendered inside the AdminDashboard (God Mode).
 */
export const UserPermissionsManager: React.FC = () => {
    const { users, updateUser } = useAdmin();
    const [selectedUserId, setSelectedUserId] = useState<string>('');
    const [tempPermissions, setTempPermissions] = useState<UserPermissions | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    // When a user is selected, load its permissions into a temporary state
    useEffect(() => {
        if (selectedUserId) {
            const user = users.find(u => u.id === selectedUserId);
            if (user) {
                // Use existing permissions or fallback to defaults based on role
                const permissions = user.permissions || createDefaultPermissions(user.role);
                setTempPermissions({ ...permissions });
            }
        } else {
            setTempPermissions(null);
        }
        setShowSuccess(false);
    }, [selectedUserId, users]);

    const togglePermission = (key: keyof UserPermissions) => {
        if (!tempPermissions) return;
        setTempPermissions({
            ...tempPermissions,
            [key]: !tempPermissions[key],
        });
        setShowSuccess(false);
    };

    const toggleAll = (enable: boolean) => {
        if (!tempPermissions) return;
        const newPermissions = { ...tempPermissions };
        (Object.keys(newPermissions) as Array<keyof UserPermissions>).forEach(key => {
            newPermissions[key] = enable;
        });
        setTempPermissions(newPermissions);
        setShowSuccess(false);
    };

    const handleSave = () => {
        if (!tempPermissions) return;
        const user = users.find(u => u.id === selectedUserId);
        if (user) {
            updateUser(user.id, { permissions: tempPermissions } as Partial<User>);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    };

    // Configuration for icons and labels
    const permissionConfig: Record<keyof UserPermissions, { label: string, icon: React.ReactNode, color: string }> = {
        lessons: { label: 'Aulas (Feed)', icon: <Video size={20} />, color: 'text-blue-500' },
        lessonEditor: { label: 'Editor de Aulas', icon: <Edit3 size={20} />, color: 'text-orange-500' },
        piano: { label: 'Piano', icon: <Music size={20} />, color: 'text-pink-500' },
        guitar: { label: 'Violão', icon: <Guitar size={20} />, color: 'text-amber-600' },
        cifra: { label: 'Cifras', icon: <FileText size={20} />, color: 'text-green-500' },
        scales: { label: 'Escalas', icon: <ListMusic size={20} />, color: 'text-purple-500' },
        sheetMusic: { label: 'Partituras', icon: <FileMusic size={20} />, color: 'text-indigo-500' },
        memoryGame: { label: 'Jogo da Memória', icon: <Gamepad2 size={20} />, color: 'text-teal-500' },
        quiz: { label: 'Quiz Acordes', icon: <HelpCircle size={20} />, color: 'text-yellow-500' },
        idGenerator: { label: 'Carteirinha', icon: <CreditCard size={20} />, color: 'text-cyan-500' },
        design: { label: 'Design', icon: <Palette size={20} />, color: 'text-rose-500' },
        podcasts: { label: 'Podcasts', icon: <Mic size={20} />, color: 'text-red-500' },
    };

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
                    <Shield size={32} />
                </div>
                <div>
                    <h2 className="text-3xl font-lobster text-slate-800">Gerenciar Permissões</h2>
                    <p className="text-slate-500">Controle exatamente o que cada usuário pode acessar.</p>
                </div>
            </div>

            {/* User Selector Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-8">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Selecione o usuário</label>
                <div className="relative">
                    <select
                        value={selectedUserId}
                        onChange={e => setSelectedUserId(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-sky-100 focus:border-sky-500 transition-all appearance-none text-slate-700 font-medium"
                    >
                        <option value="">-- Escolha um usuário --</option>
                        {users.map(user => (
                            <option key={user.id} value={user.id}>
                                {user.name} ({user.role})
                            </option>
                        ))}
                    </select>
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-400">
                        <Shield size={16} />
                    </div>
                </div>
            </div>

            {tempPermissions && (
                <div className="animate-fadeIn">
                    {/* Bulk Actions */}
                    <div className="flex justify-end gap-3 mb-6">
                        <button
                            onClick={() => toggleAll(true)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg transition-colors"
                        >
                            <CheckSquare size={16} />
                            Marcar Todos
                        </button>
                        <button
                            onClick={() => toggleAll(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                            <Square size={16} />
                            Desmarcar Todos
                        </button>
                    </div>

                    {/* Permissions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
                        {Object.entries(tempPermissions).map(([key, value]) => {
                            const config = permissionConfig[key as keyof UserPermissions] || { label: key, icon: <Shield size={20} />, color: 'text-slate-500' };
                            return (
                                <div
                                    key={key}
                                    onClick={() => togglePermission(key as keyof UserPermissions)}
                                    className={`
                                        relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group
                                        ${value
                                            ? 'bg-white border-sky-500 shadow-md shadow-sky-100'
                                            : 'bg-slate-50 border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                                        }
                                    `}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className={`p-2 rounded-lg ${value ? 'bg-sky-50' : 'bg-slate-200'} ${config.color}`}>
                                            {config.icon}
                                        </div>
                                        <div className={`
                                            w-12 h-6 rounded-full p-1 transition-colors duration-300
                                            ${value ? 'bg-sky-500' : 'bg-slate-300'}
                                        `}>
                                            <div className={`
                                                w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-300
                                                ${value ? 'translate-x-6' : 'translate-x-0'}
                                            `}></div>
                                        </div>
                                    </div>
                                    <h3 className={`font-bold ${value ? 'text-slate-800' : 'text-slate-500'}`}>
                                        {config.label}
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {value ? 'Acesso Permitido' : 'Acesso Bloqueado'}
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    {/* Save Action */}
                    <div className="fixed bottom-8 right-8 z-50 flex flex-col items-end gap-4">
                        {showSuccess && (
                            <div className="bg-green-500 text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideUp">
                                <div className="bg-white/20 p-1 rounded-full">
                                    <Check size={16} strokeWidth={3} />
                                </div>
                                <span className="font-bold">Permissões salvas com sucesso!</span>
                            </div>
                        )}

                        <button
                            onClick={handleSave}
                            className="flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold shadow-2xl hover:shadow-xl transform hover:-translate-y-1 transition-all"
                        >
                            <Save size={24} />
                            <span className="text-lg">Salvar Alterações</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
