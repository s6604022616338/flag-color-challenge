import React from 'react';
import { Volume2, VolumeX, HelpCircle, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  onOpenHelp: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenHelp,
  isMuted,
  onToggleMute,
}) => {
  return (
    <header className="w-full bg-white/90 backdrop-blur-md border-b border-sky-100 sticky top-0 z-20 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between">
        {/* App Title & Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white shadow-sm shadow-sky-500/20">
            <span className="text-xl leading-none">🚩</span>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 flex items-center gap-1.5">
              Flag Color Challenge!
              <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-200/60">
                <Sparkles className="w-3 h-3 text-sky-500" />
                เกมทายสีธง
              </span>
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              ทดสอบความจำและความแม่นยำของสีธงชาติทั่วโลก
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* How to play button */}
          <button
            id="help-button"
            onClick={() => {
              sound.playClick();
              onOpenHelp();
            }}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-sky-700 bg-slate-100/80 hover:bg-sky-50 border border-slate-200/80 hover:border-sky-200 px-3 py-1.5 rounded-lg transition-all cursor-pointer active:scale-95"
            title="วิธีเล่นเกม"
          >
            <HelpCircle className="w-4 h-4 text-sky-600" />
            <span>วิธีเล่น</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            id="sound-toggle-button"
            onClick={onToggleMute}
            className={`p-2 rounded-lg border transition-all cursor-pointer active:scale-95 ${
              isMuted
                ? 'bg-slate-100 text-slate-400 border-slate-200 hover:bg-slate-200'
                : 'bg-sky-50 text-sky-600 border-sky-200 hover:bg-sky-100'
            }`}
            title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
            aria-label={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
