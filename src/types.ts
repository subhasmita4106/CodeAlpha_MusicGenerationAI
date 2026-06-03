export interface ModelCard {
  id: string;
  name: string;
  architecture: string;
  status: 'TRAINING' | 'IDLE' | 'COMPLETE';
  epoch?: string;
  loss?: string;
  samples?: string;
  parameters?: string;
  accuracy?: string;
  progress?: number; // 0-100 percentage
  type: 'lstm' | 'gan' | 'transformer';
}

export interface MidiFile {
  id: string;
  name: string;
  folder: string;
  size: string;
  fileCount: string;
}

export interface PreprocessingConfig {
  quantizationUnit: string;
  keyNormalization: boolean;
  velocityBins: number;
}

export interface TrainConfig {
  learningRate: number;
  batchSize: number;
  epochs: number;
  sequenceLength: number;
}

export interface MidiNote {
  id: string;
  pitch: string; // e.g. "E4", "G4"
  startStep: number; // 0-based steps
  duration: number; // in steps (e.g., 2 steps)
  colorType: 'primary' | 'secondary' | 'tertiary';
}

export interface ActivityFeedItem {
  id: string;
  timestamp: string;
  category: 'Training' | 'Export' | 'System' | 'Epoch';
  message: string;
  color: 'primary' | 'secondary' | 'tertiary' | 'neutral';
}
