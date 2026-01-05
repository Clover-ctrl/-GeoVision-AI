
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, MapPin, Search, RefreshCcw, Info, ExternalLink, Globe, Map as MapIcon, Layers, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { analyzeImage, locateSpot, fastCheck } from './services/geminiService';
import { AnalysisState, GroundingChunk, GeolocationResult } from './types';
import { ScanningOverlay } from './components/ScanningOverlay';

const ACCESS_KEY = "f8@Q$L2!9kA#7mZ&1P";

const LoginGate: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [inputKey, setInputKey] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey === ACCESS_KEY) {
      onAuth();
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 mb-6 shadow-2xl">
            <ShieldCheck className="w-12 h-12 text-sky-400" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">GeoVision Secure Access</h1>
          <p className="text-slate-400 text-sm uppercase tracking-[0.2em]">Forensic Intelligence Terminal</p>
        </div>

        <form 
          onSubmit={handleSubmit}
          className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000"
        >
          <div className="mb-6">
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">Authentication Key</label>
            <div className="relative group">
              <input 
                type="password"
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Enter access sequence..."
                className={`w-full bg-slate-950 border ${error ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-800 group-focus-within:border-sky-500/50'} text-white px-5 py-4 rounded-xl outline-none transition-all placeholder:text-slate-700`}
                autoFocus
              />
              <Lock className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${error ? 'text-red-500' : 'text-slate-700 group-focus-within:text-sky-500'} transition-colors`} />
            </div>
            {error && (
              <p className="text-red-500 text-[10px] font-bold mt-3 uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-3 h-3" /> Access Denied: Invalid Key
              </p>
            )}
          </div>

          <button 
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-[0.98] group"
          >
            Authenticate <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-center text-slate-600 text-[10px] uppercase tracking-widest leading-loose">
          Authorized personnel only. All access attempts are logged.<br />
          System: GeoVision-OS v2.5
        </p>
      </div>
    </div>
  );
};

const InteractiveMap: React.FC<{ result: GeolocationResult }> = ({ result }) => {
  const [mapMode, setMapMode] = useState<'standard' | 'satellite'>('satellite');
  
  const query = result.coordinates?.query || result.chunks.find(c => c.maps)?.maps?.title || "selected location";
  const lat = result.coordinates?.lat;
  const lng = result.coordinates?.lng;

  const mapUrl = mapMode === 'satellite' 
    ? `https://maps.google.com/maps?q=${encodeURIComponent(lat && lng ? `${lat},${lng}` : query)}&t=k&z=17&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(lat && lng ? `${lat},${lng}` : query)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-slate-900/80 rounded-3xl border border-sky-500/20 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="bg-slate-800/50 p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-sky-400" />
          <h3 className="font-bold text-slate-200 text-sm">Tactical Reconnaissance</h3>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-700">
          <button 
            onClick={() => setMapMode('standard')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${mapMode === 'standard' ? 'bg-sky-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Vector
          </button>
          <button 
            onClick={() => setMapMode('satellite')}
            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${mapMode === 'satellite' ? 'bg-sky-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}
          >
            Satellite
          </button>
        </div>
      </div>
      
      <div className="relative aspect-video w-full bg-slate-950">
        <iframe
          title="Tactical Map"
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src={mapUrl}
          className={`grayscale-[20%] ${mapMode === 'satellite' ? 'brightness-90 contrast-110' : ''}`}
        />
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
           <a 
            href={result.chunks.find(c => c.maps)?.maps?.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-3 bg-sky-500 hover:bg-sky-400 text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center"
            title="Open in Full Google Maps"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
        
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-sky-500/40 m-4 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-sky-500/40 m-4 pointer-events-none"></div>
      </div>
      
      <div className="p-4 bg-slate-950/40 text-[10px] text-slate-500 uppercase tracking-widest flex justify-between items-center">
        <span>GRID REF: {lat?.toFixed(4) || '???'}, {lng?.toFixed(4) || '???'}</span>
        <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> RENDERING ACTIVE</span>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
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
    if (!isAuthenticated) return;

    const getGreeting = async () => {
      try {
        const msg = await fastCheck("Provide a very short, professional greeting for a geolocation AI assistant. 10 words max.");
        setAiGreeting(msg);
      } catch (e) {
        setAiGreeting("Ready for global forensic analysis.");
      }
    };
    getGreeting();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }),
        () => console.warn("Geolocation permission denied. Results might be less accurate.")
      );
    }
  }, [isAuthenticated]);

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
      const description = await analyzeImage(image);
      setState(prev => ({ ...prev, isAnalyzing: false, description, isLocating: true, step: 'locating' }));
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
        error: "Triangulation failed. Ensure the image has visible landmarks and your network is stable." 
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

  if (!isAuthenticated) {
    return <LoginGate onAuth={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-10 px-4 scroll-smooth">
      <header className="max-w-4xl w-full text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4 animate-in fade-in zoom-in duration-500">
          <Globe className="w-10 h-10 text-sky-400" />
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">
            GeoVision AI
          </h1>
        </div>
        <p className="text-slate-400 text-lg animate-in fade-in duration-700 slide-in-from-top-2">{aiGreeting || "Ready for forensic analysis..."}</p>
      </header>

      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <section className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-sm lg:sticky lg:top-10">
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
              <p className="text-slate-500 group-hover:text-slate-300 font-medium">Click or drop image to begin</p>
              <p className="text-slate-600 text-xs mt-2 text-center px-4">Detect coordinates from architectural style and surroundings</p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden aspect-square shadow-2xl bg-black">
              <img src={image} alt="Uploaded" className="w-full h-full object-contain" />
              {(state.isAnalyzing || state.isLocating) && <ScanningOverlay />}
            </div>
          )}

          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />

          <button
            onClick={startAnalysis}
            disabled={!image || state.isAnalyzing || state.isLocating}
            className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3
              ${!image || state.isAnalyzing || state.isLocating 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 active:scale-95'}`}
          >
            {state.isAnalyzing ? <><Search className="animate-spin" /> Deep Scan Active...</> : state.isLocating ? <><MapPin className="animate-bounce" /> Locating...</> : <><Globe className="w-5 h-5" /> Analyze Geolocation</>}
          </button>
        </section>

        <section className="space-y-6">
          {state.locationResult && (
            <InteractiveMap result={state.locationResult} />
          )}

          {state.step !== 'idle' && state.step !== 'done' && (
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-4 flex items-center gap-2">
                <Info className="w-4 h-4" /> System Status
              </h3>
              <div className="space-y-4">
                <div className={`flex items-start gap-4 ${state.step === 'analyzing' ? 'opacity-100' : 'opacity-60'}`}>
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${state.step === 'analyzing' ? 'bg-sky-500 animate-pulse text-white' : 'bg-green-500 text-white'}`}>1</div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Visual Forensics</h4>
                    <p className="text-sm text-slate-400">Extracting architectural and environmental markers.</p>
                  </div>
                </div>
                <div className={`flex items-start gap-4 ${state.step === 'locating' ? 'opacity-100' : 'opacity-20'}`}>
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${state.step === 'locating' ? 'bg-sky-500 animate-pulse text-white' : 'bg-slate-800 text-slate-500'}`}>2</div>
                  <div>
                    <h4 className="font-semibold text-slate-200">Maps Grounding</h4>
                    <p className="text-sm text-slate-400">Triangulating via Google Maps satellite data.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {state.description && (
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl animate-in fade-in slide-in-from-right-4">
              <h3 className="text-slate-200 font-bold mb-3 flex items-center gap-2">Detected Indicators</h3>
              <div className="text-slate-400 text-sm leading-relaxed max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">
                {state.description.split('\n').map((line, i) => <p key={i} className="mb-2">{line}</p>)}
              </div>
            </div>
          )}

          {state.locationResult && (
            <div className="bg-gradient-to-br from-blue-600/10 to-sky-600/10 p-6 rounded-3xl border border-sky-500/20 shadow-xl">
               <h3 className="text-sky-400 font-bold text-xl mb-4 flex items-center gap-2">
                <MapPin className="w-6 h-6" /> Location Identified
              </h3>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 mb-4">
                <p className="text-slate-200 text-lg leading-snug">
                  {state.locationResult.text.replace(/COORDINATES: \[LAT: [\d.-]+, LNG: [\d.-]+\]/, '')}
                </p>
              </div>
              
              {state.locationResult.chunks.length > 0 && (
                <div className="grid grid-cols-1 gap-2">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 mb-1">External Evidence</p>
                  {state.locationResult.chunks.map((chunk, idx) => chunk.maps && (
                    <a 
                      key={idx}
                      href={chunk.maps.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-slate-950/80 hover:bg-sky-500/10 rounded-xl border border-slate-800 text-sky-400 transition-all group"
                    >
                      <span className="font-semibold truncate text-sm">{chunk.maps.title || "Map Link"}</span>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {state.error && (
            <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/30 text-red-400">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-500/20 rounded-lg shrink-0"><Info className="w-5 h-5" /></div>
                <div>
                  <h4 className="font-bold text-red-300">Analysis Error</h4>
                  <p className="text-sm opacity-80">{state.error}</p>
                  <button onClick={startAnalysis} className="mt-4 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">Retry Triangulation</button>
                </div>
              </div>
            </div>
          )}

          {!image && !state.error && (
            <div className="flex flex-col items-center justify-center h-80 text-center text-slate-700">
              <Globe className="w-20 h-20 mb-6 opacity-5 animate-pulse" />
              <p className="text-slate-500 text-sm">Visual feed required for geolocation triage.</p>
              <div className="flex gap-2 mt-4">
                <div className="w-2 h-2 rounded-full bg-slate-800 animate-ping"></div>
                <div className="w-2 h-2 rounded-full bg-slate-800 animate-ping [animation-delay:200ms]"></div>
                <div className="w-2 h-2 rounded-full bg-slate-800 animate-ping [animation-delay:400ms]"></div>
              </div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-20 py-8 border-t border-slate-900 w-full text-center text-slate-700 text-[10px] uppercase tracking-[0.2em]">
        <p>Forensic Imagery System // Neural Status: ONLINE</p>
        <p className="mt-2 opacity-50 italic">Utilizing Gemini Pro 3 & Flash Native Mapping Grounding</p>
      </footer>
    </div>
  );
};

export default App;
