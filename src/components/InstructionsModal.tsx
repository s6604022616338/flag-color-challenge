import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, HelpCircle, Check, Palette, Shuffle, Award, Sparkles } from 'lucide-react';
import { FlagRenderer } from './FlagRenderer';

interface InstructionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstructionsModal: React.FC<InstructionsModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Modal Content */}
          <motion.div
            id="instructions-modal"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-sky-100 p-5 sm:p-6 z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h2 className="text-lg font-bold text-slate-800">
                  วิธีเล่นเกม Flag Color Challenge!
                </h2>
              </div>
              <button
                id="close-help-modal"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="ปิดหน้าต่างวิธีเล่น"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content list */}
            <div className="mt-4 space-y-4 text-xs sm:text-sm text-slate-600">
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-sky-50/60 border border-sky-100">
                <div className="w-7 h-7 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-0.5 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-sky-600" /> ดูโจทย์ชื่อประเทศ
                  </h4>
                  <p className="leading-relaxed">
                    ระบบจะแสดงชื่อประเทศภาษาไทย เช่น <strong>“ประเทศฝรั่งเศส”</strong> ในแต่ละข้อ
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                <div className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-0.5 flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5 text-amber-600" /> สังเกตตัวเลือกธง 4 รูป
                  </h4>
                  <p className="leading-relaxed">
                    มี <strong>เพียง 1 รูปเท่านั้นที่ถูกต้อง</strong> ส่วนอีก 3 รูปจะถูกดัดแปลง เช่น สลับแถบสี เปลี่ยนเฉดสี หรือใช้สีอื่นมาหลอกคุณ
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <div className="w-7 h-7 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-0.5 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600" /> รับคะแนนและเรียนรู้
                  </h4>
                  <p className="leading-relaxed">
                    ตอบถูกรับ <strong>10 คะแนน</strong> ตอบผิดได้ 0 คะแนน พร้อมคำอธิบายเฉลยที่ถูกต้อง
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <div className="w-7 h-7 rounded-lg bg-indigo-500 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  4
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-0.5 flex items-center gap-1.5">
                    <Shuffle className="w-3.5 h-3.5 text-indigo-600" /> ครบ 10 ข้อประเมินผล
                  </h4>
                  <p className="leading-relaxed">
                    หนึ่งรอบมี 10 ข้อ (ประเทศไม่ซ้ำกัน) รวม 100 คะแนน และระบบจะประเมินระดับความแม่นยำของคุณ
                  </p>
                </div>
              </div>

              {/* Example Graphic */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  ตัวอย่างการสังเกต: ฝรั่งเศส (น้ำเงิน-ขาว-แดง)
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-emerald-300">
                    <div className="w-10">
                      <FlagRenderer
                        renderType="vertical-3-stripes"
                        colors={['#002654', '#FFFFFF', '#ED2939']}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-emerald-700 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> ถูกต้อง
                    </span>
                  </div>
                  <div className="flex items-center gap-2 p-1.5 bg-white rounded-lg border border-rose-300">
                    <div className="w-10">
                      <FlagRenderer
                        renderType="vertical-3-stripes"
                        colors={['#ED2939', '#FFFFFF', '#002654']}
                      />
                    </div>
                    <span className="text-[11px] font-medium text-rose-600 flex items-center gap-1">
                      <X className="w-3 h-3 text-rose-500" /> สลับสี
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Button */}
            <div className="mt-5">
              <button
                id="close-instructions-btn"
                type="button"
                onClick={onClose}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md"
              >
                เข้าใจแล้ว พร้อมลุย!
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
