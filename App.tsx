
import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, MapPin, Search, RefreshCcw, Info, ExternalLink, Globe, Map as MapIcon, Layers, Lock, ShieldCheck, ArrowRight, AlertCircle } from 'lucide-react';
import { analyzeImage, locateSpot, fastCheck } from './services/geminiService';
import { AnalysisState, GroundingChunk, GeolocationResult } from './types';
import { ScanningOverlay } from './components/ScanningOverlay';

// Obfuscation Layer
const _Z = (v: string) => atob(v);
const _K = (s: string) => s.split('').reverse().join('');
const _S = _Z("UDQmWm03I0FrOSExMkwkUUA4Zg=="); // Obfuscated Key

const InteractiveMap: React.FC<{ result: GeolocationResult }> = ({ result }) => {
  const [m, setM] = useState<'standard' | 'satellite'>(_Z("c2F0ZWxsaXRl") as any);
  const q = result.coordinates?.query || result.chunks.find(c => c.maps)?.maps?.title || _Z("c2VsZWN0ZWQgbG9jYXRpb24=");
  const lt = result.coordinates?.lat;
  const lg = result.coordinates?.lng;

  const url = m === _Z("c2F0ZWxsaXRl")
    ? `https://maps.google.com/maps?q=${encodeURIComponent(lt && lg ? `${lt},${lg}` : q)}&t=k&z=17&ie=UTF8&iwloc=&output=embed`
    : `https://maps.google.com/maps?q=${encodeURIComponent(lt && lg ? `${lt},${lg}` : q)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  return (
    <div className="bg-slate-900/80 rounded-3xl border border-sky-500/20 overflow-hidden shadow-2xl animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="bg-slate-800/50 p-4 border-b border-slate-700/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapIcon className="w-5 h-5 text-sky-400" />
          <h3 className="font-bold text-slate-200 text-sm">{_Z("VGFjdGljYWwgUmVjb25uYWlzc2FuY2U=")}</h3>
        </div>
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-700">
          <button onClick={() => setM(_Z("c3RhbmRhcmQ=") as any)} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${m === _Z("c3RhbmRhcmQ=") ? 'bg-sky-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{_Z("VmVjdG9y")}</button>
          <button onClick={() => setM(_Z("c2F0ZWxsaXRl") as any)} className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${m === _Z("c2F0ZWxsaXRl") ? 'bg-sky-500 text-white' : 'text-slate-500 hover:text-slate-300'}`}>{_Z("U2F0ZWxsaXRl")}</button>
        </div>
      </div>
      <div className="relative aspect-video w-full bg-slate-950">
        <iframe title={_Z("VGFjdGljYWwgTWFw")} width="100%" height="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0} src={url} className={`grayscale-[20%] ${m === _Z("c2F0ZWxsaXRl") ? 'brightness-90 contrast-110' : ''}`} />
        <div className="absolute bottom-4 right-4 flex flex-col gap-2">
           <a href={result.chunks.find(c => c.maps)?.maps?.uri || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-sky-500 hover:bg-sky-400 text-white rounded-full shadow-lg transition-transform hover:scale-110 active:scale-95 flex items-center justify-center">
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-sky-500/40 m-4 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-sky-500/40 m-4 pointer-events-none"></div>
      </div>
      <div className="p-4 bg-slate-950/40 text-[10px] text-slate-500 uppercase tracking-widest flex justify-between items-center">
        <span>{_Z("R1JJRCBSRUY6")} {lt?.toFixed(4) || '???'}, {lg?.toFixed(4) || '???'}</span>
        <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {_Z("UkVOREVSSU5HIEFDVElWRQ==")}</span>
      </div>
    </div>
  );
};

const LoginGate: React.FC<{ onAuth: () => void }> = ({ onAuth }) => {
  const [v, setV] = useState("");
  const [e, setE] = useState(false);
  const h = (event: React.FormEvent) => {
    event.preventDefault();
    if (_K(v) === _K(_S)) { onAuth(); } else { setE(true); setTimeout(() => setE(false), 2000); }
  };
  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="max-w-md w-full z-10">
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center p-4 bg-slate-900 rounded-2xl border border-slate-800 mb-6 shadow-2xl"><ShieldCheck className="w-12 h-12 text-sky-400" /></div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">{_Z("R2VvVmlzaW9uIFNlY3VyZSBBY2Nlc3M=")}</h1>
          <p className="text-slate-400 text-sm uppercase tracking-[0.2em]">{_Z("Rm9yZW5zaWMgSW50ZWxsaWdlbmNlIFRlcm1pbmFs")}</p>
        </div>
        <form onSubmit={h} className="bg-slate-900/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="mb-6">
            <label className="block text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">{_Z("QXV0aGVudGljYXRpb24gS2V5")}</label>
            <div className="relative group">
              <input type="password" value={v} onChange={(ev) => setV(ev.target.value)} placeholder={_Z("RW50ZXIgYWNjZXNzIHNlcXVlbmNlLi4u")} className={`w-full bg-slate-950 border ${e ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-slate-800 group-focus-within:border-sky-500/50'} text-white px-5 py-4 rounded-xl outline-none transition-all placeholder:text-slate-700`} autoFocus />
              <Lock className={`absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 ${e ? 'text-red-500' : 'text-slate-700 group-focus-within:text-sky-500'} transition-colors`} />
            </div>
            {e && <p className="text-red-500 text-[10px] font-bold mt-3 uppercase tracking-widest flex items-center gap-2 animate-in fade-in slide-in-from-top-1"><AlertCircle className="w-3 h-3" /> {_Z("QWNjZXNzIERlbmllZDogSW52YWxpZCBLZXk=")}</p>}
          </div>
          <button type="submit" className="w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-sky-500/20 active:scale-[0.98] group">{_Z("QXV0aGVudGljYXRl")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></button>
        </form>
        <p className="mt-8 text-center text-slate-600 text-[10px] uppercase tracking-widest leading-loose">{_Z("QXV0aG9yaXplZCBwZXJzb25uZWwgb25seS4gQWxsIGFjY2VzcyBhdHRlbXB0cyBhcmUgbG9nZ2VkLg==")}<br />{_Z("U3lzdGVtOiBHZW9WaXNpb24tT1MgdjIuNQ==")}</p>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [a, setA] = useState(false);
  const [i, setI] = useState<string | null>(null);
  const [l, setL] = useState<{ latitude: number; longitude: number } | null>(null);
  const [s, setS] = useState<AnalysisState>({ isAnalyzing: false, isLocating: false, step: 'idle', error: null, description: '', locationResult: null });
  const [g, setG] = useState<string>('');
  const r = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!a) return;
    const fetchG = async () => {
      try { const m = await fastCheck(_Z("UHJvdmlkZSBhIHZlcnkgc2hvcnQsIHByb2Zlc3Npb25hbCBncmVldGluZyBmb3IgYSBnZW9sb2NhdGlvbiBBSSBhc3Npc3RhbnQuIDEwIHdvcmRzIG1heC4=")); setG(m); }
      catch (e) { setG(_Z("UmVhZHkgZm9yIGdsb2JhbCBmb3JlbnNpYyBhbmFseXNpcy4=")); }
    };
    fetchG();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => setL({ latitude: pos.coords.latitude, longitude: pos.coords.longitude }));
    }
  }, [a]);

  const h_f_c = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const file = ev.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => { setI(reader.result as string); setS({ ...s, step: 'idle', locationResult: null, description: '', error: null }); };
      reader.readAsDataURL(file);
    }
  };

  const exec = async () => {
    if (!i) return;
    try {
      setS(p => ({ ...p, isAnalyzing: true, step: 'analyzing', error: null }));
      const d = await analyzeImage(i);
      setS(p => ({ ...p, isAnalyzing: false, description: d, isLocating: true, step: 'locating' }));
      const loc = await locateSpot(d, i, l || undefined);
      setS(p => ({ ...p, isLocating: false, step: 'done', locationResult: loc }));
    } catch (err: any) {
      setS(p => ({ ...p, isAnalyzing: false, isLocating: false, step: 'error', error: _Z("VHJpYW5ndWxhdGlvbiBmYWlsZWQuIEVuc3VyZSB0aGUgaW1hZ2UgaGFzIHZpc2libGUgbGFuZG1hcmtzIGFuZCB5b3VyIG5ldHdvcmsgaXMgc3RhYmxlLg==") }));
    }
  };

  const clr = () => { setI(null); setS({ isAnalyzing: false, isLocating: false, step: 'idle', error: null, description: '', locationResult: null }); };

  if (!a) { return <LoginGate onAuth={() => setA(true)} />; }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center py-10 px-4 scroll-smooth">
      <header className="max-w-4xl w-full text-center mb-12">
        <div className="flex items-center justify-center gap-2 mb-4 animate-in fade-in zoom-in duration-500">
          <Globe className="w-10 h-10 text-sky-400" />
          <h1 className="text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-blue-500">{_Z("R2VvVmlzaW9uIEFJ")}</h1>
        </div>
        <p className="text-slate-400 text-lg animate-in fade-in duration-700 slide-in-from-top-2">{g || _Z("UmVhZHkgZm9yIGZvcmVuc2ljIGFuYWx5c2lzLi4u")}</p>
      </header>

      <main className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <section className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl backdrop-blur-sm lg:sticky lg:top-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-2"><Camera className="w-5 h-5 text-sky-400" />{_Z("U291cmNlIEltYWdl")}</h2>
            <button onClick={clr} className="text-slate-500 hover:text-sky-400 transition-colors"><RefreshCcw className="w-5 h-5" /></button>
          </div>
          {!i ? (
            <div onClick={() => r.current?.click()} className="border-2 border-dashed border-slate-800 rounded-2xl aspect-square flex flex-col items-center justify-center cursor-pointer hover:border-sky-500/50 hover:bg-sky-500/5 transition-all group">
              <Upload className="w-12 h-12 text-slate-700 group-hover:text-sky-400 transition-colors mb-4" />
              <p className="text-slate-500 group-hover:text-slate-300 font-medium">{_Z("Q2xpY2sgb3IgZHJvcCBpbWFnZSB0byBiZWdpbg==")}</p>
              <p className="text-slate-600 text-xs mt-2 text-center px-4">{_Z("RGV0ZWN0IGNvb3JkaW5hdGVzIGZyb20gYXJjaGl0ZWN0dXJhbCBzdHlsZSBhbmQgc3Vycm91bmRpbmdz")}</p>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden aspect-square shadow-2xl bg-black">
              <img src={i} alt="" className="w-full h-full object-contain" />
              {(s.isAnalyzing || s.isLocating) && <ScanningOverlay />}
            </div>
          )}
          <input type="file" ref={r} onChange={h_f_c} accept="image/*" className="hidden" />
          <button onClick={exec} disabled={!i || s.isAnalyzing || s.isLocating} className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${!i || s.isAnalyzing || s.isLocating ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-sky-500 hover:bg-sky-400 text-white shadow-lg shadow-sky-500/20 active:scale-95'}`}>
            {s.isAnalyzing ? <><Search className="animate-spin" /> {_Z("RGVlcCBTY2FuIEFjdGl2ZS4uLg==")}</> : s.isLocating ? <><MapPin className="animate-bounce" /> {_Z("TG9jYXRpbmcuLi4=")}</> : <><Globe className="w-5 h-5" /> {_Z("QW5hbHl6ZSBHZW9sb2NhdGlvbg==")}</>}
          </button>
        </section>

        <section className="space-y-6">
          {s.locationResult && <InteractiveMap result={s.locationResult} />}
          {s.step !== 'idle' && s.step !== 'done' && (
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl">
              <h3 className="text-sm uppercase tracking-widest text-slate-500 font-bold mb-4 flex items-center gap-2"><Info className="w-4 h-4" /> {_Z("U3lzdGVtIFN0YXR1cw==")}</h3>
              <div className="space-y-4">
                <div className={`flex items-start gap-4 ${s.step === 'analyzing' ? 'opacity-100' : 'opacity-60'}`}>
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.step === 'analyzing' ? 'bg-sky-500 animate-pulse text-white' : 'bg-green-500 text-white'}`}>1</div>
                  <div><h4 className="font-semibold text-slate-200">{_Z("VmlzdWFsIEZvcmVuc2ljcw==")}</h4><p className="text-sm text-slate-400">{_Z("RXh0cmFjdGluZyBhcmNoaXRlY3R1cmFsIGFuZCBlbnZpcm9ubWVudGFsIG1hcmtlcnMu")}</p></div>
                </div>
                <div className={`flex items-start gap-4 ${s.step === 'locating' ? 'opacity-100' : 'opacity-20'}`}>
                  <div className={`mt-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${s.step === 'locating' ? 'bg-sky-500 animate-pulse text-white' : 'bg-slate-800 text-slate-500'}`}>2</div>
                  <div><h4 className="font-semibold text-slate-200">{_Z("TWFwcyBHcm91bmRpbmc=")}</h4><p className="text-sm text-slate-400">{_Z("VHJpYW5ndWxhdGluZyB2aWEgR29vZ2xlIE1hcHMgc2F0ZWxsaXRlIGRhdGEu")}</p></div>
                </div>
              </div>
            </div>
          )}
          {s.description && (
            <div className="bg-slate-900/50 p-6 rounded-3xl border border-slate-800 shadow-xl animate-in fade-in slide-in-from-right-4">
              <h3 className="text-slate-200 font-bold mb-3 flex items-center gap-2">{_Z("RGV0ZWN0ZWQgSW5kaWNhdG9ycw==")}</h3>
              <div className="text-slate-400 text-sm leading-relaxed max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-700">{s.description.split('\n').map((line, ix) => <p key={ix} className="mb-2">{line}</p>)}</div>
            </div>
          )}
          {s.locationResult && (
            <div className="bg-gradient-to-br from-blue-600/10 to-sky-600/10 p-6 rounded-3xl border border-sky-500/20 shadow-xl">
               <h3 className="text-sky-400 font-bold text-xl mb-4 flex items-center gap-2"><MapPin className="w-6 h-6" /> {_Z("TG9jYXRpb24gSWRlbnRpZmllZA==")}</h3>
              <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800 mb-4">
                <p className="text-slate-200 text-lg leading-snug">{s.locationResult.text.replace(/COORDINATES: \[LAT: [\d.-]+, LNG: [\d.-]+\]/, '')}</p>
              </div>
              {s.locationResult.chunks.length > 0 && (
                <div className="grid grid-cols-1 gap-2">
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-2 mb-1">{_Z("RXh0ZXJuYWwgRXZpZGVuY2U=")}</p>
                  {s.locationResult.chunks.map((ck, x) => ck.maps && (
                    <a key={x} href={ck.maps.uri} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 bg-slate-950/80 hover:bg-sky-500/10 rounded-xl border border-slate-800 text-sky-400 transition-all group">
                      <span className="font-semibold truncate text-sm">{ck.maps.title || _Z("TWFwIExpbms=")}</span>
                      <ExternalLink className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}
          {s.error && (
            <div className="bg-red-500/10 p-6 rounded-3xl border border-red-500/30 text-red-400">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-red-500/20 rounded-lg shrink-0"><Info className="w-5 h-5" /></div>
                <div><h4 className="font-bold text-red-300">{_Z("QW5hbHlzaXMgRXJyb3I=")}</h4><p className="text-sm opacity-80">{s.error}</p><button onClick={exec} className="mt-4 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors">{_Z("UmV0cnkgVHJpYW5ndWxhdGlvbg==")}</button></div>
              </div>
            </div>
          )}
          {!i && !s.error && (
            <div className="flex flex-col items-center justify-center h-80 text-center text-slate-700">
              <Globe className="w-20 h-20 mb-6 opacity-5 animate-pulse" />
              <p className="text-slate-500 text-sm">{_Z("VmlzdWFsIGZlZWQgcmVxdWlyZWQgZm9yIGdlb2xvY2F0aW9uIHRyaWFnZS4=")}</p>
              <div className="flex gap-2 mt-4"><div className="w-2 h-2 rounded-full bg-slate-800 animate-ping"></div><div className="w-2 h-2 rounded-full bg-slate-800 animate-ping [animation-delay:200ms]"></div><div className="w-2 h-2 rounded-full bg-slate-800 animate-ping [animation-delay:400ms]"></div></div>
            </div>
          )}
        </section>
      </main>

      <footer className="mt-20 py-8 border-t border-slate-900 w-full text-center text-slate-700 text-[10px] uppercase tracking-[0.2em]">
        <p>{_Z("Rm9yZW5zaWMgSW1hZ2VyeSBTeXN0ZW0gLy8gTmV1cmFsIFN0YXR1czogT05MSU5F")}</p>
        <p className="mt-2 opacity-50 italic">{_Z("VXRpbGl6aW5nIEdlbWluaSBQcm8gMyAmIEZsYXNoIE5hdGl2ZSBNYXBwaW5nIEdyb3VuZGluZw==")}</p>
      </footer>
    </div>
  );
};

export default App;
