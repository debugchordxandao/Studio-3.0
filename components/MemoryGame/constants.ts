import { NoteData } from './types';

// Data based strictly on Starkids palette provided
export const NOTES_DATA: NoteData[] = [
    { name: 'DÓ', color: '#8a2be2', textColor: '#FFFFFF' }, // Purple
    { name: 'RÉ', color: '#039be5', textColor: '#FFFFFF' }, // Blue
    { name: 'MI', color: '#e57373', textColor: '#FFFFFF' }, // Salmon
    { name: 'FÁ', color: '#43a047', textColor: '#FFFFFF' }, // Green
    { name: 'SOL', color: '#fdd835', textColor: '#333333' }, // Yellow (Dark text for contrast)
    { name: 'LÁ', color: '#fb8c00', textColor: '#FFFFFF' }, // Orange
    { name: 'SI', color: '#d32f2f', textColor: '#FFFFFF' }, // Red
];

export const SOUND_FREQUENCIES: Record<string, number> = {
    'DÓ': 261.63,
    'RÉ': 293.66,
    'MI': 329.63,
    'FÁ': 349.23,
    'SOL': 392.00,
    'LÁ': 440.00,
    'SI': 493.88
};
