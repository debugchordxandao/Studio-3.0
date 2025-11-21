import React, { useState } from 'react';
import { useAdmin, User } from './AdminContext';
import { UserPlus, Trash2, Mail, Music, Shield } from 'lucide-react';

export const UserManager: React.FC = () => {
    const { users, addUser, deleteUser } = useAdmin();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        instrumento: 'Piano' as 'Piano' | 'Violão' | 'Guitarra' | 'Baixo' | 'Bateria' | 'Teclado' | 'Canto',
        role: 'Aluno' as 'Admin' | 'Aluno' | 'Professor' | 'Designer',
        password: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.password) {
            alert('Por favor, preencha todos os campos!');
            return;
        }
        addUser(formData);
        setFormData({ name: '', email: '', instrumento: 'Piano', role: 'Aluno', password: '' });
        alert('Usuário adicionado com sucesso!');
    };

    const handleDelete = (id: string, name: string) => {
        if (window.confirm(`Tem certeza que deseja excluir o usuário "${name}"?`)) {
            deleteUser(id);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h2 className="text-3xl font-lobster text-slate-800 mb-2">Gerenciar Usuários</h2>
                <p className="text-slate-500">Adicione, visualize e remova usuários do sistema.</p>
            </div>

            {/* Add User Form */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-slate-200">
                <h3 className="text-xl font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <UserPlus size={24} className="text-sky-500" />
                    Adicionar Novo Usuário
                </h3>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Nome</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Ex: João Silva"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="joao@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Senha</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                            placeholder="Senha do usuário"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Instrumento</label>
                        <select
                            value={formData.instrumento}
                            onChange={(e) => setFormData({ ...formData, instrumento: e.target.value as 'Piano' | 'Violão' | 'Guitarra' | 'Baixo' | 'Bateria' | 'Teclado' | 'Canto' })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="Piano">Piano</option>
                            <option value="Violão">Violão</option>
                            <option value="Guitarra">Guitarra</option>
                            <option value="Baixo">Baixo</option>
                            <option value="Bateria">Bateria</option>
                            <option value="Teclado">Teclado</option>
                            <option value="Canto">Canto</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-2">Função</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Admin' | 'Aluno' | 'Professor' | 'Designer' })}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                        >
                            <option value="Aluno">Aluno</option>
                            <option value="Professor">Professor</option>
                            <option value="Designer">Designer</option>
                            <option value="Admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all shadow-md hover:shadow-lg"
                        >
                            Adicionar
                        </button>
                    </div>
                </form>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-200">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Nome</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Senha</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Instrumento</th>
                                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700 uppercase tracking-wider">Função</th>
                                <th className="px-6 py-4 text-center text-sm font-bold text-slate-700 uppercase tracking-wider">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                                        Nenhum usuário cadastrado.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-semibold text-slate-800">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <Mail size={16} className="text-slate-400" />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-slate-600">
                                                <span className="font-mono text-sm bg-slate-100 px-3 py-1 rounded">{'•'.repeat(user.password?.length || 4)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Music size={16} className="text-sky-500" />
                                                <span className="text-slate-700">{user.instrumento}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Shield size={16} className={user.role === 'Admin' ? 'text-orange-500' : 'text-green-500'} />
                                                <span className={`font-semibold ${user.role === 'Admin' ? 'text-orange-600' : 'text-green-600'}`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleDelete(user.id, user.name)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-semibold"
                                            >
                                                <Trash2 size={16} />
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Stats */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-xl p-4 border border-sky-200">
                    <p className="text-sm text-slate-600 font-semibold">Total de Usuários</p>
                    <p className="text-3xl font-bold text-sky-600">{users.length}</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border border-orange-200">
                    <p className="text-sm text-slate-600 font-semibold">Administradores</p>
                    <p className="text-3xl font-bold text-orange-600">{users.filter(u => u.role === 'Admin').length}</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
                    <p className="text-sm text-slate-600 font-semibold">Alunos</p>
                    <p className="text-3xl font-bold text-green-600">{users.filter(u => u.role === 'Aluno').length}</p>
                </div>
            </div>
        </div>
    );
};
