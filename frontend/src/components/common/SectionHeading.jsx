import { motion } from 'framer-motion';
import { fadeInUp } from '../../utils';
import { cn } from '../../utils';

/**
 * Reusable section heading with optional subtitle and accent tag.
 * Animates in when it enters the viewport.
 */
export default function SectionHeading({
  tag,
  title,
  titleGradient,
  subtitle,
  centered = false,
  className,
}) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      className={cn('mb-12', centered && 'text-center', className)}
    >
      {tag && (
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0f62fe]/10 border border-[#0f62fe]/20 text-[#4589ff] text-xs font-semibold tracking-widest uppercase mb-4">
          {tag}
        </span>
      )}

      <h2 className="text-3xl sm:text-4xl font-bold text-[#f4f4f4] leading-tight">
        {title}{' '}
        {titleGradient && (
          <span className="gradient-text">{titleGradient}</span>
        )}
      </h2>

      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-[#8d8d8d] max-w-2xl leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
