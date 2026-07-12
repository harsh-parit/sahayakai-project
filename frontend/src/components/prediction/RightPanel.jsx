import { motion } from 'framer-motion';
import { Brain, Sparkles, GitBranch, Target, FileText, ChevronRight, Info } from 'lucide-react';
import { fadeInUp, staggerContainer } from '../../utils';
import { PREDICTION_PIPELINE } from '../../constants';

// ─── Icon map for pipeline steps ─────────────────────────────────────────────
const PIPELINE_ICONS = {
  autoai:      Brain,
  watsonx:     Sparkles,
  orchestrate: GitBranch,
  confidence:  Target,
};

// AutoAI input field descriptions for the info panel
const FIELD_GUIDE = [
  { field: 'finyear',           label: 'Financial Year',        hint: 'Format: YYYY-YY e.g. 2023-24' },
  { field: 'lgdstatecode',      label: 'LGD State Code',        hint: 'Numeric code from Local Government Directory' },
  { field: 'lgddistrictcode',   label: 'LGD District Code',     hint: 'Numeric district code from LGD portal' },
  { field: 'totalbeneficiaries',label: 'Total Beneficiaries',   hint: 'All registered beneficiaries in the district' },
  { field: 'totalaadhaar',      label: 'Aadhaar Linked',        hint: 'Beneficiaries with Aadhaar seeding done' },
  { field: 'totalmpbilenumber', label: 'Mobile Registered',     hint: 'Beneficiaries with mobile number on record' },
];

// Sub-panel wrapper
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

/**
 * RightPanel — informational sidebar for the government statistics form.
 * Shows: prediction pipeline, AutoAI field guide, and data tips.
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
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: `${step.color}18`, border: `1px solid ${step.color}30` }}
                  >
                    <StepIcon size={15} style={{ color: step.color }} aria-hidden="true" />
                  </div>
                  {index < PREDICTION_PIPELINE.length - 1 && (
                    <div className="w-px h-4 bg-white/8" aria-hidden="true" />
                  )}
                </div>
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

      {/* ── 2. AutoAI Field Guide ────────────────────────────────── */}
      <PanelSection title="AutoAI Input Fields" icon={FileText} delay={0.05}>
        <ul className="flex flex-col gap-2.5">
          {FIELD_GUIDE.map(({ field, label, hint }) => (
            <li key={field} className="flex flex-col gap-0.5">
              <span className="flex items-center gap-2 text-xs text-[#c6c6c6] font-medium">
                <ChevronRight size={11} className="text-[#4589ff] shrink-0" aria-hidden="true" />
                {label}
              </span>
              <span className="text-[11px] text-[#6f6f6f] pl-4">{hint}</span>
            </li>
          ))}
        </ul>
      </PanelSection>

      {/* ── 3. Data Tips ─────────────────────────────────────────── */}
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
          <h3 className="text-xs font-semibold text-[#4589ff] uppercase tracking-widest">Data Tips</h3>
        </div>
        <ul className="flex flex-col gap-2">
          {[
            'Use official LGD portal codes for state and district.',
            'Category totals (SC + ST + Gen + OBC) should equal total beneficiaries.',
            'Aadhaar count cannot exceed total beneficiaries.',
            'Mobile numbers include all registered contacts, not unique persons.',
            'Financial year format must be YYYY-YY (e.g. 2023-24).',
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
