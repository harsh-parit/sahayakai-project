import { useLocation, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertTriangle, ArrowLeft, RotateCcw,
  Tag, BookOpen, Gauge, Clock, Database, ChevronRight, Brain,
  CheckCircle2,
} from 'lucide-react';
import { ROUTES } from '../constants';
import { fadeInUp, staggerContainer, scaleIn } from '../utils';

// ─── Scheme code → full name map (mirrors backend schemeMapper) ───────────────

const SCHEME_CODE_MAP = {
  IGNOAPS: 'Indira Gandhi National Old Age Pension Scheme',
  IGNWPS:  'Indira Gandhi National Widow Pension Scheme',
  IGNDPS:  'Indira Gandhi National Disability Pension Scheme',
};

/**
 * Resolve a full scheme name from a scheme code.
 * Falls back to the raw code if the code is not in the map.
 */
function resolveScheme(code) {
  if (!code) return { code: 'N/A', name: 'Unknown Scheme' };
  const upperCode = String(code).trim().toUpperCase();
  return {
    code: upperCode,
    name: SCHEME_CODE_MAP[upperCode] ?? String(code).trim(),
  };
}

/**
 * Normalises a confidence value from the backend into a display string.
 * Accepts "92.4%" (string), 0.924 (decimal), or 92.4 (percentage-scale number).
 */
function formatConfidence(raw) {
  if (!raw && raw !== 0) return 'N/A';
  if (typeof raw === 'string') return raw;
  const n = Number(raw);
  if (isNaN(n)) return 'N/A';
  const pct = n > 1 ? n : n * 100;
  return `${pct.toFixed(1)}%`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Single metric tile used in the 4-column summary row. */
function MetricCard({ icon: Icon, label, value, iconColor = '#4589ff', valueColor }) {
  return (
    <motion.div
      variants={scaleIn}
      className="glass-card rounded-2xl p-5 flex flex-col gap-3"
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: `${iconColor}18`, border: `1px solid ${iconColor}30` }}
      >
        <Icon size={18} style={{ color: iconColor }} aria-hidden="true" />
      </div>
      <div>
        <p className="text-[11px] text-[#8d8d8d] uppercase tracking-wider font-medium mb-1">
          {label}
        </p>
        <p
          className="text-lg font-bold leading-tight"
          style={{ color: valueColor ?? '#f4f4f4' }}
        >
          {value}
        </p>
      </div>
    </motion.div>
  );
}

/** Scheme detail block — code badge + full name. */
function SchemeDetailCard({ schemeCode, schemeName }) {
  return (
    <motion.div
      variants={fadeInUp}
      className="glass-card rounded-2xl p-6 flex flex-col gap-4"
    >
      <div className="flex items-center gap-2.5 pb-3 border-b border-white/8">
        <span className="w-7 h-7 rounded-lg bg-[#0f62fe]/12 border border-[#0f62fe]/20 flex items-center justify-center">
          <BookOpen size={13} className="text-[#4589ff]" aria-hidden="true" />
        </span>
        <h3 className="text-xs font-semibold text-[#f4f4f4] uppercase tracking-widest">
          Scheme Details
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Code badge */}
        <div className="flex-shrink-0">
          <p className="text-[10px] text-[#6f6f6f] uppercase tracking-widest mb-1.5">
            Scheme Code
          </p>
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0f62fe]/10 border border-[#0f62fe]/25 text-[#4589ff] text-sm font-bold tracking-widest font-mono">
            {schemeCode}
          </span>
        </div>

        {/* Divider */}
        <div className="hidden sm:block w-px h-12 bg-white/8" aria-hidden="true" />
        <div className="sm:hidden h-px bg-white/8" aria-hidden="true" />

        {/* Full name */}
        <div className="flex-1">
          <p className="text-[10px] text-[#6f6f6f] uppercase tracking-widest mb-1.5">
            Full Scheme Name
          </p>
          <p className="text-[#f4f4f4] font-semibold text-base leading-snug">
            {schemeName}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/** Collapsible raw JSON viewer. */
function RawResponseCard({ raw }) {
  if (!raw) return null;
  return (
    <motion.div
      variants={fadeInUp}
      className="glass-card rounded-2xl p-5 flex flex-col gap-3"
    >
      <div className="flex items-center gap-2.5 pb-3 border-b border-white/8">
        <span className="w-7 h-7 rounded-lg bg-[#8a3ffc]/12 border border-[#8a3ffc]/20 flex items-center justify-center">
          <Database size={13} className="text-[#be95ff]" aria-hidden="true" />
        </span>
        <h3 className="text-xs font-semibold text-[#f4f4f4] uppercase tracking-widest">
          Raw IBM AutoAI Response
        </h3>
      </div>
      <pre className="text-[11px] text-[#8d8d8d] bg-black/30 rounded-xl p-4 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
        {JSON.stringify(raw, null, 2)}
      </pre>
    </motion.div>
  );
}

// ─── No-data fallback (direct URL access without navigation state) ─────────────
function NoResultFallback() {
  return (
    <div className="min-h-screen ibm-grid-bg flex items-center">
      <div className="max-w-xl mx-auto px-4 py-24 text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-2xl bg-[#f1c21b]/10 border border-[#f1c21b]/25 flex items-center justify-center">
          <AlertTriangle size={28} className="text-[#f1c21b]" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-[#f4f4f4]">No Result Found</h1>
        <p className="text-[#8d8d8d] leading-relaxed">
          This page must be reached by submitting the eligibility form. No prediction
          data was found in the navigation state.
        </p>
        <Link
          to={ROUTES.ELIGIBILITY}
          className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#0f62fe] text-white text-sm font-semibold hover:bg-[#0043ce] transition-colors"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back to Form
        </Link>
      </div>
    </div>
  );
}

// ─── ResultPage ───────────────────────────────────────────────────────────────
/**
 * Displays the IBM AutoAI prediction result received via React Router location
 * state after a successful form submission from EligibilityPage.
 *
 * Expected location.state shape (set by EligibilityPage):
 *   {
 *     prediction: {
 *       success: boolean,
 *       prediction: {
 *         schemeCode: string,   // e.g. "IGNOAPS"
 *         schemeName: string,   // e.g. "Indira Gandhi National Old Age Pension Scheme"
 *         confidence: string,   // e.g. "92.4%"
 *         raw: object           // raw IBM AutoAI JSON response
 *       },
 *       timestamp: string       // ISO-8601
 *     },
 *     submittedAt: string,
 *     formData: object
 *   }
 */
export default function ResultPage() {
  const location = useLocation();
  const navigate  = useNavigate();
  const state     = location.state;

  // Guard: no state means the user navigated here directly without a form submission
  if (!state?.prediction) {
    return <NoResultFallback />;
  }

  const { prediction: envelope, submittedAt, formData } = state;

  // Backend response shape: { success, prediction: { schemeCode, schemeName, confidence, raw }, timestamp }
  const pred         = envelope?.prediction ?? {};
  const rawCode      = pred.schemeCode ?? pred.scheme ?? '';     // support legacy 'scheme' key
  const confidence   = pred.confidence  ?? null;
  const raw          = pred.raw         ?? null;
  const apiTimestamp = envelope?.timestamp ?? submittedAt;

  // Resolve full scheme name (frontend lookup — also confirmed by backend schemeName)
  const { code: schemeCode, name: schemeName } = resolveScheme(
    rawCode || pred.schemeName
  );

  // Display name: prefer backend-provided schemeName, fall back to local lookup
  const displayName = pred.schemeName || schemeName;

  // Formatted timestamp for the metric card
  const formattedTime = apiTimestamp
    ? new Date(apiTimestamp).toLocaleTimeString('en-IN', {
        hour:   '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'N/A';

  return (
    <div className="min-h-screen ibm-grid-bg relative">
      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-[#0f62fe]/6 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-[#8a3ffc]/5 blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-8"
        >
          {/* ── Back navigation ─────────────────────────────────────── */}
          <motion.div variants={fadeInUp} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(ROUTES.ELIGIBILITY)}
              className="inline-flex items-center gap-1.5 text-sm text-[#8d8d8d] hover:text-[#4589ff] transition-colors"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              Back to Form
            </button>
          </motion.div>

          {/* ── Hero result card ─────────────────────────────────────── */}
          <motion.div
            variants={scaleIn}
            className="glass-card rounded-3xl p-8 sm:p-10 flex flex-col gap-6 relative overflow-hidden"
          >
            {/* Subtle blue accent glow */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at top right, rgba(15,98,254,0.18), transparent 70%)',
              }}
              aria-hidden="true"
            />

            <div className="relative flex flex-col gap-5">
              {/* IBM AutoAI badge */}
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0f62fe]/10 border border-[#0f62fe]/25 text-[#4589ff] text-[11px] font-semibold tracking-widest uppercase">
                  <Brain size={11} aria-hidden="true" />
                  IBM AutoAI Prediction
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#42be65]/10 border border-[#42be65]/25 text-[#42be65] text-[11px] font-semibold tracking-widest uppercase">
                  <CheckCircle2 size={11} aria-hidden="true" />
                  Completed
                </span>
              </div>

              {/* Scheme code + name */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 14 }}
                    className="mt-0.5 w-9 h-9 rounded-xl bg-[#0f62fe]/10 border border-[#0f62fe]/25 flex items-center justify-center flex-shrink-0"
                  >
                    <Tag size={18} className="text-[#4589ff]" aria-hidden="true" />
                  </motion.div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#4589ff] mb-1">
                      Predicted Scheme
                    </p>
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#f4f4f4] leading-tight">
                      {displayName}
                    </h1>
                    <p className="mt-1.5 text-sm font-mono text-[#6f6f6f] tracking-widest">
                      {schemeCode}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submitted district info chips */}
              {formData && (
                <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                  {[
                    { label: 'District',  value: formData.districtname },
                    { label: 'State',     value: formData.statename    },
                    { label: 'Fin. Year', value: formData.finyear      },
                  ].map(({ label, value }) =>
                    value ? (
                      <span key={label} className="flex items-center gap-1.5 text-xs text-[#8d8d8d]">
                        <ChevronRight size={10} className="text-[#4589ff]" aria-hidden="true" />
                        <span className="text-[#6f6f6f]">{label}:</span>{' '}
                        <span className="text-[#c6c6c6] font-medium">{value}</span>
                      </span>
                    ) : null
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* ── 4-column metric cards ────────────────────────────────── */}
          <motion.div
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-4 gap-4"
          >
            <MetricCard
              icon={Tag}
              label="Scheme Code"
              value={schemeCode}
              iconColor="#4589ff"
            />
            <MetricCard
              icon={BookOpen}
              label="Scheme Name"
              value={displayName}
              iconColor="#0f62fe"
            />
            <MetricCard
              icon={Gauge}
              label="Confidence"
              value={formatConfidence(confidence)}
              iconColor="#42be65"
              valueColor="#42be65"
            />
            <MetricCard
              icon={Clock}
              label="Timestamp"
              value={formattedTime}
              iconColor="#8d8d8d"
            />
          </motion.div>

          {/* ── Scheme detail block ──────────────────────────────────── */}
          <SchemeDetailCard schemeCode={schemeCode} schemeName={displayName} />

          {/* ── Raw IBM AutoAI response ──────────────────────────────── */}
          <RawResponseCard raw={raw} />

          {/* ── Action buttons ───────────────────────────────────────── */}
          <motion.div
            variants={fadeInUp}
            className="flex flex-wrap items-center gap-3 pt-2"
          >
            <motion.button
              type="button"
              onClick={() => navigate(ROUTES.ELIGIBILITY)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 h-11 px-7 rounded-xl bg-[#0f62fe] text-white text-sm font-semibold hover:bg-[#0043ce] transition-colors shadow-lg shadow-blue-900/25"
            >
              <RotateCcw size={15} aria-hidden="true" />
              New Prediction
            </motion.button>

            <Link
              to={ROUTES.HOME}
              className="inline-flex items-center gap-2 h-11 px-6 rounded-xl glass-card text-sm font-semibold text-[#f4f4f4] hover:border-white/25 transition-colors"
            >
              <ArrowLeft size={15} aria-hidden="true" />
              Home
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
}
