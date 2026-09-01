/**
 * Flag Color Challenge! (เกมทายสีธงชาติ)
 * A responsive single-page web app in React & Tailwind CSS.
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GamePhase, Question, FlagVariation, AnswerResult } from './types';
import { generateGameQuestions } from './utils/gameLogic';
import { sound } from './utils/audio';
import { recordScore, formatDigitalTime, formatDurationThai } from './utils/leaderboard';
import { IntroScreen } from './components/IntroScreen';
import { FlagCard } from './components/FlagCard';
import { FeedbackBanner } from './components/FeedbackBanner';
import { ResultSummary } from './components/ResultSummary';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { InstructionsModal } from './components/InstructionsModal';
import { Globe2, Volume2, VolumeX, User, Clock, Trophy } from 'lucide-react';

export default function App() {
  // Player state
  const [playerName, setPlayerName] = useState<string>(() => {
    try {
      return localStorage.getItem('flag_challenge_last_nickname') || '';
    } catch {
      return '';
    }
  });

  // Game state
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<FlagVariation | null>(null);
  const [results, setResults] = useState<AnswerResult[]>([]);

  // Timer state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [finalTimeSeconds, setFinalTimeSeconds] = useState<number>(0);
  const [playerRank, setPlayerRank] = useState<number>(-1);

  // UI state
  const [isHelpOpen, setIsHelpOpen] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted);

  // Sync nickname to localStorage for player convenience
  const handlePlayerNameChange = (name: string) => {
    setPlayerName(name);
    try {
      localStorage.setItem('flag_challenge_last_nickname', name);
    } catch {
      // Ignore storage errors
    }
  };

  // Timer interval hook: accurately tracks elapsed time without drift
  useEffect(() => {
    let timerInterval: ReturnType<typeof setInterval> | null = null;

    if ((phase === 'playing' || phase === 'answered') && startTime !== null) {
      timerInterval = setInterval(() => {
        const now = Date.now();
        setElapsedSeconds(Math.floor((now - startTime) / 1000));
      }, 250);
    }

    return () => {
      if (timerInterval) clearInterval(timerInterval);
    };
  }, [phase, startTime]);

  // Start a new 10-question game round
  const handleStartGame = () => {
    const trimmed = playerName.trim();
    if (!trimmed || trimmed.length > 12) {
      return;
    }

    const newQuestions = generateGameQuestions(10);
    setQuestions(newQuestions);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setResults([]);
    setPlayerRank(-1);

    // Start timer
    const now = Date.now();
    setStartTime(now);
    setElapsedSeconds(0);
    setFinalTimeSeconds(0);

    setPhase('playing');
  };

  // Return to home / intro screen and reset round state
  const handleGoHome = () => {
    setPhase('intro');
    setQuestions([]);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setResults([]);
    setStartTime(null);
    setElapsedSeconds(0);
    setFinalTimeSeconds(0);
  };

  // Toggle sound effects
  const handleToggleMute = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
  };

  // Current question data
  const currentQ = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  // Handle user selecting one of the 4 flag choices
  const handleSelectOption = (option: FlagVariation) => {
    if (phase !== 'playing' || !currentQ) return;

    setSelectedOption(option);
    const isCorrect = option.isCorrect;

    if (isCorrect) {
      setScore((prev) => prev + 10);
      setStreak((prev) => prev + 1);
      sound.playCorrect();
    } else {
      setStreak(0);
      sound.playWrong();
    }

    const correctOption = currentQ.options.find((opt) => opt.isCorrect)!;

    // Record answer result for review
    const answerResult: AnswerResult = {
      questionNumber: currentQ.questionNumber,
      country: currentQ.country,
      selectedOption: option,
      correctOption,
      isCorrect,
    };

    setResults((prev) => [...prev, answerResult]);
    setPhase('answered');
  };

  // Advance to the next question or game summary
  const handleNextQuestion = () => {
    if (isLastQuestion) {
      // Game ended: calculate final time and record to leaderboard
      const now = Date.now();
      const totalTime = startTime ? Math.max(1, Math.floor((now - startTime) / 1000)) : elapsedSeconds;
      setFinalTimeSeconds(totalTime);

      // Record score into leaderboard
      const currentScore = score;
      const { rank } = recordScore(playerName.trim(), currentScore, totalTime);
      setPlayerRank(rank);

      setPhase('result');
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setPhase('playing');
    }
  };

  return (
    <div className="min-h-screen bg-sky-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 font-['Prompt',sans-serif]">
      {/* Sleek Centerpiece Container */}
      <div className="w-full max-w-5xl bg-white rounded-[28px] sm:rounded-[36px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] flex flex-col lg:flex-row overflow-hidden border border-white/80 min-h-[640px]">
        {/* Left Sidebar (Sleek Gradient) */}
        <aside className="w-full lg:w-80 xl:w-88 bg-gradient-to-b from-sky-500 to-sky-600 p-6 sm:p-8 text-white flex flex-col justify-between shrink-0">
          <div>
            {/* Sidebar Header & Brand */}
            <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-xs rounded-xl flex items-center justify-center shadow-inner">
                  <span className="text-xl leading-none">🚩</span>
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight">
                    Flag Challenge!
                  </h1>
                  <span className="text-xs text-sky-100 opacity-80">เกมทายสีธงชาติ</span>
                </div>
              </div>

              {/* Utility buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  id="help-sidebar-button"
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setIsHelpOpen(true);
                  }}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="วิธีเล่น"
                  aria-label="วิธีเล่น"
                >
                  <Globe2 className="w-4 h-4" />
                </button>
                <button
                  id="mute-sidebar-button"
                  type="button"
                  onClick={handleToggleMute}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
                  aria-label={isMuted ? 'เปิดเสียง' : 'ปิดเสียง'}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* In-Game Status & Score Card */}
            {(phase === 'playing' || phase === 'answered') && (
              <>
                {/* Active Player & Live Stopwatch */}
                <div className="bg-white/15 backdrop-blur-xs rounded-2xl p-4 mb-4 border border-white/20 shadow-xs flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-sky-100 uppercase tracking-wider font-semibold">
                        ผู้เล่น
                      </p>
                      <p className="text-sm font-bold text-white truncate">
                        {playerName || 'ผู้ท้าชิง'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-[10px] text-sky-100 uppercase tracking-wider font-semibold flex items-center justify-end gap-1">
                      <Clock className="w-3 h-3 text-sky-200" />
                      <span>เวลา</span>
                    </p>
                    <p className="text-sm font-black tracking-wider text-white font-mono">
                      {formatDigitalTime(elapsedSeconds)}
                    </p>
                  </div>
                </div>

                {/* Live Score Display */}
                <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 mb-5 border border-white/15 shadow-sm">
                  <p className="text-sky-100 text-xs sm:text-sm mb-1 uppercase tracking-widest font-semibold">
                    คะแนนปัจจุบัน
                  </p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black italic tracking-tight">
                      {score}
                    </span>
                    <span className="text-sky-200 text-lg sm:text-xl font-medium">/ 100</span>
                  </div>

                  {streak > 1 && (
                    <div className="mt-2.5 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400/25 text-amber-100 text-xs font-semibold border border-amber-300/30 animate-pulse">
                      🔥 ถูกต่อเนื่อง {streak} ข้อ!
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-xs sm:text-sm font-medium text-sky-100">
                    <span>ความคืบหน้า</span>
                    <span>ข้อ {currentIndex + 1}/10</span>
                  </div>
                  <div className="w-full h-3 bg-sky-900/25 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <motion.div
                      className="h-full bg-white rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Intro Sidebar State */}
            {phase === 'intro' && (
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 mb-6 border border-white/15">
                <p className="text-sky-100 text-xs sm:text-sm mb-1 uppercase tracking-widest font-semibold">
                  กติกาการแข่งขัน
                </p>
                <div className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
                  10 ข้อ • 100 แต้ม
                </div>
                <p className="text-xs sm:text-sm text-sky-100/90 mt-2 leading-relaxed">
                  กรอกชื่อเล่นและเริ่มเล่นทันทีเพื่อจับเวลาและชิงตำแหน่งในตาราง 10 อันดับผู้เล่นยอดเยี่ยม!
                </p>
              </div>
            )}

            {/* Leaderboard Sidebar State */}
            {phase === 'leaderboard' && (
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 mb-6 border border-white/15">
                <p className="text-sky-100 text-xs sm:text-sm mb-1 uppercase tracking-widest font-semibold flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-300" />
                  <span>เกณฑ์การจัดอันดับ</span>
                </p>
                <div className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                  คะแนนสูง • ไวสุด
                </div>
                <p className="text-xs sm:text-sm text-sky-100/90 mt-2 leading-relaxed">
                  หากคะแนนเท่ากัน ผู้เล่นที่ใช้เวลาน้อยกว่าจะได้รับการจัดอันดับที่สูงกว่า
                </p>
              </div>
            )}

            {/* Result Sidebar State */}
            {phase === 'result' && (
              <div className="bg-white/10 backdrop-blur-xs rounded-2xl p-5 mb-6 border border-white/15">
                <p className="text-sky-100 text-xs sm:text-sm mb-1 uppercase tracking-widest font-semibold">
                  สรุปผลการแข่งขัน
                </p>
                <div className="text-3xl sm:text-4xl font-black italic tracking-tight mt-1">
                  {score} / 100
                </div>
                <p className="text-xs sm:text-sm text-sky-100/90 mt-1.5 font-medium">
                  ⏱️ ใช้เวลา: {formatDurationThai(finalTimeSeconds)}
                </p>
                {playerRank > 0 && playerRank <= 10 && (
                  <div className="mt-2.5 inline-block bg-amber-400 text-amber-950 text-xs font-black px-2.5 py-1 rounded-lg">
                    🏆 ติดอันดับที่ {playerRank} ของ Top 10!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar How-To Rules (Visible on tablet & desktop) */}
          <div className="space-y-3 pt-4 border-t border-white/15 text-xs sm:text-sm text-sky-100 hidden sm:block">
            <h3 className="font-bold text-white flex items-center gap-1.5">
              <span>💡 วิธีเล่นสั้นๆ:</span>
            </h3>
            <ul className="space-y-1.5 opacity-90 leading-relaxed text-xs">
              <li>• กรอกชื่อเล่นแล้วกดเริ่มเกม</li>
              <li>• สังเกตชื่อประเทศและเลือกธงที่ถูกต้อง</li>
              <li>• ตอบถูกรับ 10 คะแนน ยิ่งไวยิ่งอยู่อันดับสูง</li>
              <li>• ครบ 10 ข้อระบบจะบันทึกผลงานที่ดีที่สุด</li>
            </ul>
          </div>
        </aside>

        {/* Main Stage (Right Side) */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 flex flex-col items-center justify-center relative bg-white">
          <AnimatePresence mode="wait">
            {/* Phase 1: Intro / Welcome */}
            {phase === 'intro' && (
              <motion.div
                key="intro"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <IntroScreen
                  playerName={playerName}
                  onPlayerNameChange={handlePlayerNameChange}
                  onStartGame={handleStartGame}
                  onOpenLeaderboard={() => {
                    sound.playClick();
                    setPhase('leaderboard');
                  }}
                  onOpenHelp={() => setIsHelpOpen(true)}
                />
              </motion.div>
            )}

            {/* Phase Leaderboard Screen */}
            {phase === 'leaderboard' && (
              <motion.div
                key="leaderboard"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                <LeaderboardScreen
                  onBackToHome={() => setPhase('intro')}
                  onStartGame={playerName.trim() ? handleStartGame : undefined}
                  currentPlayerName={playerName}
                />
              </motion.div>
            )}

            {/* Phase 2 & 3: Active Question & Answered State */}
            {(phase === 'playing' || phase === 'answered') && currentQ && (
              <motion.div
                key={`question-${currentQ.questionNumber}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="w-full flex flex-col items-center max-w-2xl mx-auto"
              >
                {/* Question Type Pill */}
                <span className="bg-sky-100 text-sky-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-2 sm:mb-3 inline-block">
                  ธงชาติรอบโลก • ข้อที่ {currentIndex + 1}/10
                </span>

                {/* Question Country Title */}
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-800 tracking-tight text-center">
                  {currentQ.country.nameTh}
                </h2>
                <p className="text-slate-400 text-xs sm:text-sm text-center mb-5 sm:mb-6 font-medium">
                  {currentQ.country.nameEn} • เลือกธงที่มีสีและลำดับสีถูกต้อง
                </p>

                {/* 4 Flag Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 w-full">
                  {currentQ.options.map((option, index) => {
                    const isSelected = selectedOption?.id === option.id;
                    const isCorrectOption = option.isCorrect;

                    return (
                      <FlagCard
                        key={option.id}
                        option={option}
                        index={index}
                        renderType={currentQ.country.renderType}
                        countryName={currentQ.country.nameTh}
                        hasAnswered={phase === 'answered'}
                        isSelected={isSelected}
                        isCorrectOption={isCorrectOption}
                        onSelect={handleSelectOption}
                      />
                    );
                  })}
                </div>

                {/* Sleek Answer Feedback & Next Question CTA */}
                {phase === 'answered' && selectedOption && (
                  <FeedbackBanner
                    isCorrect={selectedOption.isCorrect}
                    country={currentQ.country}
                    correctOption={currentQ.options.find((opt) => opt.isCorrect)!}
                    selectedOption={selectedOption}
                    isLastQuestion={isLastQuestion}
                    onNextQuestion={handleNextQuestion}
                  />
                )}
              </motion.div>
            )}

            {/* Phase 4: Final Results Screen */}
            {phase === 'result' && (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                <ResultSummary
                  playerName={playerName}
                  score={score}
                  totalScore={questions.length * 10}
                  timeSeconds={finalTimeSeconds}
                  rank={playerRank}
                  results={results}
                  onPlayAgain={handleStartGame}
                  onGoHome={handleGoHome}
                  onOpenLeaderboard={() => {
                    sound.playClick();
                    setPhase('leaderboard');
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Instructions Modal */}
      <InstructionsModal
        isOpen={isHelpOpen}
        onClose={() => setIsHelpOpen(false)}
      />
    </div>
  );
}

