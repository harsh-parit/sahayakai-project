import { cn } from '../../utils';

/**
 * InputField — labelled text/number input with inline error display.
 *
 * Props:
 *   id          string   — ties <label> to <input> via htmlFor / id
 *   label       string   — visible label text
 *   type        string   — input type (text | number | tel | email)
 *   value       string   — controlled value
 *   onChange    function — (e) => void
 *   onBlur      function — (e) => void  (triggers touched state in parent)
 *   error       string   — validation message; falsy = no error shown
 *   placeholder string
 *   required    bool
 *   hint        string   — optional helper text shown below the input
 *   className   string   — extra classes for the wrapper div
 */
export default function InputField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  hint,
  className,
  ...inputProps
}) {
  const hasError = Boolean(error);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {/* Label */}
      <label
        htmlFor={id}
        className="text-sm font-medium text-[#c6c6c6]"
      >
        {label}
        {required && (
          <span className="ml-1 text-[#da1e28]" aria-hidden="true">*</span>
        )}
      </label>

      {/* Input */}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={hasError}
        className={cn(
          'h-11 w-full rounded-xl px-4 text-sm text-[#f4f4f4] placeholder:text-[#6f6f6f]',
          'bg-white/5 border transition-all duration-150 outline-none',
          'focus:ring-2 focus:ring-offset-0',
          hasError
            ? 'border-[#da1e28]/70 focus:border-[#da1e28] focus:ring-[#da1e28]/25 bg-[#da1e28]/5'
            : 'border-white/10 focus:border-[#4589ff] focus:ring-[#4589ff]/20 hover:border-white/20'
        )}
        {...inputProps}
      />

      {/* Error message */}
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

      {/* Hint text (only shown when no error) */}
      {!hasError && hint && (
        <p id={`${id}-hint`} className="text-xs text-[#8d8d8d]">
          {hint}
        </p>
      )}
    </div>
  );
}
