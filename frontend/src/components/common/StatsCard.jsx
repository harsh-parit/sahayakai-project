import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { scaleIn } from '../../utils';

/**
 * Stats card — displays a headline metric with icon and label.
 */
export default function StatsCard({ value, label, icon }) {
  const IconComponent = LucideIcons[icon] || LucideIcons.Activity;

  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-30px' }}
      className="glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-3"
    >
      <div className="w-10 h-10 rounded-xl bg-[#0f62fe]/12 border border-[#0f62fe]/20 flex items-center justify-center">
        <IconComponent size={20} className="text-[#4589ff]" />
      </div>
      <span className="text-3xl font-bold gradient-text">{value}</span>
      <span className="text-xs text-[#8d8d8d] font-medium tracking-wide uppercase">{label}</span>
    </motion.div>
  );
}
