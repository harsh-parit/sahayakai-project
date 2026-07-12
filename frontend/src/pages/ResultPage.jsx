import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileCheck, ArrowRight, Sparkles, CheckCircle, DownloadCloud, FileText } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../utils';
import Button from '../components/common/Button';

export default function ResultPage() {
  return (
    <div className="min-h-screen ibm-grid-bg flex items-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-[#33b1ff]/8 blur-3xl" />
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
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#33b1ff]/20 to-[#0f62fe]/20 border border-[#33b1ff]/30 flex items-center justify-center" style={{ boxShadow: '0 0 30px rgba(51,177,255,0.2)' }}>
              <FileCheck size={36} className="text-[#33b1ff]" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#33b1ff]/10 border border-[#33b1ff]/25 text-[#33b1ff] text-xs font-semibold tracking-widest uppercase">
              <Sparkles size={12} aria-hidden="true" />
              Eligibility Report
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#f4f4f4] leading-tight">
              Eligibility <span className="gradient-text">Result</span>
            </h1>
            <p className="text-base sm:text-lg text-[#8d8d8d] leading-relaxed">
              After completing the eligibility check, your comprehensive AI-generated report
              will appear here — including your eligibility score, key factors, and
              a Watsonx.ai plain-language explanation.
            </p>
          </motion.div>

          {/* What the result page will show */}
          <motion.ul variants={staggerContainer} className="flex flex-col gap-3 w-full max-w-sm text-left">
            {[
              { icon: CheckCircle, text: 'Eligibility score (0–100) with confidence interval' },
              { icon: FileText, text: 'AI-generated explanation of the decision' },
              { icon: DownloadCloud, text: 'Downloadable PDF report for applicant & officer' },
            ].map(({ icon: Icon, text }) => (
              <motion.li
                key={text}
                variants={fadeInUp}
                className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 text-sm text-[#c6c6c6]"
              >
                <Icon size={16} className="text-[#33b1ff] shrink-0" aria-hidden="true" />
                {text}
              </motion.li>
            ))}
          </motion.ul>

          {/* CTA */}
          <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 pt-2">
            <Link to="/eligibility">
              <Button variant="primary" size="lg">
                Start Eligibility Check
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="secondary" size="lg">
                Back to Home
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
