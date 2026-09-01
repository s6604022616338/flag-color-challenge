import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, XCircle, ArrowRight, Trophy } from 'lucide-react';
import { CountryFlagData, FlagVariation } from '../types';
import { sound } from '../utils/audio';

interface FeedbackBannerProps {
  isCorrect: boolean;
  country: CountryFlagData;
  correctOption: FlagVariation;
  selectedOption: FlagVariation;
  isLastQuestion: boolean;
  onNextQuestion: () => void;
}

export const FeedbackBanner: React.FC<FeedbackBannerProps> = ({
  isCorrect,
  country,
  correctOption,
  selectedOption,
  isLastQuestion,
  onNextQuestion,
}) => {
  return (
    <motion.div
      id="feedback-banner"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="w-full mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      {/* Answer feedback status & note */}
      <div className="flex items-start gap-3 w-full sm:w-auto">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
            isCorrect
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-rose-500 text-white shadow-rose-500/20'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          ) : (
            <XCircle className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          )}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <h3
              className={`text-base sm:text-lg font-black tracking-tight ${
                isCorrect ? 'text-emerald-600' : 'text-rose-600'
              }`}
            >
              {isCorrect ? 'ตอบถูกต้อง! (+10)' : 'ตอบผิด (+0)'}
            </h3>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 leading-relaxed">
            <strong className="font-semibold text-slate-700">{country.nameTh}:</strong> {country.description}
          </p>
        </div>
      </div>

      {/* Next Question CTA Button */}
      <div className="w-full sm:w-auto shrink-0">
        <button
          id="next-question-button"
          type="button"
          onClick={() => {
            sound.playClick();
            onNextQuestion();
          }}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-7 sm:px-8 py-3.5 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 text-sm sm:text-base"
        >
          <span>{isLastQuestion ? 'ดูผลคะแนนรวม' : 'ข้อต่อไป'}</span>
          {isLastQuestion ? (
            <Trophy className="w-4 h-4 text-amber-400" />
          ) : (
            <ArrowRight className="w-4 h-4" />
          )}
        </button>
      </div>
    </motion.div>
  );
};
