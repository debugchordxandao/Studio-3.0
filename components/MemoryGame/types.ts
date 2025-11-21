export interface NoteData {
    name: string;
    color: string; // Tailwind class or hex
    textColor: string;
}

export interface Card {
    id: string;
    noteName: string;
    color: string;
    isFlipped: boolean;
    isMatched: boolean;
}
