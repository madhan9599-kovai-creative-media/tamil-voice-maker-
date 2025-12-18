
import React from 'react';
import { AudioGenerationResult } from '../types';
import { Play, Download, Trash2, Calendar, Mic } from 'lucide-react';

interface VoiceCardProps {
  result: AudioGenerationResult;
  onDelete: (id: string) => void;
}

export const VoiceCard: React.FC<VoiceCardProps> = ({ result, onDelete }) => {
  const dateStr = new Date(result.timestamp).toLocaleString();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-md">
      <div className="p-4 sm:p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Mic className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 line-clamp-1">{result.text}</h3>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {dateStr}
              </p>
            </div>
          </div>
          <button 
            onClick={() => onDelete(result.id)}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Style</p>
            <p className="text-sm font-medium text-slate-700">{result.style || 'Default'}</p>
          </div>
          <div className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-[10px] uppercase font-bold text-slate-400">Voice</p>
            <p className="text-sm font-medium text-slate-700">{result.voice}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <audio controls className="w-full h-10 custom-audio-player">
            <source src={result.audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
          <a
            href={result.audioUrl}
            download={`tamil_voice_${result.id.slice(0, 8)}.wav`}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors"
            title="Download Audio"
          >
            <Download className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};
