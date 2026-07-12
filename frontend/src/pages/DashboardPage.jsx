import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart3, ArrowRight, Sparkles, TrendingUp, PieChart, Activity } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../utils';
import Button from '../components/common/Button';

const dashboardFeatures = [
  { icon: BarChart3,  text: 'Application volume trends over time' },
  { icon: PieChart,   text: 'Eligibility distribution by region & scheme' },
  { icon: TrendingUp, text: 'Model accuracy and drift monitoring' },
  { icon: Activity,   text: 'Real-time processing pipeline metrics' },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen ibm-grid-bg flex items-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-[#42be65]/6 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center gap-8 max-w-2xl mx-auto"
        >
          {/* Icon */}
          <motion.div variants={fadeInUp}>
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#42be65]/20 to-[#0f62fe]/20 border border-[#42be65]/30 flex items-center justify-center" style={{ boxShadow: '0 0 30px rgba(66,190,101,0.2)' }}>
              <BarChart3 size={36} className="text-[#42be65]" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#42be65]/10 border border-[#42be65]/25 text-[#42be65] text-xs font-semibold tracking-widest uppercase">
              <Sparkles size={12} aria-hidden="true" />
              Coming Soon
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#f4f4f4] leading-tight">
              Analytics <span className="gradient-text">Dashboard</span>
            </h1>
            <p className="text-base sm:text-lg text-[#8d8d8d] leading-relaxed">
              The interactive analytics dashboard will give administrators and policy makers
              deep visibility into welfare eligibility patterns — built with Recharts and
              backed by real-time IBM Cloud data streams.
            </p>
          </motion.div>

          {/* Preview cards */}
          <motion.ul variants={staggerContainer} className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg text-left">
            {dashboardFeatures.map(({ icon: Icon, text }) => (
              <motion.li
                key={text}
                variants={fadeInUp}
                className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 text-sm text-[#c6c6c6]"
              >
                <Icon size={16} className="text-[#42be65] shrink-0" aria-hidden="true" />
                {text}
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/eligibility">
              <Button variant="primary" size="lg">
                Try Eligibility Checker
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/assistant">
              <Button variant="secondary" size="lg">
                Explore AI Assistant
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
