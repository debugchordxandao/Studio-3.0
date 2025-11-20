export interface NoteColor {
  note: string;
  color: string;
}

export interface PianoConfig {
  width: number;
  height: number;
  paddingX: number;
  pianoHeight: number;
  blackKeyHeight: number;
  capsuleHeight: number;
  capsulePaddingBottom: number;
  textDistance: number;
  keysCount: number;
  blackKeyWidthRatio: number;
  capsuleWidthRatio: number;
}

export interface GuitarConfig {
  width: number;
  height: number;
  gridX: number;
  gridY: number;
  cellWidth: number;
  cellHeight: number;
  numStrings: number;
  numFrets: number;
  nutThickness: number;
}

export type GuitarChordData = number[]; // array of 6 numbers representing frets (-1 for mute)
