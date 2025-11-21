import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MemoryCard } from './MemoryCard';
import { WinModal } from './WinModal';
import { NOTES_DATA, SOUND_FREQUENCIES } from './constants';
import { Card } from './types';

export const MemoryGame: React.FC = () => {
    // --- Game State ---
    const [cards, setCards] = useState<Card[]>([]);
    const [multiplier, setMultiplier] = useState<number>(1); // Difficulty

    // --- Multiplayer State ---
    const [numPlayers, setNumPlayers] = useState<number>(1);
    const [activePlayer, setActivePlayer] = useState<number>(0); // Index 0-3
    const [scores, setScores] = useState<number[]>([0, 0, 0, 0]);

    // --- Turn Logic State ---
    const [choiceOne, setChoiceOne] = useState<Card | null>(null);
    const [choiceTwo, setChoiceTwo] = useState<Card | null>(null);
    const [isProcessing, setIsProcessing] = useState(false); // Strict block for animations
    const [gameWon, setGameWon] = useState(false);

    // IDs of cards currently celebrating a match (before disappearing)
    const [successIds, setSuccessIds] = useState<string[]>([]);

    // Ref to track selection immediately (prevents rapid-click race conditions)
    const choiceOneRef = useRef<Card | null>(null);

    // --- Audio ---
    const audioCtxRef = useRef<AudioContext | null>(null);

    const playNote = (noteName: string) => {
        try {
            if (!audioCtxRef.current) {
                const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
                if (AudioContext) {
                    audioCtxRef.current = new AudioContext();
                }
            }
            const audioCtx = audioCtxRef.current;
            if (!audioCtx) return;
            if (audioCtx.state === 'suspended') audioCtx.resume();

            const oscillator = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(SOUND_FREQUENCIES[noteName] || 440, audioCtx.currentTime);

            gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.5);

            oscillator.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillator.start();
            oscillator.stop(audioCtx.currentTime + 0.5);
        } catch (e) {
            console.warn("Audio play failed", e);
        }
    };

    // --- Initialization ---
    const startNewGame = useCallback(() => {
        let deckData: typeof NOTES_DATA = [];
        for (let i = 0; i < multiplier; i++) {
            deckData = [...deckData, ...NOTES_DATA, ...NOTES_DATA];
        }

        const shuffledCards = deckData
            .sort(() => Math.random() - 0.5)
            .map((note, idx) => ({
                id: `${idx}-${Date.now()}-${Math.random()}`,
                noteName: note.name,
                color: note.color,
                isFlipped: false,
                isMatched: false,
            }));

        setCards(shuffledCards);
        setChoiceOne(null);
        setChoiceTwo(null);
        choiceOneRef.current = null; // Reset ref
        setIsProcessing(false);
        setGameWon(false);
        setSuccessIds([]);

        // Reset Scores and Turn
        setScores(new Array(4).fill(0));
        setActivePlayer(0);
    }, [multiplier]);

    useEffect(() => {
        startNewGame();
    }, [startNewGame]);

    // --- Core Logic ---

    const handleChoice = (card: Card) => {
        // STRICT BUG PREVENTION:
        // 1. Do not allow clicks if processing a match/mismatch (timeout active)
        // 2. Do not allow matched cards
        if (isProcessing || card.isMatched) return;

        // 3. Do not allow clicking the exact same card twice (checked against Ref for immediate response)
        if (choiceOneRef.current && choiceOneRef.current.id === card.id) return;

        playNote(card.noteName);

        // Use Ref to determine turn state instantly (ignoring potential render lag)
        if (choiceOneRef.current) {
            setChoiceTwo(card);
            setIsProcessing(true); // LOCK BOARD IMMEDIATELY
            // choiceOneRef will be cleared in resetTurn
        } else {
            choiceOneRef.current = card;
            setChoiceOne(card);
        }
    };

    // --- Match Evaluation ---
    useEffect(() => {
        if (choiceOne && choiceTwo) {

            if (choiceOne.noteName === choiceTwo.noteName) {
                // === MATCH ===
                // 1. Trigger Success Animation
                setSuccessIds([choiceOne.id, choiceTwo.id]);

                // 2. Wait 800ms before making them disappear so the user sees the match and animation
                setTimeout(() => {
                    setCards(prevCards => {
                        return prevCards.map(card => {
                            if (card.noteName === choiceOne.noteName) {
                                return { ...card, isMatched: true };
                            }
                            return card;
                        });
                    });

                    // Update Score for current player
                    setScores(prev => {
                        const newScores = [...prev];
                        newScores[activePlayer] += 1;
                        return newScores;
                    });

                    setSuccessIds([]); // End animation state (cards are now hidden via isMatched)

                    // Player KEEPS turn on match. Just reset choices.
                    resetTurn(true);
                }, 800);
            } else {
                // === NO MATCH ===
                setTimeout(() => resetTurn(false), 1000);
            }
        }
    }, [choiceOne, choiceTwo, activePlayer]);

    const resetTurn = (wasMatch: boolean) => {
        setChoiceOne(null);
        setChoiceTwo(null);
        choiceOneRef.current = null; // Reset ref
        setIsProcessing(false); // UNLOCK BOARD

        if (!wasMatch) {
            // Pass turn to next player if no match
            setActivePlayer(prev => (prev + 1) % numPlayers);
        }
    };

    // Check Win Condition
    useEffect(() => {
        if (cards.length > 0 && cards.every(card => card.isMatched)) {
            setTimeout(() => setGameWon(true), 500);
        }
    }, [cards]);

    // --- Rendering Helpers ---

    // Derived state for rendering flips to ensure UI sync
    const cardsToRender = cards.map(card => ({
        ...card,
        isFlipped: card.isMatched || (choiceOne?.id === card.id) || (choiceTwo?.id === card.id) || successIds.includes(card.id)
    }));

    const playerColors = [
        'text-starkids-purple border-starkids-purple bg-purple-50',
        'text-starkids-blue border-starkids-blue bg-sky-50',
        'text-starkids-green border-starkids-green bg-green-50',
        'text-starkids-orange border-starkids-orange bg-orange-50'
    ];

    return (
        <div className="w-full flex flex-col items-center font-poppins text-gray-800 pt-32">

            <h1 className="font-lobster text-5xl md:text-6xl text-[#0277bd] mb-6 text-center drop-shadow-[2px_2px_0_#fff]">
                Memória Musical
            </h1>

            {/* --- CONTROL PANEL --- */}
            <div className="bg-white p-4 rounded-[40px] shadow-xl border-4 border-white flex flex-wrap gap-4 items-center justify-center mb-6 w-full max-w-4xl z-10">

                {/* Player Count Selector */}
                <div className="flex flex-col items-center">
                    <span className="text-xs text-starkids-blue font-bold uppercase tracking-wider mb-1">Jogadores</span>
                    <div className="flex bg-[#e1f5fe] rounded-full p-1 border-2 border-[#81d4fa]">
                        {[1, 2, 3, 4].map(num => (
                            <button
                                key={num}
                                onClick={() => {
                                    setNumPlayers(num);
                                    startNewGame(); // Restart if player count changes
                                }}
                                className={`w-10 h-10 rounded-full font-lobster text-xl transition-all ${numPlayers === num
                                    ? 'bg-[#039be5] text-white shadow-md'
                                    : 'text-[#01579b] hover:bg-white/50'
                                    }`}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="w-px h-12 bg-gray-200 mx-2 hidden md:block"></div>

                {/* Difficulty Selector */}
                <div className="flex flex-col items-center">
                    <span className="text-xs text-starkids-blue font-bold uppercase tracking-wider mb-1">Dificuldade</span>
                    <select
                        value={multiplier}
                        onChange={(e) => setMultiplier(Number(e.target.value))}
                        className="font-lobster text-lg py-2 px-4 border-2 border-[#81d4fa] rounded-full text-[#01579b] bg-[#e1f5fe] cursor-pointer outline-none focus:ring-2 focus:ring-[#039be5] text-center h-11"
                    >
                        <option value={1}>14 Cartas</option>
                        <option value={2}>28 Cartas</option>
                        <option value={3}>42 Cartas</option>
                    </select>
                </div>

                <div className="w-px h-12 bg-gray-200 mx-2 hidden md:block"></div>

                {/* Restart Button */}
                <button
                    onClick={startNewGame}
                    className="font-lobster text-lg px-6 py-2 h-11 rounded-full text-white transition-all duration-200 transform hover:-translate-y-1 active:translate-y-1 bg-[#ff9800] shadow-[0_4px_0_#f57c00] flex items-center gap-2"
                >
                    <span>🔄</span> Reiniciar
                </button>
            </div>

            {/* --- SCOREBOARD --- */}
            <div className="flex gap-3 md:gap-6 mb-8 flex-wrap justify-center w-full max-w-4xl">
                {Array.from({ length: numPlayers }).map((_, index) => (
                    <div
                        key={index}
                        className={`relative flex flex-col items-center justify-center p-3 md:p-4 rounded-2xl min-w-[90px] md:min-w-[120px] transition-all duration-300 border-4 ${activePlayer === index
                            ? `${playerColors[index]} scale-110 shadow-lg z-10`
                            : 'bg-white border-transparent opacity-70 grayscale-[0.5]'
                            }`}
                    >
                        {/* Turn Indicator Arrow */}
                        {activePlayer === index && (
                            <div className="absolute -top-3 text-2xl animate-bounce">👇</div>
                        )}

                        <span className="font-poppins text-xs font-bold uppercase tracking-widest mb-1">
                            P{index + 1}
                        </span>
                        <span className="font-lobster text-4xl">
                            {scores[index]}
                        </span>
                        <span className="text-[10px] font-bold uppercase">Pares</span>
                    </div>
                ))}
            </div>

            {/* --- GAME GRID --- */}
            <div className={`grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3 w-full max-w-6xl`}>
                {cardsToRender.map(card => (
                    <MemoryCard
                        key={card.id}
                        card={card}
                        isSuccess={successIds.includes(card.id)}
                        onClick={handleChoice}
                        disabled={isProcessing || card.isMatched}
                    />
                ))}
            </div>

            <WinModal
                isOpen={gameWon}
                scores={scores}
                numPlayers={numPlayers}
                onRestart={startNewGame}
            />
        </div>
    );
};
