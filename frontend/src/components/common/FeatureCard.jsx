import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { fadeInUp } from '../../utils';
import { cn } from '../../utils';

/** Maps color keys to Tailwind inline style values */
const colorMap = {
  blue:   { bg: 'rgba(15,98,254,0.12)',  border: 'rgba(15,98,254,0.25)',  text: '#4589ff' },
  purple: { bg: 'rgba(138,63,252,0.12)', border: 'rgba(138,63,252,0.25)', text: '#be95ff' },
  cyan:   { bg: 'rgba(17,146,232,0.12)', border: 'rgba(17,146,232,0.25)', text: '#33b1ff' },
  green:  { bg: 'rgba(36,161,72,0.12)',  border: 'rgba(36,161,72,0.25)',  text: '#42be65' },
  orange: { bg: 'rgba(255,131,0,0.12)',  border: 'rgba(255,131,0,0.25)',  text: '#ff8300' },
  indigo: { bg: 'rgba(105,41,196,0.12)', border: 'rgba(105,41,196,0.25)', text: '#a56eff' },
};

/**
 * Feature card used on the Home page.
 * Renders a Lucide icon, title, description, and a badge tag.
 */
export default function FeatureCard({ icon, title, description, color = 'blue', tag, className }) {
  const IconComponent = LucideIcons[icon] || LucideIcons.Star;
  const palette = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.22 } }}
      className={cn(
        'group relative rounded-2xl p-6 glass-card flex flex-col gap-4 cursor-default',
        className
      )}
    >
      {/* Icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: palette.bg, border: `1px solid ${palette.border}` }}
      >
        <IconComponent size={22} style={{ color: palette.text }} />
      </div>

      {/* Tag badge */}
      {tag && (
        <span
          className="self-start text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full"
          style={{ background: palette.bg, color: palette.text, border: `1px solid ${palette.border}` }}
        >
          {tag}
        </span>
      )}

      <div>
        <h3 className="text-base font-semibold text-[#f4f4f4] mb-2">{title}</h3>
        <p className="text-sm text-[#8d8d8d] leading-relaxed">{description}</p>
      </div>

      {/* Subtle bottom accent line on hover */}
      <div
        className="absolute bottom-0 left-6 right-6 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(90deg, transparent, ${palette.text}, transparent)` }}
      />
    </motion.div>
  );
}
