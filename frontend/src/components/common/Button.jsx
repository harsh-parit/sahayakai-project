import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

/**
 * Reusable Button component with IBM-inspired design.
 * Supports: primary | secondary | ghost | danger variants, sizes, loading state.
 */
const Button = forwardRef(function Button(
  {
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className,
    as: Tag = 'button',
    ...props
  },
  ref
) {
  const base =
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f] cursor-pointer select-none';

  const variants = {
    primary:
      'bg-[#0f62fe] text-white hover:bg-[#0043ce] active:bg-[#002d9c] focus-visible:ring-[#0f62fe] shadow-lg shadow-blue-900/30',
    secondary:
      'bg-white/8 text-[#f4f4f4] border border-white/15 hover:bg-white/12 hover:border-white/25 active:bg-white/6 focus-visible:ring-white/40',
    ghost:
      'text-[#4589ff] hover:bg-[#0f62fe]/10 active:bg-[#0f62fe]/20 focus-visible:ring-[#4589ff]',
    danger:
      'bg-[#da1e28] text-white hover:bg-[#ba1b23] active:bg-[#99151e] focus-visible:ring-[#da1e28]',
    gradient:
      'bg-gradient-to-r from-[#0f62fe] to-[#8a3ffc] text-white hover:opacity-90 active:opacity-80 focus-visible:ring-[#8a3ffc] shadow-lg shadow-purple-900/30',
  };

  const sizes = {
    sm: 'h-8 px-4 text-sm',
    md: 'h-10 px-6 text-sm',
    lg: 'h-12 px-8 text-base',
    xl: 'h-14 px-10 text-lg',
  };

  return (
    <motion.div
      whileHover={disabled || loading ? {} : { scale: 1.02 }}
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      style={{ display: 'inline-flex' }}
    >
      <Tag
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], (disabled || loading) && 'opacity-50 cursor-not-allowed', className)}
        {...props}
      >
        {loading && (
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
        )}
        {children}
      </Tag>
    </motion.div>
  );
});

export default Button;
