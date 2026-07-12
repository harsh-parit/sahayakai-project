import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  GraduationCap, Building2, Target, Rocket, ArrowRight,
  GitFork, CheckCircle, Clock, TrendingUp,
} from 'lucide-react';
import { TECH_STACK, FUTURE_SCOPE, PROJECT_TIMELINE } from '../constants';
import { fadeInUp, staggerContainer, slideInLeft, slideInRight, scaleIn } from '../utils';
import SectionHeading from '../components/common/SectionHeading';
import Button from '../components/common/Button';

/* ─── About page ─────────────────────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* ── Page hero ────────────────────────────────────────────── */}
      <section className="relative py-24 overflow-hidden ibm-grid-bg" aria-label="About hero">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#0f62fe]/8 blur-3xl" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-5"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0f62fe]/10 border border-[#0f62fe]/25 text-[#4589ff] text-xs font-semibold tracking-widest uppercase"
            >
              <GraduationCap size={12} aria-hidden="true" />
              IBM SkillsBuild × Edunet Foundation Internship
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold text-[#f4f4f4] leading-tight"
            >
              About <span className="gradient-text">SahayakAI</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-base sm:text-lg text-[#8d8d8d] max-w-2xl leading-relaxed"
            >
              SahayakAI is a capstone project developed as part of the IBM SkillsBuild × Edunet
              Foundation AI/ML internship programme — demonstrating how enterprise IBM AI can
              modernise government welfare infrastructure.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Internship Details ────────────────────────────────────── */}
      <section className="py-20" aria-labelledby="internship-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left */}
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <SectionHeading
                tag="Internship Details"
                title="Powered by"
                titleGradient="IBM SkillsBuild"
              />

              {[
                {
                  icon: Building2,
                  label: 'Programme',
                  value: 'IBM SkillsBuild × Edunet Foundation AI/ML Internship',
                },
                {
                  icon: GraduationCap,
                  label: 'Focus Area',
                  value: 'Artificial Intelligence & Machine Learning',
                },
                {
                  icon: Target,
                  label: 'Project Domain',
                  value: 'Government Welfare & Social Impact Technology',
                },
                {
                  icon: Rocket,
                  label: 'Technology Partner',
                  value: 'IBM (AutoAI, Watsonx.ai, Orchestrate, Cloud)',
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4 glass-card rounded-2xl p-5">
                  <div className="w-10 h-10 rounded-xl bg-[#0f62fe]/10 border border-[#0f62fe]/20 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#4589ff]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-[#8d8d8d] uppercase tracking-wider font-medium mb-0.5">{label}</p>
                    <p className="text-sm text-[#f4f4f4] font-semibold">{value}</p>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Right — Project objective */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex flex-col gap-6"
            >
              <SectionHeading
                tag="Project Objective"
                title="What we're"
                titleGradient="solving"
              />

              <div className="glass-card rounded-2xl p-6 space-y-4">
                <p className="text-sm text-[#c6c6c6] leading-relaxed">
                  Millions of eligible citizens are denied welfare benefits every year — not
                  because they don't qualify, but because the systems that decide eligibility are
                  slow, inconsistent, and opaque.
                </p>
                <p className="text-sm text-[#c6c6c6] leading-relaxed">
                  SahayakAI addresses this by replacing manual review with an automated AI pipeline
                  that is fast, consistent, explainable, and accessible to non-technical
                  government officers.
                </p>
                <p className="text-sm text-[#c6c6c6] leading-relaxed">
                  The platform is designed to handle the scale of Indian government welfare
                  programmes — processing thousands of applications per day with IBM Cloud
                  reliability.
                </p>

                {/* Key goals */}
                <ul className="flex flex-col gap-2 pt-2">
                  {[
                    'Eliminate eligibility determination bias',
                    'Reduce decision time from weeks to seconds',
                    'Provide transparent, explainable AI decisions',
                    'Scale to national government infrastructure',
                  ].map((goal) => (
                    <li key={goal} className="flex items-start gap-2 text-sm text-[#8d8d8d]">
                      <CheckCircle size={14} className="text-[#42be65] mt-0.5 shrink-0" aria-hidden="true" />
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Technology Stack ──────────────────────────────────────── */}
      <section className="py-20 bg-white/[0.02] border-y border-white/6" aria-labelledby="tech-about-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Technologies"
            title="Built with"
            titleGradient="IBM AI & Modern Web"
            subtitle="Every component of SahayakAI leverages IBM enterprise AI tools alongside modern open-source web technologies."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
          >
            {TECH_STACK.map((tech) => (
              <motion.div
                key={tech.name}
                variants={scaleIn}
                whileHover={{ scale: 1.04, transition: { duration: 0.18 } }}
                className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 text-center"
              >
                <div className="w-3 h-3 rounded-full" style={{ background: tech.color }} aria-hidden="true" />
                <span className="text-sm font-semibold text-[#f4f4f4]">{tech.name}</span>
                <span className="text-[10px] text-[#8d8d8d] uppercase tracking-wider">{tech.category}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Project Timeline ──────────────────────────────────────── */}
      <section className="py-20" aria-labelledby="timeline-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Development Timeline"
            title="Project"
            titleGradient="Milestones"
            centered
          />

          <div className="relative flex flex-col gap-0">
            {/* Vertical line */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-[#4589ff]/50 via-[#8a3ffc]/30 to-transparent" aria-hidden="true" />

            {PROJECT_TIMELINE.map((item, i) => {
              const statusColor = {
                complete: '#42be65',
                'in-progress': '#4589ff',
                upcoming: '#6f6f6f',
              }[item.status];

              const StatusIcon = item.status === 'complete' ? CheckCircle : item.status === 'in-progress' ? Clock : TrendingUp;

              return (
                <motion.div
                  key={item.phase}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="flex items-center gap-5 py-4 pl-14 relative"
                >
                  {/* Node */}
                  <div
                    className="absolute left-3.5 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-[#0a0a0f]"
                    style={{ borderColor: statusColor }}
                    aria-hidden="true"
                  >
                    <div className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
                  </div>

                  <div className="glass-card rounded-xl px-5 py-3 flex items-center gap-4 flex-1">
                    <StatusIcon size={16} style={{ color: statusColor, flexShrink: 0 }} aria-hidden="true" />
                    <div>
                      <span className="text-[10px] text-[#6f6f6f] font-semibold uppercase tracking-wider">{item.phase}</span>
                      <p className="text-sm text-[#f4f4f4] font-medium">{item.title}</p>
                    </div>
                    <span
                      className="ml-auto text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{ color: statusColor, background: `${statusColor}18`, border: `1px solid ${statusColor}30` }}
                    >
                      {item.status.replace('-', ' ')}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Future Scope ──────────────────────────────────────────── */}
      <section className="py-20 bg-white/[0.02] border-y border-white/6" aria-labelledby="scope-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            tag="Future Scope"
            title="What's"
            titleGradient="coming next"
            subtitle="The roadmap for SahayakAI extends beyond this internship into a full production deployment."
            centered
          />

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto"
          >
            {FUTURE_SCOPE.map((item, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="glass-card rounded-xl p-4 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#0f62fe] to-[#8a3ffc] flex items-center justify-center shrink-0 mt-0.5">
                  <span className="text-[9px] font-bold text-white">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <p className="text-sm text-[#c6c6c6] leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center gap-6 glass-card rounded-3xl p-12"
          >
            <GitFork size={32} className="text-[#4589ff]" aria-hidden="true" />
            <h2 className="text-2xl sm:text-3xl font-bold text-[#f4f4f4]">
              Explore the <span className="gradient-text">source code</span>
            </h2>
            <p className="text-[#8d8d8d] leading-relaxed">
              The full project — including the ML pipeline, React frontend, and IBM integrations —
              will be available on GitHub soon.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/eligibility">
                <Button variant="primary" size="lg">
                  Try Eligibility Checker
                  <ArrowRight size={16} aria-hidden="true" />
                </Button>
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 h-12 px-8 rounded-lg glass-card text-sm font-semibold text-[#f4f4f4] hover:border-white/25 transition-colors duration-150"
              >
                <GitFork size={16} aria-hidden="true" />
                GitHub (Coming Soon)
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
