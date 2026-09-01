import React from 'react';
import { Award, Flame, Target } from 'lucide-react';

interface GameScoreBarProps {
  currentQuestion: number;
  totalQuestions: number;
  score: number;
  streak: number;
}

export const GameScoreBar: React.FC<GameScoreBarProps> = ({
  currentQuestion,
  totalQuestions,
  score,
  streak,
}) => {
  const progressPercentage = ((currentQuestion - 1) / totalQuestions) * 100;

  return (
    <div className="w-full bg-white rounded-2xl p-4 sm:p-5 border border-sky-100 shadow-xs mb-4">
      {/* Top Stats Row */}
      <div className="flex items-center justify-between gap-2 mb-3">
        {/* Question Counter */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-200">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">คำถาม</span>
            <span className="text-sm sm:text-base font-bold text-slate-800">
              ข้อที่ {currentQuestion}/{totalQuestions}
            </span>
          </div>
        </div>

        {/* Streak Counter (if any) */}
        {streak > 1 && (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 text-amber-700 rounded-full text-xs font-semibold animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>ตอบถูก {streak} ข้อติด!</span>
          </div>
        )}

        {/* Score Counter */}
        <div className="flex items-center gap-2 text-right">
          <div>
            <span className="text-xs text-slate-500 font-medium block">คะแนนสะสม</span>
            <span className="text-sm sm:text-base font-bold text-sky-700">
              {score} <span className="text-xs font-normal text-slate-500">คะแนน</span>
            </span>
          </div>
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200">
            <Award className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-sky-400 via-sky-500 to-blue-600 h-full rounded-full transition-all duration-300 ease-out"
          style={{ width: `${Math.max(5, progressPercentage)}%` }}
          role="progressbar"
          aria-valuenow={progressPercentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};
