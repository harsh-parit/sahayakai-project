import { motion } from 'framer-motion';
import { cn } from '../../utils';
import { fadeInUp } from '../../utils';

/**
 * SectionCard — groups related form fields under a titled card.
 *
 * Props:
 *   title    string       — section heading
 *   icon     ReactNode    — Lucide icon element
 *   children ReactNode    — form fields
 *   className string
 */
export default function SectionCard({ title, icon, children, className }) {
  return (
    <motion.fieldset
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      className={cn(
        'rounded-2xl glass-card p-6 flex flex-col gap-5 border-0',
        className
      )}
    >
      {/* Section header */}
      <legend className="flex items-center gap-2.5 w-full pb-4 border-b border-white/8">
        {icon && (
          <span className="w-8 h-8 rounded-lg bg-[#0f62fe]/12 border border-[#0f62fe]/20 flex items-center justify-center shrink-0 text-[#4589ff]">
            {icon}
          </span>
        )}
        <span className="text-sm font-semibold text-[#f4f4f4] uppercase tracking-widest">
          {title}
        </span>
      </legend>

      {/* Fields grid — two columns on sm+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {children}
      </div>
    </motion.fieldset>
  );
}
