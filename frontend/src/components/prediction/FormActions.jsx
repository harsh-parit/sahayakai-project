import { motion } from 'framer-motion';
import { RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '../../utils';

/**
 * FormActions — sticky bottom bar with Reset and Submit buttons.
 *
 * Props:
 *   onReset      () => void
 *   onSubmit     () => void
 *   isSubmitting bool     — disables submit, shows spinner
 *   isDisabled   bool     — disables submit independently of loading
 *   errorCount   number   — live form error count shown as badge
 */
export default function FormActions({
  onReset,
  onSubmit,
  isSubmitting = false,
  isDisabled = false,
  errorCount = 0,
}) {
  const submitDisabled = isSubmitting || isDisabled;

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
      {/* Error summary badge */}
      {errorCount > 0 && (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xs text-[#da1e28] flex items-center gap-1.5 mr-auto"
          role="alert"
          aria-live="polite"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 shrink-0" aria-hidden="true">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4.5zm0 6.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </svg>
          {errorCount} field{errorCount > 1 ? 's' : ''} need{errorCount === 1 ? 's' : ''} attention
        </motion.p>
      )}

      {/* Reset button */}
      <motion.button
        type="button"
        onClick={onReset}
        disabled={isSubmitting}
        whileHover={isSubmitting ? {} : { scale: 1.02 }}
        whileTap={isSubmitting ? {} : { scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl',
          'text-sm font-semibold text-[#c6c6c6] glass-card',
          'hover:border-white/25 hover:text-[#f4f4f4] transition-colors duration-150',
          isSubmitting && 'opacity-40 cursor-not-allowed'
        )}
      >
        <RotateCcw size={15} aria-hidden="true" />
        Reset Form
      </motion.button>

      {/* Submit button */}
      <motion.button
        type="submit"
        onClick={onSubmit}
        disabled={submitDisabled}
        whileHover={submitDisabled ? {} : { scale: 1.02 }}
        whileTap={submitDisabled ? {} : { scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 h-11 px-8 rounded-xl',
          'text-sm font-semibold text-white bg-[#0f62fe]',
          'hover:bg-[#0043ce] active:bg-[#002d9c]',
          'shadow-lg shadow-blue-900/30 transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4589ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]',
          submitDisabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSubmitting ? (
          <>
            <svg
              className="animate-spin h-4 w-4 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Running Prediction…
          </>
        ) : (
          <>
            <Sparkles size={15} aria-hidden="true" />
            Predict Eligibility
          </>
        )}
      </motion.button>
    </div>
  );
}
