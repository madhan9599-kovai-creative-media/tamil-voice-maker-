
export interface AudioGenerationResult {
  id: string;
  text: string;
  style: string;
  voice: string;
  audioUrl: string;
  timestamp: number;
}

export enum VoiceName {
  Kore = 'Kore',
  Puck = 'Puck',
  Charon = 'Charon',
  Zephyr = 'Zephyr',
  Fenrir = 'Fenrir'
}

export interface TTSState {
  text: string;
  style: string;
  voice: VoiceName;
  isGenerating: boolean;
  error: string | null;
  history: AudioGenerationResult[];
}
