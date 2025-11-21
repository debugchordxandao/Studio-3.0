import React from 'react';
import { Card } from './types';

interface MemoryCardProps {
    card: Card;
    onClick: (card: Card) => void;
    disabled: boolean;
    isSuccess?: boolean;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ card, onClick, disabled, isSuccess }) => {

    const handleClick = () => {
        if (!disabled && !card.isFlipped && !card.isMatched) {
            onClick(card);
        }
    };

    // Determine text color based on background (simple heuristic from constants)
    const isYellow = card.color === '#fdd835'; // Starkids Yellow
    const textColor = isYellow ? 'text-gray-800' : 'text-white';

    return (
        // Wrapper applies bounce on success. Z-index boosted to show above neighbors during animation
        <div
            className={`relative w-full aspect-[3/4] perspective-1000 cursor-pointer group ${isSuccess ? 'animate-bounce z-20' : 'z-0'}`}
            onClick={handleClick}
        >
            <div
                className={`w-full h-full relative transition-all duration-700 transform-style-3d shadow-lg rounded-xl ${card.isFlipped ? 'rotate-y-180' : ''
                    } ${card.isMatched ? 'opacity-0 pointer-events-none scale-75' : 'md:hover:scale-[1.02] active:scale-95'} ${isSuccess ? 'ring-4 ring-starkids-green shadow-[0_0_25px_rgba(67,160,71,0.6)]' : ''
                    }`}
            >
                {/* FRONT FACE (Hidden initially) - Shows Note */}
                <div
                    className={`absolute w-full h-full backface-hidden rounded-xl flex items-center justify-center rotate-y-180 border-4 border-white box-border`}
                    style={{ backgroundColor: card.color }}
                >
                    <span className={`font-lobster text-3xl md:text-4xl ${textColor} drop-shadow-md select-none`}>
                        {card.noteName}
                    </span>
                </div>

                {/* BACK FACE (Visible initially) - White with Star */}
                <div className="absolute w-full h-full backface-hidden bg-white rounded-xl flex items-center justify-center border-4 border-white shadow-inner">
                    <div className="w-full h-full bg-sky-50 rounded-lg flex items-center justify-center border-2 border-sky-100">
                        {/* Star Icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-12 h-12 text-starkids-yellow drop-shadow-sm transform md:group-hover:scale-110 transition-transform">
                            <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};
