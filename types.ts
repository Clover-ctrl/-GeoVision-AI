
export interface GroundingChunk {
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: string[];
    };
  };
  web?: {
    uri: string;
    title: string;
  };
}

export interface GeolocationResult {
  text: string;
  chunks: GroundingChunk[];
  coordinates?: {
    lat: number;
    lng: number;
    query?: string;
  };
}

export interface AnalysisState {
  isAnalyzing: boolean;
  isLocating: boolean;
  step: 'idle' | 'analyzing' | 'locating' | 'done' | 'error';
  error: string | null;
  description: string;
  locationResult: GeolocationResult | null;
}
