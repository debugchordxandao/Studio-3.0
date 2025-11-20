export type ColorName = 'purple' | 'blue' | 'salmon' | 'green' | 'yellow' | 'orange' | 'red' | 'black';

export interface ColorOption {
    name: ColorName;
    hex: string;
    label: string;
}

export const STARKIDS_COLORS: ColorOption[] = [
    { name: 'black', hex: '#000000', label: 'Preto' },
    { name: 'purple', hex: '#8a2be2', label: 'Roxo' },
    { name: 'blue', hex: '#039be5', label: 'Azul' },
    { name: 'salmon', hex: '#e57373', label: 'Salmão' },
    { name: 'green', hex: '#43a047', label: 'Verde' },
    { name: 'yellow', hex: '#fdd835', label: 'Amarelo' },
    { name: 'orange', hex: '#fb8c00', label: 'Laranja' },
    { name: 'red', hex: '#d32f2f', label: 'Vermelho' },
];

export type FontSize = '3' | '5' | '7'; // HTML font sizes (1-7)

export interface FontSizeOption {
    value: FontSize;
    label: string;
}

export const FONT_SIZES: FontSizeOption[] = [
    { value: '3', label: 'Pequeno' },
    { value: '5', label: 'Médio' },
    { value: '7', label: 'Grande' },
];

// --- DADOS DE REFERÊNCIA STARKIDS ---

export const NOTE_COLORS: Record<string, string> = {
    "C": "#8a2be2", "D": "#039be5", "E": "#e57373", "F": "#43a047",
    "G": "#fdd835", "A": "#fb8c00", "B": "#d32f2f",
    "DÓ": "#8a2be2", "RÉ": "#039be5", "MI": "#e57373", "FÁ": "#43a047",
    "SOL": "#fdd835", "LÁ": "#fb8c00", "SI": "#d32f2f"
};

// Piano Keys: 0=C, 1=D, 2=E, 3=F, 4=G, 5=A, 6=B. 
// High codes (100+) map to positions relative to white keys for drawing logic.
export const PIANO_CHORDS: Record<string, number[]> = {
    "C (Dó)": [0, 2, 4], "D (Ré)": [1, 103, 5], "E (Mi)": [2, 104, 6],
    "F (Fá)": [3, 5, 7], "G (Sol)": [4, 6, 8], "A (Lá)": [5, 107, 9],
    "B (Si)": [6, 108, 110], "Cm (Dó m)": [0, 101, 4], "Dm (Ré m)": [1, 3, 5],
    "Em (Mi m)": [2, 4, 6], "Fm (Fá m)": [3, 104, 7], "Gm (Sol m)": [4, 105, 8],
    "Am (Lá m)": [5, 7, 9], "Bm (Si m)": [6, 8, 110]
};

// Guitar: Array of 6 strings (Low E to High E). -1=Mute, 0=Open, >0=Fret
export const GUITAR_CHORDS: Record<string, number[]> = {
    "C (Dó)": [-1, 3, 2, 0, 1, 0], "D (Ré)": [-1, -1, 0, 2, 3, 2],
    "E (Mi)": [0, 2, 2, 1, 0, 0], "F (Fá)": [1, 3, 3, 2, 1, 1],
    "G (Sol)": [3, 2, 0, 0, 0, 3], "A (Lá)": [-1, 0, 2, 2, 2, 0],
    "B (Si)": [-1, 2, 4, 4, 4, 2], "Dm (Ré m)": [-1, -1, 0, 2, 3, 1],
    "Em (Mi m)": [0, 2, 2, 0, 0, 0], "Am (Lá m)": [-1, 0, 2, 2, 1, 0]
};
