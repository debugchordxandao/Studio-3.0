export const STARKIDS_PALETTE: Record<string, string> = {
    "C": "#8a2be2", "D": "#039be5", "E": "#e57373",
    "F": "#43a047", "G": "#fdd835", "A": "#fb8c00", "B": "#d32f2f"
};

export const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

// Standard Tuning (E A D G B E) -> Indices 4, 9, 2, 7, 11, 4
export const TUNING = [4, 9, 2, 7, 11, 4];

export const CHORDS: Record<string, number[]> = {
    // --- MAIORES ---
    "C (Dó Maior)": [-1, 3, 2, 0, 1, 0],
    "D (Ré Maior)": [-1, -1, 0, 2, 3, 2],
    "E (Mi Maior)": [0, 2, 2, 1, 0, 0],
    "F (Fá Maior)": [1, 3, 3, 2, 1, 1],
    "G (Sol Maior)": [3, 2, 0, 0, 0, 3],
    "A (Lá Maior)": [-1, 0, 2, 2, 2, 0],
    "B (Si Maior)": [-1, 2, 4, 4, 4, 2],

    // --- MENORES ---
    "Cm (Dó Menor)": [-1, 3, 5, 5, 4, 3],
    "Dm (Ré Menor)": [-1, -1, 0, 2, 3, 1],
    "Em (Mi Menor)": [0, 2, 2, 0, 0, 0],
    "Fm (Fá Menor)": [1, 3, 3, 1, 1, 1],
    "Gm (Sol Menor)": [3, 5, 5, 3, 3, 3],
    "Am (Lá Menor)": [-1, 0, 2, 2, 1, 0],
    "Bm (Si Menor)": [-1, 2, 4, 4, 3, 2],

    // --- SÉTIMAS (DOMINANTES) ---
    "C7 (Dó com 7ª)": [-1, 3, 2, 3, 1, 0],
    "D7 (Ré com 7ª)": [-1, -1, 0, 2, 1, 2],
    "E7 (Mi com 7ª)": [0, 2, 0, 1, 0, 0],
    "F7 (Fá com 7ª)": [1, 3, 1, 2, 1, 1],
    "G7 (Sol com 7ª)": [3, 2, 0, 0, 0, 1],
    "A7 (Lá com 7ª)": [-1, 0, 2, 0, 2, 0],
    "B7 (Si com 7ª)": [-1, 2, 1, 2, 0, 2],

    // --- SÉTIMAS MAIORES (Major 7) ---
    "Cmaj7 (Dó 7M)": [-1, 3, 2, 0, 0, 0],
    "Dmaj7 (Ré 7M)": [-1, -1, 0, 2, 2, 2],
    "Emaj7 (Mi 7M)": [0, 2, 1, 1, 0, 0],
    "Fmaj7 (Fá 7M)": [-1, -1, 3, 2, 1, 0],
    "Gmaj7 (Sol 7M)": [3, 2, 0, 0, 0, 2],
    "Amaj7 (Lá 7M)": [-1, 0, 2, 1, 2, 0]
};

export const TAB_STRINGS = ['e', 'B', 'G', 'D', 'A', 'E'];
