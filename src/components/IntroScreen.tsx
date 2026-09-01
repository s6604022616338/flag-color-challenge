import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Play, Trophy, User, AlertCircle, Sparkles } from 'lucide-react';
import { FlagRenderer } from './FlagRenderer';
import { sound } from '../utils/audio';

interface IntroScreenProps {
  playerName: string;
  onPlayerNameChange: (name: string) => void;
  onStartGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenHelp: () => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({
  playerName,
  onPlayerNameChange,
  onStartGame,
  onOpenLeaderboard,
  onOpenHelp,
}) => {
  const [showError, setShowError] = useState(false);

  const trimmedName = playerName.trim();
  const isValid = trimmedName.length > 0 && trimmedName.length <= 12;

  const handleStartClick = () => {
    if (!isValid) {
      setShowError(true);
      sound.playClick();
      return;
    }
    setShowError(false);
    sound.playClick();
    onStartGame();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleStartClick();
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center">
      {/* Category pill */}
      <span className="bg-sky-100 text-sky-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-3 inline-block">
        เกมประลองความจำ • ทายสีธงชาติ
      </span>

      {/* Main Title */}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight leading-tight mb-2">
        Flag Color <span className="text-sky-600">Challenge!</span>
      </h2>

      <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed mb-5">
        คุณจำสีและตำแหน่งของธงชาติแต่ละประเทศได้แม่นยำแค่ไหน? ท้าประลอง 10 ข้อ 100 คะแนนเต็ม
      </p>

      {/* Showcase Flag Grid */}
      <div className="grid grid-cols-4 gap-2.5 sm:gap-3.5 mb-5 w-full max-w-sm p-3 bg-slate-50 rounded-2xl border border-slate-100">
        {/* Sample France Flag */}
        <div className="flex flex-col items-center gap-1">
          <div className="aspect-[3/2] w-full rounded-lg overflow-hidden shadow-xs border border-slate-200">
            <FlagRenderer renderType="vertical-3-stripes" colors={['#002654', '#FFFFFF', '#ED2939']} />
          </div>
          <span className="text-[10px] font-semibold text-slate-600">ฝรั่งเศส</span>
        </div>
        {/* Sample Japan Flag */}
        <div className="flex flex-col items-center gap-1">
          <div className="aspect-[3/2] w-full rounded-lg overflow-hidden shadow-xs border border-slate-200">
            <FlagRenderer renderType="circle-center" colors={['#FFFFFF', '#BC002D']} />
          </div>
          <span className="text-[10px] font-semibold text-slate-600">ญี่ปุ่น</span>
        </div>
        {/* Sample Germany Flag */}
        <div className="flex flex-col items-center gap-1">
          <div className="aspect-[3/2] w-full rounded-lg overflow-hidden shadow-xs border border-slate-200">
            <FlagRenderer renderType="horizontal-3-stripes" colors={['#000000', '#DD0000', '#FFCE00']} />
          </div>
          <span className="text-[10px] font-semibold text-slate-600">เยอรมนี</span>
        </div>
        {/* Sample Thailand Flag */}
        <div className="flex flex-col items-center gap-1">
          <div className="aspect-[3/2] w-full rounded-lg overflow-hidden shadow-xs border border-slate-200">
            <FlagRenderer renderType="horizontal-5-stripes" colors={['#A51931', '#F4F5F8', '#2D2A4A', '#F4F5F8', '#A51931']} />
          </div>
          <span className="text-[10px] font-semibold text-slate-600">ไทย</span>
        </div>
      </div>

      {/* Nickname Input Card */}
      <div className="w-full max-w-sm bg-slate-50 p-4 rounded-2xl border border-slate-200/80 mb-5 text-left shadow-xs">
        <label
          htmlFor="player-name-input"
          className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5"
        >
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-sky-600" />
            <span>ชื่อเล่นผู้เล่น <span className="text-rose-500">*</span></span>
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {playerName.length}/12
          </span>
        </label>

        <div className="relative">
          <input
            id="player-name-input"
            type="text"
            maxLength={12}
            value={playerName}
            onChange={(e) => {
              onPlayerNameChange(e.target.value);
              if (showError && e.target.value.trim().length > 0) {
                setShowError(false);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder="กรอกชื่อเล่นของคุณ (เช่น กัปตัน, Alex)"
            className={`w-full px-3.5 py-2.5 bg-white rounded-xl text-sm font-medium text-slate-800 placeholder-slate-400 border transition-all focus:outline-none focus:ring-2 ${
              showError && !isValid
                ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/30'
                : 'border-slate-300 focus:border-sky-500 focus:ring-sky-200'
            }`}
          />
        </div>

        {showError && !isValid && (
          <p className="flex items-center gap-1 text-[11px] text-rose-600 font-semibold mt-1.5 animate-in fade-in">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>กรุณากรอกชื่อเล่นก่อนเริ่มเกม (1 - 12 ตัวอักษร)</span>
          </p>
        )}
      </div>

      {/* Start Game & Leaderboard Action CTA buttons */}
      <div className="w-full max-w-sm flex flex-col sm:flex-row gap-2.5">
        <button
          id="start-game-button"
          type="button"
          disabled={!isValid}
          onClick={handleStartClick}
          className={`flex-1 py-3.5 px-6 font-bold text-sm sm:text-base rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
            isValid
              ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xl hover:shadow-2xl cursor-pointer active:scale-95 group'
              : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
          }`}
        >
          <Play className={`w-4 h-4 ${isValid ? 'fill-white group-hover:translate-x-0.5 transition-transform' : 'fill-slate-500'}`} />
          <span>เริ่มเกมตอนนี้</span>
        </button>

        <button
          id="view-leaderboard-button"
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenLeaderboard();
          }}
          className="py-3.5 px-5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-2 border-slate-200 hover:border-slate-300 font-bold text-sm rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
        >
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>ดูอันดับ 10 อันดับ</span>
        </button>
      </div>

      {/* Quick features note */}
      <div className="grid grid-cols-3 gap-2 w-full max-w-sm mt-5 text-center text-slate-500 text-[11px] sm:text-xs">
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium">
          🎲 สุ่ม 10 ประเทศ
        </div>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium">
          ⏱️ จับเวลาจริง
        </div>
        <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 font-medium">
          🏆 จัดอันดับ Top 10
        </div>
      </div>
    </div>
  );
};

