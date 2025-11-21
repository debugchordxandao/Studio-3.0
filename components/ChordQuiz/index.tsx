import React, { useState, useEffect, useCallback } from 'react';
import { ChordCanvas } from './ChordCanvas';
import { GUITAR_CHORDS as CHORDS } from '../../constants';
import confetti from 'canvas-confetti';

// Simple array shuffle
function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

export const ChordQuiz: React.FC = () => {
    const chordKeys = Object.keys(CHORDS);

    const [score, setScore] = useState(0);
    const [targetChord, setTargetChord] = useState<string>("");
    const [options, setOptions] = useState<string[]>([]);
    const [feedbackState, setFeedbackState] = useState<'idle' | 'correct' | 'wrong'>('idle');
    const [wrongOption, setWrongOption] = useState<string | null>(null);

    const generateLevel = useCallback(() => {
        // Pick random target
        const randomTarget = chordKeys[Math.floor(Math.random() * chordKeys.length)];

        // Pick 3 unique distractors
        const distractors: string[] = [];
        while (distractors.length < 3) {
            const r = chordKeys[Math.floor(Math.random() * chordKeys.length)];
            if (r !== randomTarget && !distractors.includes(r)) {
                distractors.push(r);
            }
        }

        const allOptions = shuffleArray([randomTarget, ...distractors]);

        setTargetChord(randomTarget);
        setOptions(allOptions);
        setFeedbackState('idle');
        setWrongOption(null);
    }, [chordKeys]);

    // Initial Load
    useEffect(() => {
        generateLevel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleGuess = (selectedOption: string) => {
        if (feedbackState === 'correct') return; // Prevent clicks during success animation

        if (selectedOption === targetChord) {
            // Correct!
            setFeedbackState('correct');
            setScore(prev => prev + 1);

            // Visual Confetti
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#8a2be2', '#039be5', '#fdd835', '#e57373']
            });

            // Wait and next level
            setTimeout(() => {
                generateLevel();
            }, 1200);

        } else {
            // Wrong!
            setFeedbackState('wrong');
            setWrongOption(selectedOption);

            // Reset 'wrong' state after animation allows re-trying without resetting level (optional)
            // Or we can keep it red. Let's keep it red for a moment.
            setTimeout(() => {
                setFeedbackState('idle');
                setWrongOption(null);
            }, 500);
        }
    };

    // Helper to format button text (remove parenthesis for cleaner mobile UI if needed, or keep full)
    // Based on reference, full name is nice.
    const formatButtonText = (name: string) => {
        return name;
    };

    return (
        <div className="w-full max-w-2xl flex flex-col items-center pt-32 mx-auto">

            {/* Título */}
            <h1 className="font-lobster text-5xl md:text-6xl text-white mb-6 text-center drop-shadow-[2px_2px_0_#0277bd]">
                Quiz dos Acordes
            </h1>

            {/* Placar */}
            <div className="bg-white px-8 py-3 rounded-full shadow-lg border-4 border-sky-200 mb-8 transform hover:scale-105 transition-transform">
                <span className="font-lobster text-2xl text-sky-800">
                    Acertos: <span className="text-green-500 text-3xl ml-2">{score}</span>
                </span>
            </div>

            {/* Área do Jogo */}
            <div className="w-full bg-white/90 backdrop-blur-sm p-6 rounded-[40px] shadow-xl border-4 border-white relative">

                {/* Canvas Container com Animação */}
                <div className={`
          bg-white p-2 rounded-2xl shadow-inner border border-gray-200 mb-8 mx-auto w-full max-w-[280px] md:max-w-[320px]
          transition-transform duration-500
          ${feedbackState === 'correct' ? 'animate-pop scale-105 ring-4 ring-green-500' : ''}
        `}>
                    {targetChord && <ChordCanvas chordName={targetChord} />}
                </div>

                {/* Grid de Opções */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {options.map((option) => {
                        const isCorrect = feedbackState === 'correct' && option === targetChord;
                        const isWrong = wrongOption === option;

                        let btnClass = "bg-white hover:bg-gray-50 text-sky-700 border-sky-400"; // Default
                        if (isCorrect) btnClass = "bg-green-500 text-white border-green-700 shadow-[0_4px_0_#1b5e20] translate-y-1";
                        else if (isWrong) btnClass = "bg-red-400 text-white border-red-700 animate-shake";
                        else btnClass = "bg-white hover:-translate-y-1 text-sky-700 border-sky-200 shadow-[0_4px_0_#81d4fa] active:translate-y-1 active:shadow-none";

                        return (
                            <button
                                key={option}
                                onClick={() => handleGuess(option)}
                                disabled={feedbackState === 'correct'}
                                className={`
                  font-poppins font-semibold text-lg py-4 px-6 rounded-2xl border-b-4 transition-all duration-200
                  flex items-center justify-center text-center min-h-[80px]
                  ${btnClass}
                `}
                            >
                                {formatButtonText(option)}
                            </button>
                        );
                    })}
                </div>

                {feedbackState === 'correct' && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="font-lobster text-6xl text-green-500 drop-shadow-[0_4px_0_#fff] animate-pop">
                            Incrível!
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
};
