import React from 'react';
import { ConfettiCanvas } from './ConfettiCanvas';

interface WinModalProps {
    isOpen: boolean;
    onRestart: () => void;
    scores: number[];
    numPlayers: number;
}

export const WinModal: React.FC<WinModalProps> = ({ isOpen, onRestart, scores, numPlayers }) => {
    if (!isOpen) return null;

    // Determine Winner
    let title = "Parabéns!";
    let message = "Você completou a fita musical!";

    if (numPlayers > 1) {
        const maxScore = Math.max(...scores);
        const winners = scores
            .map((score, index) => score === maxScore ? index + 1 : null)
            .filter(i => i !== null);

        if (winners.length === 1) {
            title = `Jogador ${winners[0]} Venceu!`;
            message = `Com incríveis ${maxScore} pares encontrados!`;
        } else {
            title = "Empate!";
            message = `Jogadores ${winners.join(' e ')} empataram com ${maxScore} pares!`;
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            <ConfettiCanvas />

            <div className="relative z-10 bg-white p-8 rounded-[40px] shadow-2xl border-4 border-[#0277bd] max-w-md w-[90%] text-center animate-pop-in">
                <h2 className="font-lobster text-4xl md:text-5xl text-starkids-orange mb-4 drop-shadow-[2px_2px_0_#fff] leading-tight">
                    {title}
                </h2>
                <p className="font-poppins text-gray-600 text-lg mb-6">
                    {message}
                </p>

                {/* Score Summary */}
                <div className="flex justify-center gap-4 mb-8 flex-wrap">
                    {scores.slice(0, numPlayers).map((score, i) => (
                        <div key={i} className="bg-sky-50 px-4 py-2 rounded-xl border border-sky-200">
                            <div className="text-xs font-bold text-starkids-blue">P{i + 1}</div>
                            <div className="font-lobster text-xl">{score}</div>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onRestart}
                    className="font-lobster text-2xl px-10 py-3 rounded-full text-white transition-transform duration-200 transform hover:-translate-y-1 active:translate-y-1 bg-[#4caf50] shadow-[0_4px_0_#388e3c] flex items-center gap-2 mx-auto"
                >
                    <span>🔄</span> Jogar Novamente
                </button>
            </div>
        </div>
    );
};
