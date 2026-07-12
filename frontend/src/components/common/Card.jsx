import { motion } from 'framer-motion';
import { cn } from '../../utils';
import { scaleIn } from '../../utils';

/**
 * Reusable Card component with glass morphism styling.
 * Supports hover animation and custom className overrides.
 */
export default function Card({ children, className, hover = false, animate = false, ...props }) {
  const base = 'rounded-2xl glass-card p-6';

  if (animate) {
    return (
      <motion.div
        variants={scaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        whileHover={hover ? { y: -4, scale: 1.02, transition: { duration: 0.22 } } : {}}
        className={cn(base, hover && 'cursor-pointer', className)}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(base, className)} {...props}>
      {children}
    </div>
  );
}
