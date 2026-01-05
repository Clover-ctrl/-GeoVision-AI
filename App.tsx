
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, MapPin, Search, RefreshCcw, Info, ExternalLink, Globe } from 'lucide-react';
import { analyzeImage, locateSpot, fastCheck } from './services/geminiService';
import { AnalysisState, GroundingChunk } from './types';
import { ScanningOverlay } from './components/ScanningOverlay';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [state, setState] = useState<AnalysisState>({
    isAnalyzing: false,
    isLocating: false,
    step: 'idle',
    error: null,
    description: '',
    locationResult: null,
  });
  
  const [aiGreeting, setAiGreeting] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Initial friendly AI greeting using Flash Lite
    const getGreeting = async () => {
      const msg = await fastCheck("Provide a very short, professional greeting for a geolocation AI assistant. 10 words max.");
      setAiGreeting(msg);
    };
    getGreeting();

    // Get user location for better grounding
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => console.warn("Geolocation permission denied. Results might be less accurate.")
      );
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setState({ ...state, step: 'idle', locationResult: null, description: '', error: null });
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;

    try {
      setState(prev => ({ ...prev, isAnalyzing: true, step: 'analyzing', error: null }));
      
      // Step 1: Deep Analysis with Gemini Pro
      const description = await analyzeImage(image);
      setState(prev => ({ ...prev, isAnalyzing: false, description, isLocating: true, step: 'locating' }));

      // Step 2: Pinpoint location with Gemini Flash and Maps Grounding
      const location = await locateSpot(description, image, userLocation || undefined);
      
      setState(prev => ({ 
        ...prev, 
        isLocating: false, 
        step: 'done', 
        locationResult: location 
      }));
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        isAnalyzing: false, 
        isLocating: false, 
        step: 'error', 
        error: "Failed to geolocate. Please check your API key and network connection." 
      }));
    }
  };

  const reset = () => {
    setImage(null);
    setState({
      isAnalyzing: false,
      isLocating: false,
      step: 'idle',
      error: null,
      description: '',
      locationResult: null,
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-10 px-4">
      <header className="max-w-4xl w-full text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Globe className="w-10 h-10 text-sky-400" />
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
            GeoVision AI
          </h1>
        </div>
        <p className="text-slate-400 text-lg">{aiGreeting || "Loading AI assistant..."}</p>
      </header>

      <main className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Left Column: Input & Preview */}
        <section className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Camera className="w-5 h-5 text-sky-400" />
              Source Image
            </h2>
            <button 
              onClick={reset}
              className="text-slate-500 hover:text-sky-400 transition-colors"
              title="Clear image"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>

          {!image ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-800 rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-sky-500/50 hover:bg-sky-500/5 transition-all group"
            >
              <Upload className="w-12 h-12 text-slate-700 group-hover:text-sky-400 transition-colors mb-4" />
              <p className="text-slate-500 group-hover:text-slate-300">Drop a photo or click to upload</p>
              <p className="text-slate-600 text-xs mt-2">Buildings, landmarks, or street views work best</p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden aspect-square shadow-2xl bg-black">
              <img src={image} alt="Uploaded" className="w-full h-full object-contain" />
              {(state.isAnalyzing || state.isLocating) && <ScanningOverlay />}
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />

          <button
            onClick={startAnalysis}
            disabled={!image || state.isAnalyzing || state.isLocating}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3
              ${!image || state.isAnalyzing || state.isLocating 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 active:scale-95'}`}
          >
            {state.isAnalyzing ? (
              <><Search className="animate-spin" /> Deep Forensic Analysis...</>
            ) : state.isLocating ? (
              <><MapPin className="animate-bounce" /> Pinpointing on Maps...</>
            ) : (
              <><Globe className="w-5 h-5" /> Geocode this Image</>
            )}
          </button>
        </section>

        {/* Right Column: Results */}
        <section className="space-y-6">
          {/* Status Tracker */}
          {state.step !== 'idle' && (
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Live Analysis Stream
              </h3>
              
              <div className="space-y-4">
                {/* Step 1 Indicator */}
                <div className={`flex items-start gap-4 ${state.step === 'analyzing' ? 'opacity-100' : 'opacity-60'}`}>
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${state.step === 'analyzing' ? 'bg-sky-500 animate-pulse text-white' : 'bg-green-500 text-white'}`}>
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Image Forensics</h4>
                    <p className="text-sm text-slate-400">Deconstructing architectural features and climate markers.</p>
                  </div>
                </div>

                {/* Step 2 Indicator */}
                <div className={`flex items-start gap-4 ${state.step === 'locating' ? 'opacity-100' : state.step === 'done' ? 'opacity-60' : 'opacity-20'}`}>
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                    ${state.step === 'locating' ? 'bg-sky-500 animate-pulse text-white' : state.step === 'done' ? 'bg-green-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Google Maps Grounding</h4>
                    <p className="text-sm text-slate-400">Verifying specific landmarks against global satellite data.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detailed Observations (Gemini Pro) */}
          {state.description && (
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-slate-200 font-bold mb-3 flex items-center gap-2">
                AI Observations
              </h3>
              <div className="text-slate-400 text-sm leading-relaxed max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                {state.description}
              </div>
            </div>
          )}

          {/* Final Result (Gemini Flash + Grounding) */}
          {state.locationResult && (
            <div className="bg-gradient-to-br from-blue-600/20 to-sky-600/20 p-6 rounded-3xl border border-sky-500/30 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-sky-400 font-bold text-xl mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6" />
                Confirmed Location
              </h3>
              
              <div className="bg-slate-950/50 p-4 rounded-xl mb-6 border border-slate-800">
                <p className="text-slate-200 text-lg font-medium italic">
                  "{state.locationResult.text}"
                </p>
              </div>

              {state.locationResult.chunks.length > 0 && (
                <div className="space-y-3">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Reference Links</p>
                  {state.locationResult.chunks.map((chunk, idx) => (
                    <div key={idx} className="flex flex-col gap-2">
                      {chunk.maps && (
                        <a 
                          href={chunk.maps.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-sky-400 transition-all group"
                        >
                          <span className="font-semibold truncate">{chunk.maps.title || "View on Google Maps"}</span>
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                      {chunk.web && (
                        <a 
                          href={chunk.web.uri} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-3 bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 text-slate-300 transition-all group"
                        >
                          <span className="truncate">{chunk.web.title || "Reference Info"}</span>
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Error Message */}
          {state.error && (
            <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/30 text-red-400 flex items-start gap-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold">Analysis Failed</h4>
                <p className="text-sm opacity-80">{state.error}</p>
                <button 
                  onClick={startAnalysis}
                  className="mt-3 text-xs font-bold underline hover:no-underline"
                >
                  Retry Search
                </button>
              </div>
            </div>
          )}

          {/* Idle state helper */}
          {!image && !state.error && (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-600">
              <Globe className="w-16 h-16 mb-4 opacity-10" />
              <p>Upload a photo to begin global tracking.</p>
              <p className="text-xs max-w-xs mt-2 italic">Uses Gemini 3 Pro for visual forensics and 2.5 Flash for mapping grounding.</p>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-20 py-8 border-t border-slate-900 w-full text-center text-slate-600 text-sm">
        <p>&copy; 2024 GeoVision AI. Advanced imagery forensic geolocation system.</p>
      </footer>
    </div>
  );
};

export default App;
