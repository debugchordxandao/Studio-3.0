import React, { useState } from 'react';
import { useAdmin } from '../components/Admin/AdminContext';
import { LogIn, Mail, Lock, AlertCircle } from 'lucide-react';

export const LoginScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAdmin();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate a small delay for better UX
        setTimeout(() => {
            const success = login(email, password);

            if (!success) {
                setError('Email não encontrado ou senha incorreta. Verifique suas credenciais.');
                setIsLoading(false);
            }
            // If success, the context will update currentUser and App.tsx will handle redirect
        }, 500);
    };

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-pattern p-4">
            {/* Animated stars background effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-20 w-1 h-1 bg-purple-300 rounded-full animate-pulse delay-100"></div>
                <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-sky-300 rounded-full animate-pulse delay-200"></div>
                <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-pink-300 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-20 right-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse delay-150"></div>
            </div>

            {/* Login Card */}
            <div className="relative bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-3xl shadow-2xl border-4 border-yellow-300 w-full max-w-md animate-fade-in-up">
                {/* Logo and Title */}
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-yellow-300 rounded-full blur-xl opacity-50 animate-pulse"></div>
                        <img
                            src="/starkids_logo_hd.png"
                            alt="Starkids Logo"
                            className="relative h-32 w-auto drop-shadow-lg"
                        />
                    </div>
                    <h1 className="font-lobster text-4xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-purple-600 drop-shadow-sm text-center mb-2">
                        Starkids Studio
                    </h1>
                    <p className="text-slate-500 font-poppins text-sm">
                        Faça login para continuar
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    {/* Email Input */}
                    <div>
                        <label className="block text-slate-700 font-bold mb-2 font-poppins text-sm">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none transition-all font-poppins text-slate-700 bg-white"
                                placeholder="seu.email@starkids.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-slate-700 font-bold mb-2 font-poppins text-sm">
                            Senha
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none transition-all font-poppins text-slate-700 bg-white"
                                placeholder="Digite sua senha"
                                required
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-start gap-2 bg-red-50 border-2 border-red-200 rounded-xl p-3 animate-shake">
                            <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={20} />
                            <p className="text-red-600 text-sm font-semibold font-poppins">
                                {error}
                            </p>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="mt-2 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 disabled:from-slate-300 disabled:to-slate-400 text-white font-lobster text-2xl py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:translate-y-0 transition-all duration-200 border-b-4 border-sky-600 disabled:border-slate-500 active:border-b-0 active:translate-y-1 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                                Entrando...
                            </>
                        ) : (
                            <>
                                <LogIn size={24} />
                                Entrar
                            </>
                        )}
                    </button>
                </form>

                {/* Footer hint */}

            </div>
        </div>
    );
};
