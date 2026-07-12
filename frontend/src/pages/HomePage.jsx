import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Sparkles, Brain, BarChart3, Shield, CheckCircle2,
  GitBranch, Zap, Users, Target,
} from 'lucide-react';
import { FEATURES, HOW_IT_WORKS_STEPS, TECH_STACK, STATS, BENEFITS } from '../constants';
import { fadeInUp, fadeIn, staggerContainer, slideInLeft, slideInRight } from '../utils';
import SectionHeading from '../components/common/SectionHeading';
import FeatureCard from '../components/common/FeatureCard';
import StatsCard from '../components/common/StatsCard';
import Button from '../components/common/Button';
import * as LucideIcons from 'lucide-react';

/* ─── Illustration SVG (inline, no external assets) ─────────────────────────── */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 440 380" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="w-full h-full max-w-lg">
      {/* Outer orbit ring */}
      <circle cx="220" cy="190" r="170" stroke="rgba(69,137,255,0.15)" strokeWidth="1" strokeDasharray="4 6" />
      {/* Middle orbit ring */}
      <circle cx="220" cy="190" r="120" stroke="rgba(138,63,252,0.2)" strokeWidth="1" strokeDasharray="3 5" />
      {/* Inner orbit ring */}
      <circle cx="220" cy="190" r="70" stroke="rgba(51,177,255,0.2)" strokeWidth="1.5" />

      {/* Central glowing node */}
      <circle cx="220" cy="190" r="36" fill="rgba(15,98,254,0.18)" stroke="rgba(69,137,255,0.5)" strokeWidth="1.5" />
      <circle cx="220" cy="190" r="22" fill="rgba(15,98,254,0.35)" />
      {/* Brain icon path simplified */}
      <text x="210" y="196" fontSize="20" fill="#4589ff" fontFamily="sans-serif">🧠</text>

      {/* Orbit nodes */}
      <circle cx="220" cy="70" r="14" fill="rgba(138,63,252,0.25)" stroke="rgba(190,149,255,0.6)" strokeWidth="1.5" />
      <text x="213" y="77" fontSize="13" fill="#be95ff">AI</text>

      <circle cx="360" cy="230" r="14" fill="rgba(17,146,232,0.25)" stroke="rgba(51,177,255,0.6)" strokeWidth="1.5" />
      <text x="353" y="237" fontSize="11" fill="#33b1ff">ML</text>

      <circle cx="100" cy="140" r="14" fill="rgba(36,161,72,0.25)" stroke="rgba(66,190,101,0.6)" strokeWidth="1.5" />
      <text x="92" y="147" fontSize="11" fill="#42be65">✓</text>

      <circle cx="310" cy="60" r="10" fill="rgba(255,131,0,0.2)" stroke="rgba(255,131,0,0.5)" strokeWidth="1.5" />
      <circle cx="130" cy="300" r="10" fill="rgba(105,41,196,0.2)" stroke="rgba(165,110,255,0.5)" strokeWidth="1.5" />
      <circle cx="370" cy="120" r="8" fill="rgba(15,98,254,0.2)" stroke="rgba(69,137,255,0.5)" strokeWidth="1.5" />

      {/* Connector lines */}
      <line x1="220" y1="154" x2="220" y2="84" stroke="rgba(190,149,255,0.3)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="249" y1="170" x2="346" y2="224" stroke="rgba(51,177,255,0.3)" strokeWidth="1" strokeDasharray="3 3" />
      <line x1="191" y1="172" x2="114" y2="148" stroke="rgba(66,190,101,0.3)" strokeWidth="1" strokeDasharray="3 3" />

      {/* Data flow dots */}
      <circle cx="220" cy="120" r="3" fill="#be95ff" opacity="0.7" />
      <circle cx="290" cy="200" r="3" fill="#33b1ff" opacity="0.7" />
      <circle cx="150" cy="160" r="3" fill="#42be65" opacity="0.7" />
    </svg>
  );
}

/* ─── Hero Section ───────────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden ibm-grid-bg" aria-label="Hero">
      {/* Background radial glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-[#0f62fe]/8 blur-3xl" />
        <div className="absolute top-1/2 right-0 w-[400px] h-[400px] rounded-full bg-[#8a3ffc]/8 blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left: copy */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-6"
        >
          {/* Badge */}
          <motion.div variants={fadeInUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0f62fe]/10 border border-[#0f62fe]/25 text-[#4589ff] text-xs font-semibold tracking-widest uppercase">
              <Sparkles size={12} aria-hidden="true" />
              IBM SkillsBuild × Edunet Foundation
            </span>
          </motion.div>

          {/* Heading */}
          <motion.div variants={fadeInUp}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight text-[#f4f4f4]">
              Smart Welfare
              <br />
              <span className="gradient-text">Eligibility</span>
              <br />
              with IBM AI
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p variants={fadeInUp} className="text-base sm:text-lg text-[#8d8d8d] leading-relaxed max-w-lg">
            SahayakAI combines IBM AutoAI, Watsonx.ai, and IBM Orchestrate to deliver instant,
            explainable, and bias-free welfare eligibility decisions — at government scale.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 pt-2">
            <Link to="/eligibility">
              <Button variant="primary" size="lg">
                Check Eligibility
                <ArrowRight size={16} aria-hidden="true" />
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="secondary" size="lg">
                Learn More
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 pt-4">
            {[
              { icon: CheckCircle2, label: '95% Accuracy' },
              { icon: Zap, label: 'Real-time AI' },
              { icon: Shield, label: 'Bias-Free' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-sm text-[#8d8d8d]">
                <Icon size={14} className="text-[#42be65]" aria-hidden="true" />
                {label}
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Right: illustration */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-center"
        >
          <HeroIllustration />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-6 h-9 rounded-full border-2 border-white/15 flex items-start justify-center pt-1.5"
          aria-hidden="true"
        >
          <div className="w-1 h-2 rounded-full bg-white/30" />
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Stats Section ──────────────────────────────────────────────────────────── */
function StatsSection() {
  return (
    <section className="py-16 border-y border-white/6" aria-label="Key metrics">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <StatsCard key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Features Section ───────────────────────────────────────────────────────── */
function FeaturesSection() {
  return (
    <section className="py-24" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Platform Capabilities"
          title="Everything you need for"
          titleGradient="intelligent welfare decisions"
          subtitle="Six powerful AI-driven capabilities integrated into a single, production-ready platform."
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <FeatureCard key={f.id} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── How It Works Section ───────────────────────────────────────────────────── */
function HowItWorksSection() {
  return (
    <section className="py-24 bg-white/[0.02] border-y border-white/6" aria-labelledby="how-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Process"
          title="How"
          titleGradient="SahayakAI Works"
          subtitle="A transparent, five-step process from data entry to a fully verified eligibility report."
          centered
        />

        <div className="relative">
          {/* Desktop connector line */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#4589ff]/30 to-transparent" aria-hidden="true" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {HOW_IT_WORKS_STEPS.map((step) => {
              const IconComponent = LucideIcons[step.icon] || LucideIcons.Circle;
              return (
                <motion.div
                  key={step.step}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-40px' }}
                  className="relative flex flex-col items-center text-center gap-3"
                >
                  {/* Step circle */}
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl glass-card flex flex-col items-center justify-center gap-1">
                      <IconComponent size={22} className="text-[#4589ff]" aria-hidden="true" />
                      <span className="text-xs font-bold text-[#6f6f6f]">0{step.step}</span>
                    </div>
                  </div>

                  <h3 className="text-sm font-semibold text-[#f4f4f4] leading-snug">{step.title}</h3>
                  <p className="text-xs text-[#8d8d8d] leading-relaxed">{step.description}</p>

                  {/* Arrow between steps (mobile) */}
                  {step.step < HOW_IT_WORKS_STEPS.length && (
                    <ArrowRight
                      size={14}
                      className="text-[#6f6f6f] lg:hidden mt-1"
                      aria-hidden="true"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Tech Stack Section ─────────────────────────────────────────────────────── */
function TechStackSection() {
  return (
    <section className="py-24" aria-labelledby="tech-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          tag="Technology Stack"
          title="Built with the best"
          titleGradient="IBM enterprise tools"
          subtitle="A carefully selected stack of cutting-edge IBM AI and modern web technologies."
          centered
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3"
        >
          {TECH_STACK.map((tech) => (
            <motion.div
              key={tech.name}
              variants={fadeInUp}
              whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
              className="glass-card rounded-xl px-4 py-3 flex flex-col items-center gap-1 min-w-[110px]"
            >
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: tech.color }} aria-hidden="true" />
              <span className="text-sm font-semibold text-[#f4f4f4]">{tech.name}</span>
              <span className="text-[10px] text-[#8d8d8d] font-medium uppercase tracking-wider">{tech.category}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ─── Benefits Section ───────────────────────────────────────────────────────── */
function BenefitsSection() {
  return (
    <section className="py-24 bg-white/[0.02] border-y border-white/6" aria-labelledby="benefits-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: heading + copy */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col gap-4"
          >
            <span className="inline-flex self-start items-center gap-2 px-3 py-1 rounded-full bg-[#0f62fe]/10 border border-[#0f62fe]/20 text-[#4589ff] text-xs font-semibold tracking-widest uppercase">
              Why SahayakAI
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#f4f4f4] leading-tight">
              Transform welfare delivery with <span className="gradient-text">AI-first design</span>
            </h2>
            <p className="text-[#8d8d8d] leading-relaxed">
              SahayakAI modernises government welfare infrastructure by replacing slow, error-prone
              manual processes with a transparent AI pipeline that works at scale.
            </p>
          </motion.div>

          {/* Right: benefit cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {BENEFITS.map((b) => {
              const IconComponent = LucideIcons[b.icon] || LucideIcons.CheckCircle;
              return (
                <motion.div
                  key={b.title}
                  variants={fadeInUp}
                  className="glass-card rounded-2xl p-5 flex flex-col gap-3"
                >
                  <div className="w-9 h-9 rounded-lg bg-[#0f62fe]/10 border border-[#0f62fe]/20 flex items-center justify-center">
                    <IconComponent size={18} className="text-[#4589ff]" aria-hidden="true" />
                  </div>
                  <h3 className="text-sm font-semibold text-[#f4f4f4]">{b.title}</h3>
                  <p className="text-xs text-[#8d8d8d] leading-relaxed">{b.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ─── CTA Section ────────────────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="py-24" aria-labelledby="cta-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f62fe]/20 via-[#8a3ffc]/15 to-[#1192e8]/10 pointer-events-none" />
          <div className="absolute inset-0 ibm-grid-bg pointer-events-none opacity-50" />

          {/* Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#0f62fe]/15 blur-3xl pointer-events-none" aria-hidden="true" />

          <div className="relative px-8 sm:px-14 py-16 text-center flex flex-col items-center gap-6 glass-card rounded-3xl border-[#0f62fe]/20">
            <Brain size={36} className="text-[#4589ff]" aria-hidden="true" />

            <h2 id="cta-heading" className="text-3xl sm:text-4xl font-bold text-[#f4f4f4] max-w-2xl leading-tight">
              Ready to bring <span className="gradient-text">AI-powered welfare</span> to your organisation?
            </h2>

            <p className="text-[#8d8d8d] max-w-xl leading-relaxed">
              Start with the Eligibility Checker, explore the AI Assistant, or dive into the
              Analytics Dashboard — all powered by IBM enterprise AI.
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <Link to="/eligibility">
                <Button variant="gradient" size="xl">
                  <Sparkles size={16} aria-hidden="true" />
                  Start Checking Eligibility
                </Button>
              </Link>
              <Link to="/assistant">
                <Button variant="secondary" size="xl">
                  <Brain size={16} aria-hidden="true" />
                  Talk to AI Assistant
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ─── HomePage ────────────────────────────────────────────────────────────────  */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TechStackSection />
      <BenefitsSection />
      <CTASection />
    </>
  );
}
