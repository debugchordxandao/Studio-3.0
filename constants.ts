import { NoteColor, PianoConfig, GuitarConfig, GuitarChordData } from "./types";

// --- GLOBAL ---
// Points directly to the local file as requested.
// Ensure 'starkids_logo.png' exists in your public/root directory.
export const STARKIDS_LOGO_URL = "starkids_logo.png";

// --- PIANO DATA ---
export const PIANO_BASE_COLORS: NoteColor[] = [
  { note: "DÓ", color: "#9c27b0" }, // Roxo
  { note: "RÉ", color: "#03a9f4" }, // Azul Claro
  { note: "MI", color: "#e91e63" }, // Rosa
  { note: "FÁ", color: "#4caf50" }, // Verde
  { note: "SOL", color: "#ffeb3b" }, // Amarelo
  { note: "LÁ", color: "#ff9800" }, // Laranja
  { note: "SI", color: "#f44336" }, // Vermelho
];

// 14 Keys (2 Octaves)
export const PIANO_KEY_DATA = [...PIANO_BASE_COLORS, ...PIANO_BASE_COLORS];

export const BLACK_KEY_NAMES: Record<number, string[]> = {
  0: ["DÓ#", "RÉb"],
  1: ["RÉ#", "MIb"],
  3: ["FÁ#", "SOLb"],
  4: ["SOL#", "LÁb"],
  5: ["LÁ#", "SIb"],
  7: ["DÓ#", "RÉb"],
  8: ["RÉ#", "MIb"],
  10: ["FÁ#", "SOLb"],
  11: ["SOL#", "LÁb"],
  12: ["LÁ#", "SIb"],
};

// Number mapping: 0-13 are white keys. 100+ are black keys relative to their slot index.
export const PIANO_CHORDS: Record<string, number[]> = {
  "Piano Limpo": [],
  "Escala Completa": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
  "C (Dó Maior)": [0, 2, 4],
  "G (Sol Maior)": [4, 6, 8],
  "D (Ré Maior)": [1, 103, 5],
  "A (Lá Maior)": [5, 107, 9],
  "E (Mi Maior)": [2, 104, 6],
  "B (Si Maior)": [6, 108, 110],
  "F# / Gb (Fá# Maior)": [103, 105, 107],
  "Db (Réb Maior)": [100, 3, 104],
  "Ab (Láb Maior)": [104, 7, 108],
  "Eb (Mib Maior)": [101, 4, 105],
  "Bb (Sib Maior)": [105, 8, 10],
  "F (Fá Maior)": [3, 5, 7],
  "Am (Lá Menor)": [5, 7, 9],
  "Em (Mi Menor)": [2, 4, 6],
  "Bm (Si Menor)": [6, 8, 110],
  "F#m (Fá# Menor)": [103, 5, 107],
  "C#m (Dó# Menor)": [100, 2, 104],
  "G#m (Sol# Menor)": [104, 6, 108],
  "D#m / Ebm (Ré# Menor)": [101, 103, 105],
  "Bbm (Sib Menor)": [105, 107, 10],
  "Fm (Fá Menor)": [3, 104, 7],
  "Cm (Dó Menor)": [0, 101, 4],
  "Gm (Sol Menor)": [4, 105, 8],
  "Dm (Ré Menor)": [1, 3, 5],
};

// --- SCALES DATA ---
export interface ScaleData {
  indices: number[];
  fingeringLeft: string;
  fingeringRight: string;
  accidentals: string;
}

export const PIANO_SCALES: Record<string, ScaleData> = {
  "Dó Maior (C)": {
    indices: [0, 1, 2, 3, 4, 5, 6, 7], // C1 a C2
    fingeringLeft: "5-4-3-2-1-3-2-1",
    fingeringRight: "1-2-3-1-2-3-4-5",
    accidentals: "0",
  },
  "Réb Maior (Db)": {
    indices: [100, 101, 3, 103, 104, 105, 7, 107], // Db1 a Db2
    fingeringLeft: "3-2-1-4-3-2-1-3",
    fingeringRight: "2-3-1-2-3-4-1-2",
    accidentals: "5 Bemóis (b)",
  },
  "Ré Maior (D)": {
    indices: [1, 2, 103, 4, 5, 6, 107, 8], // D1 a D2
    fingeringLeft: "5-4-3-2-1-3-2-1",
    fingeringRight: "1-2-3-1-2-3-4-5",
    accidentals: "2 Sustenidos (#)",
  },
  "Mib Maior (Eb)": {
    indices: [101, 3, 4, 104, 105, 7, 8, 108], // Eb1 a Eb2
    fingeringLeft: "3-2-1-4-3-2-1-3",
    fingeringRight: "2-1-2-3-4-1-2-3",
    accidentals: "3 Bemóis (b)",
  },
  "Mi Maior (E)": {
    indices: [2, 103, 104, 5, 6, 107, 108, 9], // E1 a E2
    fingeringLeft: "5-4-3-2-1-3-2-1",
    fingeringRight: "1-2-3-1-2-3-4-5",
    accidentals: "4 Sustenidos (#)",
  },
  "Fá Maior (F)": {
    indices: [3, 4, 5, 105, 7, 8, 9, 10], // F1 a F2
    fingeringLeft: "5-4-3-2-1-3-2-1",
    fingeringRight: "1-2-3-4-1-2-3-4",
    accidentals: "1 Bemol (b)",
  },
  "Solb Maior (Gb)": {
    indices: [103, 104, 105, 6, 107, 108, 10, 110], // Gb1 a Gb2
    fingeringLeft: "4-3-2-1-3-2-1-4",
    fingeringRight: "2-3-4-1-2-3-1-2",
    accidentals: "6 Bemóis (b)",
  },
  "Sol Maior (G)": {
    indices: [4, 5, 6, 7, 8, 9, 103 + 7, 11], // G1 a G2
    fingeringLeft: "5-4-3-2-1-3-2-1",
    fingeringRight: "1-2-3-1-2-3-4-5",
    accidentals: "1 Sustenido (#)",
  },
  "Láb Maior (Ab)": {
    indices: [104, 105, 7, 107, 108, 3 + 7, 4 + 7, 104 + 7], // Ab1 a Ab2
    fingeringLeft: "3-2-1-4-3-2-1-3",
    fingeringRight: "2-3-1-2-3-1-2-3",
    accidentals: "4 Bemóis (b)",
  },
  "Lá Maior (A)": {
    indices: [5, 6, 107, 8, 9, 110, 111, 12], // A1 a A2
    fingeringLeft: "5-4-3-2-1-3-2-1",
    fingeringRight: "1-2-3-1-2-3-4-5",
    accidentals: "3 Sustenidos (#)",
  },
  "Sib Maior (Bb)": {
    indices: [105, 7, 8, 101 + 7, 3 + 7, 4 + 7, 5 + 7, 105 + 7], // Bb1 a Bb2
    fingeringLeft: "3-2-1-4-3-2-1-3",
    fingeringRight: "2-1-2-3-1-2-3-4",
    accidentals: "2 Bemóis (b)",
  },
  "Si Maior (B)": {
    indices: [6, 107, 108, 9, 110, 111, 112, 13], // B1 a B2
    fingeringLeft: "4-3-2-1-4-3-2-1",
    fingeringRight: "1-2-3-1-2-3-4-5",
    accidentals: "5 Sustenidos (#)",
  },
};

export const PIANO_CONFIG: PianoConfig = {
  width: 2800,
  height: 1800,
  paddingX: 50,
  pianoHeight: 900,
  blackKeyHeight: 560,
  capsuleHeight: 180,
  capsulePaddingBottom: 30,
  textDistance: 200,
  keysCount: 14,
  blackKeyWidthRatio: 0.55,
  capsuleWidthRatio: 0.75,
};

export const SCALE_CONFIG: PianoConfig = {
  ...PIANO_CONFIG,
  height: 2100, // Taller for the table
};

export const BLACK_KEYS_INDICES = [0, 1, 3, 4, 5, 7, 8, 10, 11, 12];

// --- GUITAR DATA ---
export const GUITAR_PALETTE: Record<string, string> = {
  C: "#8a2be2", // Roxo
  D: "#039be5", // Azul
  E: "#e57373", // Rosa/Salmão
  F: "#43a047", // Verde
  G: "#fdd835", // Amarelo
  A: "#fb8c00", // Laranja
  B: "#d32f2f", // Vermelho
};

export const GUITAR_NOTES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];
export const GUITAR_TUNING = [4, 9, 2, 7, 11, 4]; // E A D G B E (Standard)

export const GUITAR_CHORDS: Record<string, GuitarChordData> = {
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

export const GUITAR_CONFIG: GuitarConfig = {
  width: 1000,
  height: 1600,
  gridX: 150,
  gridY: 550,
  cellWidth: 140,
  cellHeight: 160,
  numStrings: 6,
  numFrets: 5,
  nutThickness: 25,
};
