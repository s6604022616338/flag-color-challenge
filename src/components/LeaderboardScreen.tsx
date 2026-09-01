import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Trophy, Medal, Clock, ArrowLeft, Play, Award, Sparkles } from 'lucide-react';
import { LeaderboardEntry } from '../types';
import { getLeaderboard, formatDurationThai, formatDigitalTime } from '../utils/leaderboard';
import { sound } from '../utils/audio';

interface LeaderboardScreenProps {
  onBackToHome: () => void;
  onStartGame?: () => void;
  currentPlayerName?: string;
}

export const LeaderboardScreen: React.FC<LeaderboardScreenProps> = ({
  onBackToHome,
  onStartGame,
  currentPlayerName = '',
}) => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setLeaderboard(getLeaderboard());
  }, []);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-400 text-amber-950 font-black flex items-center justify-center shadow-sm">
            <Trophy className="w-4 h-4 fill-amber-950" />
          </div>
        );
      case 2:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-300 text-slate-900 font-black flex items-center justify-center shadow-sm">
            <Medal className="w-4 h-4" />
          </div>
        );
      case 3:
        return (
          <div className="w-8 h-8 rounded-xl bg-amber-700/80 text-amber-100 font-black flex items-center justify-center shadow-sm">
            <Award className="w-4 h-4" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-600 font-black text-xs sm:text-sm flex items-center justify-center border border-slate-200">
            {rank}
          </div>
        );
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
      {/* Category Pill */}
      <span className="bg-sky-100 text-sky-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2.5 inline-block">
        Hall of Fame • 10 อันดับผู้เล่น
      </span>

      {/* Main Title */}
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-800 tracking-tight text-center mb-1">
        ตารางจัดอันดับ <span className="text-sky-600">Top 10</span>
      </h2>
      <p className="text-xs sm:text-sm text-slate-500 text-center max-w-md leading-relaxed mb-6 font-medium">
        เรียงลำดับตามคะแนนสูงสุด และเวลาที่เร็วที่สุด (บันทึกเฉพาะผลงานที่ดีที่สุดของแต่ละชื่อ)
      </p>

      {/* Leaderboard Table / Cards */}
      <div className="w-full bg-slate-50 rounded-2xl sm:rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        {leaderboard.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mx-auto mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-700 mb-1">ยังไม่มีข้อมูลในตารางอันดับ</h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
              มาร่วมเป็นคนแรกที่ทำคะแนนและขึ้นเป็นแชมป์ Top 10 ของเกม!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/70">
            {/* Table Header (Desktop & Tablet) */}
            <div className="grid grid-cols-12 gap-2 px-4 sm:px-5 py-3 bg-slate-100/80 text-[11px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-2 sm:col-span-2 text-center">อันดับ</div>
              <div className="col-span-5 sm:col-span-5 text-left">ชื่อผู้เล่น</div>
              <div className="col-span-2 sm:col-span-2 text-center">คะแนน</div>
              <div className="col-span-3 sm:col-span-3 text-right">เวลาที่ใช้</div>
            </div>

            {/* List of Top 10 */}
            {leaderboard.map((entry, index) => {
              const rank = index + 1;
              const isCurrentPlayer =
                currentPlayerName.trim() &&
                entry.playerName.trim().toLowerCase() === currentPlayerName.trim().toLowerCase();

              return (
                <motion.div
                  key={entry.id || index}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className={`grid grid-cols-12 gap-2 items-center px-4 sm:px-5 py-3 transition-colors ${
                    isCurrentPlayer
                      ? 'bg-sky-50/90 font-bold border-l-4 border-l-sky-500'
                      : rank <= 3
                      ? 'bg-white'
                      : 'hover:bg-slate-100/50'
                  }`}
                >
                  {/* Rank Column */}
                  <div className="col-span-2 sm:col-span-2 flex items-center justify-center">
                    {getRankBadge(rank)}
                  </div>

                  {/* Player Name Column */}
                  <div className="col-span-5 sm:col-span-5 flex items-center gap-1.5 min-w-0 pr-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-800 truncate">
                      {entry.playerName}
                    </span>
                    {isCurrentPlayer && (
                      <span className="shrink-0 text-[10px] bg-sky-500 text-white px-1.5 py-0.2 rounded-md font-semibold hidden sm:inline">
                        คุณ
                      </span>
                    )}
                  </div>

                  {/* Score Column */}
                  <div className="col-span-2 sm:col-span-2 text-center">
                    <span className="inline-block text-xs sm:text-sm font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200/60">
                      {entry.score}
                    </span>
                  </div>

                  {/* Time Column */}
                  <div className="col-span-3 sm:col-span-3 text-right">
                    <div className="inline-flex items-center gap-1 text-xs sm:text-sm text-slate-600 font-semibold">
                      <Clock className="w-3 h-3 text-slate-400 hidden sm:inline" />
                      <span>{formatDigitalTime(entry.timeSeconds)}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 block sm:hidden">
                      {formatDurationThai(entry.timeSeconds)}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 w-full max-w-sm">
        <button
          id="leaderboard-back-home-button"
          type="button"
          onClick={() => {
            sound.playClick();
            onBackToHome();
          }}
          className="flex-1 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-2 border-slate-200 hover:border-slate-300 px-6 py-3.5 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500" />
          <span>กลับหน้าหลัก</span>
        </button>

        {onStartGame && currentPlayerName.trim() && (
          <button
            id="leaderboard-start-game-button"
            type="button"
            onClick={() => {
              sound.playClick();
              onStartGame();
            }}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm sm:text-base"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>เริ่มเล่นเลย</span>
          </button>
        )}
      </div>
    </div>
  );
};
