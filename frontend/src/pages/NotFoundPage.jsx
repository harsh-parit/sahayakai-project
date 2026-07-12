import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft, Home, Search } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../utils';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen ibm-grid-bg flex items-center">
      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[300px] bg-[#da1e28]/6 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center text-center gap-8 max-w-xl mx-auto"
        >
          {/* Icon */}
          <motion.div variants={fadeInUp}>
            <div className="w-24 h-24 rounded-3xl bg-[#da1e28]/10 border border-[#da1e28]/25 flex items-center justify-center">
              <AlertTriangle size={40} className="text-[#da1e28]" aria-hidden="true" />
            </div>
          </motion.div>

          {/* 404 */}
          <motion.div variants={fadeInUp}>
            <p className="text-8xl font-black gradient-text leading-none">404</p>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#f4f4f4]">
              Page Not Found
            </h1>
            <p className="text-[#8d8d8d] leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
              Let's get you back to safety.
            </p>
          </motion.div>

          {/* Quick links */}
          <motion.div variants={fadeInUp} className="glass-card rounded-2xl p-5 w-full max-w-sm">
            <p className="text-xs text-[#8d8d8d] uppercase tracking-wider font-medium mb-3">
              Popular pages
            </p>
            <ul className="flex flex-col gap-2">
              {[
                { to: '/', label: 'Home', icon: Home },
                { to: '/eligibility', label: 'Eligibility Checker', icon: Search },
                { to: '/about', label: 'About SahayakAI', icon: AlertTriangle },
              ].map(({ to, label, icon: Icon }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#c6c6c6] hover:text-[#4589ff] hover:bg-[#0f62fe]/8 transition-colors duration-150"
                  >
                    <Icon size={14} aria-hidden="true" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3">
            <Link to="/">
              <Button variant="primary" size="lg">
                <Home size={16} aria-hidden="true" />
                Go Home
              </Button>
            </Link>
            <button
              type="button"
              onClick={() => history.back()}
              className="inline-flex items-center gap-2 h-12 px-8 rounded-lg glass-card text-sm font-semibold text-[#f4f4f4] hover:border-white/25 transition-colors duration-150"
            >
              <ArrowLeft size={16} aria-hidden="true" />
              Go Back
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
