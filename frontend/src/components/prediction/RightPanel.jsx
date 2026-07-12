import { motion } from 'framer-motion';
import { Brain, Sparkles, GitBranch, Target, FileText, ChevronRight, Info } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../utils';
import {
  PREDICTION_PIPELINE,
  SUPPORTED_SCHEMES,
  REQUIRED_DOCUMENTS,
} from '../../constants';

// ─── Icon map for pipeline steps ─────────────────────────────────────────────
const PIPELINE_ICONS = {
  autoai:      Brain,
  watsonx:     Sparkles,
  orchestrate: GitBranch,
  confidence:  Target,
};

// ─── Sub-panel wrapper ────────────────────────────────────────────────────────
function PanelSection({ title, icon: Icon, children, delay = 0 }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ delay }}
      className="glass-card rounded-2xl p-5 flex flex-col gap-4"
    >
      <div className="flex items-center gap-2.5 pb-3 border-b border-white/8">
        <span className="w-7 h-7 rounded-lg bg-[#0f62fe]/12 border border-[#0f62fe]/20 flex items-center justify-center text-[#4589ff]">
          <Icon size={13} aria-hidden="true" />
        </span>
        <h3 className="text-xs font-semibold text-[#f4f4f4] uppercase tracking-widest">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

// ─── RightPanel ───────────────────────────────────────────────────────────────

/**
 * RightPanel — informational sidebar displayed alongside the EligibilityForm.
 * Shows: prediction pipeline explanation, supported schemes, required documents,
 * and usage tips.
 */
export default function RightPanel() {
  return (
    <motion.aside
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-5"
      aria-label="Eligibility information panel"
    >
      {/* ── 1. How prediction works ─────────────────────────────── */}
      <PanelSection title="How Prediction Works" icon={Brain}>
        <ol className="flex flex-col gap-3">
          {PREDICTION_PIPELINE.map((step, index) => {
            const StepIcon = PIPELINE_ICONS[step.id] || Brain;
            return (
              <li key={step.id} className="flex items-start gap-3">
                {/* Step number + icon */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}
                  >
                    <StepIcon size={15} style={{ color: step.color }} aria-hidden="true" />
                  </div>
                  {/* Vertical connector */}
                  {index < PREDICTION_PIPELINE.length - 1 && (
                    <div className="w-px h-4 bg-white/8" aria-hidden="true" />
                  )}
                </div>

                {/* Label + detail */}
                <div className="flex flex-col gap-0.5 pt-1">
                  <span className="text-xs font-semibold" style={{ color: step.color }}>
                    {step.label}
                  </span>
                  <p className="text-xs text-[#8d8d8d] leading-relaxed">{step.detail}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </PanelSection>

      {/* ── 2. Supported Schemes ────────────────────────────────── */}
      <PanelSection title="Supported Welfare Schemes" icon={Sparkles} delay={0.05}>
        <ul className="flex flex-col gap-2">
          {SUPPORTED_SCHEMES.map((scheme) => (
            <li key={scheme.name} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2 text-xs text-[#c6c6c6]">
                <ChevronRight size={11} className="text-[#4589ff] shrink-0" aria-hidden="true" />
                {scheme.name}
              </span>
              <span className="shrink-0 text-[10px] font-semibold text-[#8d8d8d] bg-white/5 border border-white/8 rounded-full px-2 py-0.5">
                {scheme.domain}
              </span>
            </li>
          ))}
        </ul>
      </PanelSection>

      {/* ── 3. Required Documents ───────────────────────────────── */}
      <PanelSection title="Required Documents" icon={FileText} delay={0.1}>
        <ul className="flex flex-col gap-2">
          {REQUIRED_DOCUMENTS.map((doc) => (
            <li key={doc} className="flex items-start gap-2 text-xs text-[#8d8d8d]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4589ff] mt-1.5 shrink-0" aria-hidden="true" />
              {doc}
            </li>
          ))}
        </ul>
        <p className="text-[10px] text-[#6f6f6f] leading-relaxed border-t border-white/6 pt-3 mt-1">
          Uploading documents is not required at this stage. This checklist helps
          you prepare for the physical verification step.
        </p>
      </PanelSection>

      {/* ── 4. Tips card ────────────────────────────────────────── */}
      <motion.div
        variants={fadeInUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="rounded-2xl p-5 flex flex-col gap-3"
        style={{
          background: 'linear-gradient(135deg, rgba(15,98,254,0.08), rgba(138,63,252,0.06))',
          border: '1px solid rgba(69,137,255,0.15)',
        }}
      >
        <div className="flex items-center gap-2">
          <Info size={14} className="text-[#4589ff]" aria-hidden="true" />
          <h3 className="text-xs font-semibold text-[#4589ff] uppercase tracking-widest">Tips</h3>
        </div>

        <ul className="flex flex-col gap-2">
          {[
            'Fill all fields accurately — the AI model uses every data point.',
            'Annual income should include all household earnings combined.',
            'Caste / category certificate must be issued by a competent authority.',
            'BPL status is automatically cross-checked against SECC 2011 data.',
            'Applications with Aadhaar + bank account get priority routing.',
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2 text-xs text-[#8d8d8d] leading-relaxed">
              <span className="text-[#4589ff] shrink-0 font-bold">›</span>
              {tip}
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.aside>
  );
}
