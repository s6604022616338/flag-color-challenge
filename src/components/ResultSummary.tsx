import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';
import { RotateCcw, Home, Trophy, Award, CheckCircle2, XCircle, Clock, User } from 'lucide-react';
import { AnswerResult } from '../types';
import { FlagRenderer } from './FlagRenderer';
import { sound } from '../utils/audio';
import { formatDurationThai, formatDigitalTime } from '../utils/leaderboard';

interface ResultSummaryProps {
  playerName: string;
  score: number;
  totalScore: number;
  timeSeconds: number;
  rank?: number;
  results: AnswerResult[];
  onPlayAgain: () => void;
  onGoHome: () => void;
  onOpenLeaderboard: () => void;
}

export const ResultSummary: React.FC<ResultSummaryProps> = ({
  playerName,
  score,
  totalScore,
  timeSeconds,
  rank,
  results,
  onPlayAgain,
  onGoHome,
  onOpenLeaderboard,
}) => {
  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalCount = results.length;
  const percentage = Math.round((score / totalScore) * 100);

  // Trigger celebratory confetti and fanfare sound
  useEffect(() => {
    if (score >= 70) {
      sound.playFanfare();
      // Confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0284c7', '#38bdf8', '#fbbf24', '#34d399', '#f43f5e'],
        });
      } catch {
        // Silent catch
      }
    }
  }, [score]);

  // Determine evaluation message and badge
  const getEvaluation = () => {
    if (score === 100) {
      return {
        badge: 'ระดับมาสเตอร์ 🏆',
        title: 'สมบูรณ์แบบระดับเซียน!',
        message: 'คุณตอบถูกครบทั้ง 10 ข้อ! จำสีและลำดับของธงชาติทั่วโลกได้อย่างแม่นยำ 100%',
        color: 'from-amber-400 to-yellow-600',
        bg: 'bg-amber-50 border-amber-200 text-amber-900',
      };
    }
    if (score >= 80) {
      return {
        badge: 'ระดับยอดเยี่ยม 🥇',
        title: 'ยอดเยี่ยมมาก!',
        message: 'ความรู้เรื่องสีและโครงสร้างของธงชาติของคุณอยู่ในระดับแถวหน้า ตอบถูกเกือบครบทั้งหมด!',
        color: 'from-sky-400 to-blue-600',
        bg: 'bg-sky-50 border-sky-200 text-sky-900',
      };
    }
    if (score >= 60) {
      return {
        badge: 'ระดับดีมาก 🥈',
        title: 'เก่งมาก!',
        message: 'ทำผลงานได้ดีเยี่ยม มีความจำเรื่องสีธงชาติที่ดี สามารถแยกแยะตัวเลือกหลอกได้ดี',
        color: 'from-emerald-400 to-teal-600',
        bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      };
    }
    if (score >= 40) {
      return {
        badge: 'ระดับปานกลาง 🥉',
        title: 'พอใช้ได้เลย!',
        message: 'เริ่มจับทางสีและตำแหน่งของธงได้แล้ว ลองฝึกฝนอีกนิดจะแม่นยำยิ่งขึ้นแน่นอน',
        color: 'from-indigo-400 to-violet-600',
        bg: 'bg-indigo-50 border-indigo-200 text-indigo-900',
      };
    }
    return {
      badge: 'ระดับฝึกฝน 💪',
      title: 'พยายามใหม่อีกครั้งนะ!',
      message: 'ธงหลายประเทศมีสีคล้ายกันมาก ลองสังเกตแถบสีและเล่นใหม่อีกรอบเพื่อพัฒนาความจำ',
      color: 'from-slate-400 to-slate-600',
      bg: 'bg-slate-50 border-slate-200 text-slate-800',
    };
  };

  const evalInfo = getEvaluation();

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Category Pill */}
      <span className="bg-sky-100 text-sky-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2.5 inline-block">
        สรุปผลการเล่น • บันทึกสถิติ
      </span>

      {/* Player Header Banner */}
      {playerName && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-bold mb-3 shadow-2xs">
          <User className="w-4 h-4 text-sky-600" />
          <span>ผู้เล่น: {playerName}</span>
          {rank && rank > 0 && rank <= 10 && (
            <span className="bg-amber-400/90 text-amber-950 px-2 py-0.2 rounded-full text-xs font-black">
              🏆 อันดับที่ {rank}
            </span>
          )}
        </div>
      )}

      {/* Main Score & Time Stats Cards */}
      <div className="w-full grid grid-cols-2 gap-3 max-w-md my-2">
        {/* Score Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
            คะแนนรวม
          </p>
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl sm:text-5xl font-black italic tracking-tight text-slate-800">
              {score}
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-400">/{totalScore}</span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1">
            ถูก {correctCount}/{totalCount} ข้อ ({percentage}%)
          </p>
        </div>

        {/* Time Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-center">
          <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 text-sky-500" />
            <span>เวลาที่ใช้</span>
          </p>
          <div className="text-3xl sm:text-4xl font-black italic tracking-tight text-slate-800 mt-1">
            {formatDigitalTime(timeSeconds)}
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mt-1 truncate">
            {formatDurationThai(timeSeconds)}
          </p>
        </div>
      </div>

      {/* Evaluation Box */}
      <div className="w-full max-w-md mt-2 p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
        <span className="inline-block text-xs font-bold px-3 py-0.5 rounded-full bg-white text-slate-800 shadow-xs border border-slate-200 mb-1.5">
          {evalInfo.badge}
        </span>
        <h3 className="text-sm sm:text-base font-bold text-slate-800 mb-0.5">{evalInfo.title}</h3>
        <p className="text-xs text-slate-600 leading-relaxed">{evalInfo.message}</p>
      </div>

      {/* Action CTAs: Play Again, View Leaderboard & Go Home */}
      <div className="mt-5 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2.5 w-full max-w-lg">
        <button
          id="play-again-button"
          type="button"
          onClick={() => {
            sound.playClick();
            onPlayAgain();
          }}
          className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm sm:text-base"
        >
          <RotateCcw className="w-4 h-4" />
          <span>เล่นอีกครั้ง</span>
        </button>

        <button
          id="result-leaderboard-button"
          type="button"
          onClick={() => {
            sound.playClick();
            onOpenLeaderboard();
          }}
          className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-950 px-5 py-3.5 rounded-2xl font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm sm:text-base"
        >
          <Trophy className="w-4 h-4 text-slate-950 fill-slate-950" />
          <span>ดูตารางอันดับ</span>
        </button>

        <button
          id="go-home-button"
          type="button"
          onClick={() => {
            sound.playClick();
            onGoHome();
          }}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-2 border-slate-200 hover:border-slate-300 px-5 py-3.5 rounded-2xl font-bold shadow-xs hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm sm:text-base"
        >
          <Home className="w-4 h-4 text-slate-500" />
          <span>กลับหน้าหลัก</span>
        </button>
      </div>

      {/* Detailed Review of All Questions */}
      <div className="w-full mt-2 text-left">
        <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-3 px-1">
          ทบทวนคำตอบทั้ง 10 ข้อ:
        </h3>

        <div className="space-y-3">
          {results.map((res, index) => (
            <div
              key={index}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                res.isCorrect
                  ? 'bg-emerald-50/30 border-emerald-200/80'
                  : 'bg-rose-50/30 border-rose-200/80'
              }`}
            >
              <div className="flex items-start gap-3 sm:gap-4">
                {/* Status Icon */}
                <div className="mt-0.5 shrink-0">
                  {res.isCorrect ? (
                    <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
                      <XCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Question Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm sm:text-base font-bold text-slate-800">
                      ข้อที่ {res.questionNumber}: {res.country.nameTh} ({res.country.nameEn})
                    </h4>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        res.isCorrect
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {res.isCorrect ? '+10' : '+0'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {res.country.description}
                  </p>

                  {/* Flag Thumbnail Comparison */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-20 aspect-[3/2] rounded-lg overflow-hidden border border-emerald-300 shadow-xs">
                        <FlagRenderer
                          renderType={res.country.renderType}
                          colors={res.correctOption.colors}
                        />
                      </div>
                      <span className="text-[10px] text-emerald-700 font-bold mt-1">
                        ธงที่ถูกต้อง
                      </span>
                    </div>

                    {!res.isCorrect && (
                      <div className="flex flex-col items-center opacity-85">
                        <div className="w-20 aspect-[3/2] rounded-lg overflow-hidden border-2 border-rose-400 shadow-xs">
                          <FlagRenderer
                            renderType={res.country.renderType}
                            colors={res.selectedOption.colors}
                          />
                        </div>
                        <span className="text-[10px] text-rose-600 font-bold mt-1">
                          คุณเลือกรูปนี้
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

