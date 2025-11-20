import React, { useState } from "react";
import { STARKIDS_LOGO_URL } from "../constants";

interface LoginProps {
  onLogin: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "Alexandre" && password === "0101") {
      onLogin();
    } else {
      setError("Credenciais inválidas. Tente novamente.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-pattern p-4">
      <div className="bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-4 border-yellow-300 w-full max-w-md animate-fade-in-up">
        <div className="flex flex-col items-center mb-8">
          <div className="relative mb-4">
            <div className="absolute inset-0 bg-yellow-300 rounded-full blur opacity-50 animate-pulse"></div>
            <img
              src={STARKIDS_LOGO_URL}
              alt="Starkids Logo"
              className="relative h-40 w-auto drop-shadow-md"
            />
          </div>
          <h1 className="font-lobster text-4xl text-sky-500 drop-shadow-sm text-center">
            Starkids Studio
          </h1>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-slate-600 font-bold mb-2 font-poppins">
              Usuário
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none transition-all font-poppins text-slate-700 bg-white"
              placeholder="Digite seu usuário"
            />
          </div>

          <div>
            <label className="block text-slate-600 font-bold mb-2 font-poppins">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-sky-400 focus:ring-2 focus:ring-sky-200 outline-none transition-all font-poppins text-slate-700 bg-white"
              placeholder="Digite sua senha"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-4 bg-sky-400 hover:bg-sky-500 text-white font-lobster text-2xl py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 border-b-4 border-sky-600 active:border-b-0 active:translate-y-1"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
};
