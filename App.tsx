
import React, { useState, useCallback, useEffect } from 'react';
import { generateTamilAudio } from './services/geminiService';
import { VoiceName, TTSState, AudioGenerationResult } from './types';
import { VoiceCard } from './components/VoiceCard';
import { 
  Sparkles, 
  Send, 
  Settings2, 
  History, 
  Volume2, 
  AlertCircle,
  Loader2,
  Mic2,
  Trash2,
  Languages,
  Heart
} from 'lucide-react';

const PRESET_STYLES = [
  "மகிழ்ச்சி (Cheerful)",
  "தீவிரமான (Serious)",
  "செய்தி வாசிப்பாளர் (News Reporter)",
  "ரகசியம் (Whisper)",
  "சோகம் (Sad)",
  "கோபம் (Angry)",
  "ஆசிரியர் (Teacher)"
];

const App: React.FC = () => {
  const [state, setState] = useState<TTSState>({
    text: '',
    style: '',
    voice: VoiceName.Zephyr,
    isGenerating: false,
    error: null,
    history: []
  });

  // Load history from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tamil_voice_history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, history: parsed }));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  // Save history to localStorage
  useEffect(() => {
    localStorage.setItem('tamil_voice_history', JSON.stringify(state.history));
  }, [state.history]);

  const handleGenerate = async () => {
    if (!state.text.trim()) {
      setState(prev => ({ ...prev, error: "தயவுசெய்து உரையை உள்ளிடவும் (Please enter some text)." }));
      return;
    }

    setState(prev => ({ ...prev, isGenerating: true, error: null }));

    try {
      const result = await generateTamilAudio(state.text, state.style || 'natural', state.voice);
      
      const newHistoryItem: AudioGenerationResult = {
        ...result,
        text: state.text,
        style: state.style || 'natural',
        voice: state.voice,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        history: [newHistoryItem, ...prev.history],
        isGenerating: false,
        text: ''
      }));
    } catch (err: any) {
      setState(prev => ({
        ...prev,
        error: err.message || "Something went wrong during generation.",
        isGenerating: false
      }));
    }
  };

  const deleteHistoryItem = (id: string) => {
    setState(prev => ({
      ...prev,
      history: prev.history.filter(item => item.id !== id)
    }));
  };

  const clearHistory = () => {
    if (confirm("வரலாற்றை நீக்க வேண்டுமா? (Clear all history?)")) {
      setState(prev => ({ ...prev, history: [] }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-12">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
              <Mic2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-800">Tamil Voice Lab</h1>
              <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest">தமிழ் குரல் ஆய்வகம்</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-slate-500 text-sm">
             <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 rounded-full border border-slate-200">
                <Languages className="w-4 h-4 text-orange-500" />
                <span className="font-medium">Tamil (தமிழ்)</span>
             </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Controls Section */}
          <div className="lg:col-span-5 space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-slate-800">Generate Speech</h2>
              </div>

              <div className="space-y-4">
                {/* Text Input */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    உரை (Tamil Text)
                  </label>
                  <textarea
                    className="w-full h-40 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none resize-none font-tamil text-lg"
                    placeholder="இங்கே உங்கள் உரையைத் தட்டச்சு செய்யவும்... (Type your text here...)"
                    value={state.text}
                    onChange={(e) => setState(prev => ({ ...prev, text: e.target.value }))}
                  />
                </div>

                {/* Style Prompt */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    குரல் பாணி (Voice Style)
                  </label>
                  <div className="relative group">
                    <input
                      type="text"
                      className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                      placeholder="எ.கா: மகிழ்ச்சியான, கோபமான... (e.g. happy, angry...)"
                      value={state.style}
                      onChange={(e) => setState(prev => ({ ...prev, style: e.target.value }))}
                    />
                    <Settings2 className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                  </div>
                  
                  {/* Preset Styles Chips */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {PRESET_STYLES.map(style => (
                      <button
                        key={style}
                        onClick={() => setState(prev => ({ ...prev, style }))}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                          state.style === style 
                            ? 'bg-orange-500 border-orange-500 text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-500 hover:border-orange-300 hover:text-orange-600'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice Selector */}
                <div>
                  <label className="block text-sm font-medium text-slate-600 mb-2">
                    குரல் தேர்வு (Select Voice)
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {Object.values(VoiceName).map(v => (
                      <button
                        key={v}
                        onClick={() => setState(prev => ({ ...prev, voice: v }))}
                        className={`py-2 px-1 rounded-lg border text-xs font-medium transition-all text-center ${
                          state.voice === v 
                            ? 'bg-slate-800 border-slate-800 text-white shadow-md' 
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error message */}
                {state.error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 animate-pulse">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p>{state.error}</p>
                  </div>
                )}

                {/* Generate Button */}
                <button
                  onClick={handleGenerate}
                  disabled={state.isGenerating || !state.text.trim()}
                  className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2 group"
                >
                  {state.isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      உருவாக்குகிறது... (Generating...)
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      குரலை உருவாக்கு (Generate Audio)
                    </>
                  )}
                </button>
              </div>
            </section>
          </div>

          {/* History Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-slate-600" />
                <h2 className="text-lg font-semibold text-slate-800">Your Creations</h2>
              </div>
              {state.history.length > 0 && (
                <button 
                  onClick={clearHistory}
                  className="text-sm text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear All
                </button>
              )}
            </div>

            {state.history.length === 0 ? (
              <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                  <Volume2 className="w-8 h-8" />
                </div>
                <h3 className="text-slate-600 font-medium mb-1">வரலாறு எதுவும் இல்லை (No history yet)</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">
                  மேலே உள்ள உரையை உள்ளிட்டு உங்கள் முதல் தமிழ் குரலை உருவாக்குங்கள். (Create your first Tamil voice generation by typing text above.)
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {state.history.map(item => (
                  <VoiceCard 
                    key={item.id} 
                    result={item} 
                    onDelete={deleteHistoryItem} 
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Footer Info */}
      <footer className="mt-12 text-center px-4 space-y-3">
        <div className="flex items-center justify-center gap-2 text-slate-500 font-medium">
          <span>Build with</span>
          <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
          <span>by</span>
          <span className="text-slate-800 font-bold tracking-tight">Kovai Creative Media</span>
        </div>
        <div className="text-slate-400 text-xs">
          <p>© 2024 Tamil Voice Lab. Powered by Gemini 2.5 Flash TTS.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
