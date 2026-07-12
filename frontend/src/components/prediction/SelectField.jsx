import { ChevronDown } from 'lucide-react';
import { cn } from '../../utils';

/**
 * SelectField — labelled native <select> with custom styling and inline error.
 *
 * Props:
 *   id          string                       — ties <label> to <select>
 *   label       string
 *   value       string                       — controlled value
 *   onChange    (e) => void
 *   onBlur      (e) => void
 *   options     Array<{value, label}>        — option list
 *   placeholder string                       — empty/default option text
 *   error       string                       — validation message
 *   required    bool
 *   hint        string
 *   className   string
 */
export default function SelectField({
  id,
  label,
  value,
  onChange,
  onBlur,
  options = [],
  placeholder = 'Select an option',
  error,
  required = false,
  hint,
  className,
}) {
  const hasError = Boolean(error);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* Label */}
      <label htmlFor={id} className="text-sm font-medium text-[#c6c6c6]">
        {label}
        {required && (
          <span className="ml-1 text-[#da1e28]" aria-hidden="true">*</span>
        )}
      </label>

      {/* Select wrapper — positions the chevron icon */}
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
          aria-invalid={hasError}
          className={cn(
            'h-11 w-full appearance-none rounded-xl pl-4 pr-10 text-sm transition-all duration-150 outline-none',
            'bg-white/5 border cursor-pointer',
            'focus:ring-2 focus:ring-offset-0',
            // Empty value = placeholder style
            value === '' ? 'text-[#6f6f6f]' : 'text-[#f4f4f4]',
            hasError
              ? 'border-[#da1e28]/70 focus:border-[#da1e28] focus:ring-[#da1e28]/25 bg-[#da1e28]/5'
              : 'border-white/10 focus:border-[#4589ff] focus:ring-[#4589ff]/20 hover:border-white/20'
          )}
        >
          <option value="" disabled className="bg-[#1a1a24] text-[#6f6f6f]">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#1a1a24] text-[#f4f4f4]">
              {opt.label}
            </option>
          ))}
        </select>

        {/* Chevron icon */}
        <ChevronDown
          size={16}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6f6f6f] pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* Error */}
      {hasError && (
        <p
          id={`${id}-error`}
          role="alert"
          className="text-xs text-[#da1e28] flex items-center gap-1 mt-0.5"
        >
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3 shrink-0" aria-hidden="true">
            <path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 3.5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4.5zm0 6.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
          </svg>
          {error}
        </p>
      )}

      {!hasError && hint && (
        <p id={`${id}-hint`} className="text-xs text-[#8d8d8d]">
          {hint}
        </p>
      )}
    </div>
  );
}
