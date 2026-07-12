import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../../utils';

/**
 * ProgressIndicator — horizontal stepper showing which form section
 * is currently focused.
 *
 * Props:
 *   steps        Array<string>  — step labels
 *   currentStep  number         — 0-based index of the active step
 */
export default function ProgressIndicator({ steps, currentStep }) {
  return (
    <nav aria-label="Form progress" className="w-full">
      <ol className="flex items-center gap-0">
        {steps.map((label, index) => {
          const isDone    = index < currentStep;
          const isActive  = index === currentStep;
          const isLast    = index === steps.length - 1;

          return (
            <li key={label} className={cn('flex items-center', !isLast && 'flex-1')}>
              {/* Step node */}
              <div className="flex flex-col items-center gap-1.5">
                <motion.div
                  animate={
                    isDone
                      ? { background: '#24a148', borderColor: '#24a148', scale: 1 }
                      : isActive
                      ? { borderColor: '#4589ff', scale: 1.08 }
                      : { borderColor: 'rgba(255,255,255,0.12)', scale: 1 }
                  }
                  transition={{ duration: 0.3 }}
                  className={cn(
                    'w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0',
                    isDone   ? 'bg-[#24a148] border-[#24a148] text-white'
                    : isActive ? 'border-[#4589ff] text-[#4589ff] bg-[#0f62fe]/10'
                    : 'border-white/12 text-[#6f6f6f] bg-white/3'
                  )}
                >
                  {isDone ? (
                    <Check size={13} aria-hidden="true" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </motion.div>

                {/* Label — hidden on very small screens */}
                <span
                  className={cn(
                    'hidden sm:block text-[10px] font-medium whitespace-nowrap leading-tight text-center',
                    isActive ? 'text-[#4589ff]' : isDone ? 'text-[#42be65]' : 'text-[#6f6f6f]'
                  )}
                >
                  {label}
                </span>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="flex-1 mx-1.5 mb-5 sm:mb-4">
                  <motion.div
                    animate={{ background: isDone ? '#24a148' : 'rgba(255,255,255,0.08)' }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="h-px w-full rounded-full"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
