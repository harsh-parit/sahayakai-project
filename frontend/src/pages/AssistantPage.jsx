import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Sparkles, Brain, Zap } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../utils';
import Button from '../components/common/Button';

const capabilities = [
  { icon: Brain, text: 'Powered by IBM Watsonx.ai (granite-13b-instruct)' },
  { icon: MessageSquare, text: 'Natural language welfare scheme queries' },
  { icon: Zap, text: 'Instant answers to eligibility questions' },
];

export default function AssistantPage() {
  return (
    <div className="min-h-screen ibm-grid-bg flex items-center">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-[#8a3ffc]/8 blur-3xl" />
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
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#8a3ffc]/20 to-[#0f62fe]/20 border border-[#8a3ffc]/30 flex items-center justify-center glow-purple">
              <MessageSquare size={36} className="text-[#be95ff]" aria-hidden="true" />
            </div>
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8a3ffc]/10 border border-[#8a3ffc]/25 text-[#be95ff] text-xs font-semibold tracking-widest uppercase">
              <Sparkles size={12} aria-hidden="true" />
              Under Development
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeInUp} className="flex flex-col gap-3">
            <h1 className="text-4xl sm:text-5xl font-bold text-[#f4f4f4] leading-tight">
              AI <span className="gradient-text">Assistant</span>
            </h1>
            <p className="text-base sm:text-lg text-[#8d8d8d] leading-relaxed">
              The conversational AI assistant will allow applicants and officers to ask natural
              language questions about welfare schemes, eligibility criteria, and application
              status — all powered by IBM Watsonx.ai.
            </p>
          </motion.div>

          {/* Feature bullets */}
          <motion.ul variants={staggerContainer} className="flex flex-col gap-3 w-full max-w-sm text-left">
            {capabilities.map(({ icon: Icon, text }) => (
              <motion.li
                key={text}
                variants={fadeInUp}
                className="flex items-center gap-3 glass-card rounded-xl px-4 py-3 text-sm text-[#c6c6c6]"
              >
                <Icon size={16} className="text-[#be95ff] shrink-0" aria-hidden="true" />
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
            <Link to="/about">
              <Button variant="secondary" size="lg">
                About the Project
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
