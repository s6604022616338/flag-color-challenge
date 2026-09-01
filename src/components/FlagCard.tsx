import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { FlagRenderer } from './FlagRenderer';
import { FlagVariation, FlagRenderType } from '../types';

interface FlagCardProps {
  option: FlagVariation;
  index: number;
  renderType: FlagRenderType;
  countryName: string;
  hasAnswered: boolean;
  isSelected: boolean;
  isCorrectOption: boolean;
  onSelect: (option: FlagVariation) => void;
}

const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const OPTION_LABELS_TH = ['ก', 'ข', 'ค', 'ง'];

export const FlagCard: React.FC<FlagCardProps> = ({
  option,
  index,
  renderType,
  countryName,
  hasAnswered,
  isSelected,
  isCorrectOption,
  onSelect,
}) => {
  // Determine state-based sleek borders and rings
  let borderClasses = 'border-transparent hover:border-sky-300 shadow-md hover:shadow-xl hover:-translate-y-1';
  let badgeColor = 'bg-slate-900/70 text-white backdrop-blur-xs';

  if (hasAnswered) {
    if (isCorrectOption && isSelected) {
      borderClasses = 'border-emerald-500 ring-8 ring-emerald-500/15 shadow-xl scale-[1.02]';
      badgeColor = 'bg-emerald-500 text-white';
    } else if (isCorrectOption && !isSelected) {
      borderClasses = 'border-emerald-400 ring-4 ring-emerald-400/20 shadow-lg';
      badgeColor = 'bg-emerald-500 text-white';
    } else if (isSelected && !option.isCorrect) {
      borderClasses = 'border-rose-500 ring-8 ring-rose-500/15 shadow-xl';
      badgeColor = 'bg-rose-500 text-white';
    } else {
      borderClasses = 'border-transparent opacity-40 grayscale-[20%]';
      badgeColor = 'bg-slate-800/40 text-slate-300';
    }
  }

  return (
    <motion.button
      id={`flag-option-${index}`}
      type="button"
      disabled={hasAnswered}
      onClick={() => !hasAnswered && onSelect(option)}
      whileTap={!hasAnswered ? { scale: 0.96 } : {}}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25, delay: index * 0.05 }}
      className={`group relative aspect-[3/2] w-full rounded-2xl sm:rounded-3xl overflow-hidden transition-all duration-300 border-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-sky-400 cursor-pointer disabled:cursor-default ${borderClasses}`}
      aria-label={`ตัวเลือก ${OPTION_LABELS[index]}`}
    >
      {/* Flag Canvas */}
      <FlagRenderer
        id={`svg-flag-${index}`}
        renderType={renderType}
        colors={option.colors}
        className="w-full h-full object-cover"
      />

      {/* Choice label badge (Top-Left) */}
      <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
        <span
          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl flex items-center justify-center font-black text-xs sm:text-sm shadow-md transition-all ${badgeColor}`}
        >
          {OPTION_LABELS[index]}
        </span>
      </div>

      {/* Answer status indicator (Top-Right) */}
      {hasAnswered && (
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 animate-in zoom-in-75 duration-200">
          {isCorrectOption ? (
            <div className="bg-emerald-500 text-white rounded-full p-1.5 sm:p-2 shadow-lg flex items-center justify-center">
              <Check className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
            </div>
          ) : isSelected ? (
            <div className="bg-rose-500 text-white rounded-full p-1.5 sm:p-2 shadow-lg flex items-center justify-center">
              <X className="w-4 h-4 sm:w-5 sm:h-5 stroke-[3]" />
            </div>
          ) : null}
        </div>
      )}

      {/* Sleek subtle dark hover tint */}
      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors pointer-events-none" />

      {/* Educational Note tag revealed on answer (Bottom bar) */}
      {hasAnswered && option.label && (
        <div className="absolute inset-x-0 bottom-0 bg-slate-950/80 backdrop-blur-xs py-1.5 px-3 text-center text-white text-[11px] sm:text-xs font-medium truncate">
          {option.label}
        </div>
      )}
    </motion.button>
  );
};
